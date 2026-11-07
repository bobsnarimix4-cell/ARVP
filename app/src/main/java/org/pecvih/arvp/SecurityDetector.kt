package org.pecvih.arvp

import android.app.Activity
import android.content.Context
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import java.io.File

object SecurityDetector {

    private const val TAG = "SecurityDetector"

    // INTERRUPTEUR DÉVELOPPEUR : Passer à 'true' pour fermer l'application, 'false' pour l'ouvrir
    const val IS_APP_DISABLED = false

    const val DEVELOPER_EMAIL = "bobsnarimix4@gmail.com"

    fun isRemoteDisabled(context: Context): Boolean {
        return context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
            .getBoolean("remote_disabled", false)
    }

    fun setRemoteDisabled(context: Context, disabled: Boolean) {
        context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
            .edit().putBoolean("remote_disabled", disabled).apply()
    }

    fun isDeviceCompromised(context: Context): Boolean {
        if (BuildConfig.DEBUG) return false
        return isRooted() || isEmulator() || isDebugged(context)
    }

    private fun isRooted(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/system/xbin/su",
            "/system/bin/su",
            "/sbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su"
        )
        for (p in paths) {
            if (File(p).exists()) return true
        }

        return try {
            val process = Runtime.getRuntime().exec(arrayOf("/system/xbin/which", "su"))
            val reader = process.inputStream.bufferedReader()
            val result = reader.readLine()
            reader.close()
            process.destroy()
            result != null
        } catch (e: Exception) {
            false
        }
    }

    private fun isEmulator(): Boolean {
        if (Build.FINGERPRINT.startsWith("generic") || Build.FINGERPRINT.startsWith("unknown")) return true
        if (Build.MODEL.contains("google_sdk") || Build.MODEL.contains("Emulator") || Build.MODEL.contains("Android SDK built for x86")) return true
        if (Build.MANUFACTURER.contains("Genymotion")) return true
        if (Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic")) return true
        if ("google_sdk" == Build.PRODUCT) return true
        if (Build.HARDWARE.contains("goldfish") || Build.HARDWARE.contains("ranchu")) return true
        return false
    }

    private fun isDebugged(context: Context): Boolean {
        return try {
            (context.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
        } catch (e: Exception) {
            false
        }
    }

    fun showBlockScreen(activity: Activity) {
        val blockView = FrameLayout(activity).apply {
            setBackgroundColor(0xFF0D2F7A.toInt())
            id = View.generateViewId()
        }

        val message = TextView(activity).apply {
            text = "\u26D4 Acc\u00E8s bloqu\u00E9\n\n" +
                    "L\u0027int\u00E9grit\u00E9 de l\u0027application a \u00E9t\u00E9 compromise.\n\n" +
                    "Cette application n\u0027est pas autoris\u00E9e \u00E0 s\u0027ex\u00E9cuter\n" +
                    "sur cet appareil."
            setTextColor(0xFFFFFFFF.toInt())
            textSize = 18f
            setPadding(80, 0, 80, 0)
            gravity = android.view.Gravity.CENTER
        }

        blockView.addView(message, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        val decorView = activity.window.decorView as ViewGroup
        decorView.addView(blockView, ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        activity.window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )
    }

    fun showDeveloperDisabledScreen(activity: Activity) {
        val rootLayout = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            gravity = android.view.Gravity.CENTER
            setBackgroundColor(0xFF0D2F7A.toInt())
            setPadding(60, 60, 60, 60)
        }

        val card = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            gravity = android.view.Gravity.CENTER
            setPadding(60, 80, 60, 80)
            val bg = android.graphics.drawable.GradientDrawable().apply {
                setColor(0xFFFFFFFF.toInt())
                cornerRadius = 48f
            }
            background = bg
        }

        val iconText = TextView(activity).apply {
            text = "🔒"
            textSize = 48f
            gravity = android.view.Gravity.CENTER
        }

        val titleText = TextView(activity).apply {
            text = "Application Fermée"
            setTextColor(0xFF0D2F7A.toInt())
            textSize = 22f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            gravity = android.view.Gravity.CENTER
            setPadding(0, 20, 0, 20)
        }

        val messageText = TextView(activity).apply {
            text = "Cette application a été fermée par son développeur.\n\nMerci de le contacter au besoin par e-mail :"
            setTextColor(0xFF333333.toInt())
            textSize = 15f
            gravity = android.view.Gravity.CENTER
            setPadding(0, 10, 0, 30)
        }

        val emailButton = TextView(activity).apply {
            text = DEVELOPER_EMAIL
            setTextColor(0xFFFFFFFF.toInt())
            textSize = 15f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            gravity = android.view.Gravity.CENTER
            setPadding(40, 25, 40, 25)
            val btnBg = android.graphics.drawable.GradientDrawable().apply {
                setColor(0xFF0E7A4E.toInt())
                cornerRadius = 30f
            }
            background = btnBg
            setOnClickListener {
                try {
                    val intent = android.content.Intent(android.content.Intent.ACTION_SENDTO).apply {
                        data = android.net.Uri.parse("mailto:$DEVELOPER_EMAIL")
                        putExtra(android.content.Intent.EXTRA_SUBJECT, "Demande d'accès - Application ARV.P")
                    }
                    activity.startActivity(intent)
                } catch (e: Exception) {
                    android.widget.Toast.makeText(activity, DEVELOPER_EMAIL, android.widget.Toast.LENGTH_LONG).show()
                }
            }
        }

        card.addView(iconText)
        card.addView(titleText)
        card.addView(messageText)
        card.addView(emailButton)

        rootLayout.addView(card, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ))

        val decorView = activity.window.decorView as ViewGroup
        decorView.addView(rootLayout, ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))
    }

    fun isTampered(context: Context, currentHtml: String): Boolean {
        val prefs = context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
        val storedHash = prefs.getString("assets_hash", null) ?: return false

        return try {
            val currentHash = java.security.MessageDigest.getInstance("SHA-256")
                .digest(currentHtml.toByteArray(Charsets.UTF_8))
                .joinToString("") { "%02x".format(it) }
            currentHash != storedHash
        } catch (e: Exception) {
            false
        }
    }

    fun storeIntegrityHash(context: Context, html: String) {
        val hash = java.security.MessageDigest.getInstance("SHA-256")
            .digest(html.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }
        context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
            .edit().putString("assets_hash", hash).apply()
    }
}
