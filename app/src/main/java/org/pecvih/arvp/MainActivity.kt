package org.pecvih.arvp

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.pecvih.arvp.ui.theme.ARVPédiatriqueTheme

class MainActivity : ComponentActivity() {

    private val isReady = mutableStateOf(false)
    private var webView: WebView? = null
    private var wasUpdated = false
    private var updateCheckRunning = false

    private fun loadContent() {
        lifecycleScope.launch {
            val html = withContext(Dispatchers.IO) {
                CryptoManager.decrypt(this@MainActivity)
            }
            val version = UpdateManager.lastAppliedVersion
            withContext(Dispatchers.Main) {
                webView?.loadDataWithBaseURL(
                    "file:///android_asset/www/",
                    html ?: "<html><body style='display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#0d2f7a;'><h2>Erreur de chargement</h2></body></html>",
                    "text/html",
                    "UTF-8",
                    null
                )
                if (version.isNotEmpty()) {
                    webView?.evaluateJavascript(makeToastJS("Mise à jour appliquée — v$version", "#0e7a4e"), null)
                }
            }
        }
    }

    private fun runUpdateCheck() {
        if (updateCheckRunning) return
        updateCheckRunning = true
        Log.i(TAG, "Starting update check...")
        lifecycleScope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    UpdateManager.checkAndApply(this@MainActivity)
                }
                withContext(Dispatchers.Main) {
                    when (result) {
                        UpdateManager.UpdateResult.APPLIED -> {
                            Toast.makeText(
                                this@MainActivity,
                                "Mise à jour appliquée — v${UpdateManager.lastAppliedVersion}",
                                Toast.LENGTH_LONG
                            ).show()
                            loadContent()
                        }
                        UpdateManager.UpdateResult.NO_NETWORK -> {
                            Log.w(TAG, "No network: ${UpdateManager.lastError}")
                        }
                        UpdateManager.UpdateResult.HASH_MISMATCH -> {
                            Toast.makeText(
                                this@MainActivity,
                                "Erreur: hash invalide — ${UpdateManager.lastError}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        UpdateManager.UpdateResult.DOWNLOAD_FAILED -> {
                            Toast.makeText(
                                this@MainActivity,
                                "Téléchargement échoué — ${UpdateManager.lastError}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        UpdateManager.UpdateResult.ERROR -> {
                            Log.e(TAG, "Update error: ${UpdateManager.lastError}")
                            Toast.makeText(
                                this@MainActivity,
                                "Erreur: ${UpdateManager.lastError}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        UpdateManager.UpdateResult.NO_UPDATE -> {
                            Log.i(TAG, "Already up to date")
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Update check crashed: ${e.message}", e)
            } finally {
                updateCheckRunning = false
            }
        }
    }

    private fun startPeriodicCheck() {
        lifecycleScope.launch {
            delay(60_000L)
            while (true) {
                runUpdateCheck()
                delay(CHECK_INTERVAL_MS)
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        splashScreen.setKeepOnScreenCondition { !isReady.value }

        if (SecurityDetector.isDeviceCompromised(this)) {
            SecurityDetector.showBlockScreen(this)
            isReady.value = true
            return
        }

        enableEdgeToEdge()
        val html = CryptoManager.decrypt(this)

        setContent {
            ARVPédiatriqueTheme {
                if (webView == null) {
                    webView = WebView(this@MainActivity).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.allowFileAccess = true
                        settings.cacheMode = WebSettings.LOAD_NO_CACHE
                        settings.databaseEnabled = true
                        clearCache(true)
                        setBackgroundColor(android.graphics.Color.TRANSPARENT)

                        webViewClient = object : WebViewClient() {
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                if (wasUpdated) {
                                    view?.evaluateJavascript(
                                        makeToastJS("Application mise à jour — v${UpdateManager.lastAppliedVersion}", "#0e7a4e"),
                                        null
                                    )
                                }
                                isReady.value = true
                            }
                            override fun shouldOverrideUrlLoading(
                                view: WebView?,
                                request: WebResourceRequest?
                            ) = false
                        }
                        webChromeClient = WebChromeClient()

                        addJavascriptInterface(UpdateBridge(), "ARVPUpdate")

                        if (html != null) {
                            loadDataWithBaseURL(
                                "file:///android_asset/www/",
                                html,
                                "text/html",
                                "UTF-8",
                                null
                            )
                            SecurityDetector.storeIntegrityHash(this@MainActivity, html)
                        } else {
                            loadDataWithBaseURL(
                                "file:///android_asset/www/",
                                "<html><body style='display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#0d2f7a;'><h2>Erreur de chargement</h2></body></html>",
                                "text/html",
                                "UTF-8",
                                null
                            )
                            isReady.value = true
                        }
                    }
                }
                val wv = webView!!
                BackHandler(enabled = wv.canGoBack()) {
                    wv.goBack()
                }
                AndroidView(
                    factory = { wv },
                    modifier = Modifier.fillMaxSize()
                )
            }
        }

        runUpdateCheck()
        startPeriodicCheck()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView?.saveState(outState)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView?.restoreState(savedInstanceState)
    }

    inner class UpdateBridge {
        @JavascriptInterface
        fun checkForUpdate() {
            runUpdateCheck()
        }

        @JavascriptInterface
        fun forceUpdate() {
            UpdateManager.clearUpdate(this@MainActivity)
            runUpdateCheck()
        }
    }

    companion object {
        private const val TAG = "ARVP_Main"
        private const val CHECK_INTERVAL_MS = 5 * 60 * 1000L

        private fun makeToastJS(message: String, color: String): String {
            val escaped = message.replace("'", "\\'")
            return """
                (function(){
                    var old=document.getElementById('arvp-toast');
                    if(old)old.remove();
                    var s=document.createElement('style');
                    s.textContent='@keyframes arvpSlideIn{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}';
                    document.head.appendChild(s);
                    var t=document.createElement('div');
                    t.id='arvp-toast';
                    t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:$color;color:#fff;padding:12px 24px;border-radius:30px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 6px 24px rgba(0,0,0,.3);font-family:DM Sans,sans-serif;animation:arvpSlideIn .4s ease;white-space:nowrap;';
                    t.textContent='\u2705 $escaped';
                    document.body.appendChild(t);
                    setTimeout(function(){t.style.transition='opacity .5s';t.style.opacity='0';setTimeout(function(){t.remove()},500)},4000);
                })();
            """.trimIndent()
        }
    }
}
