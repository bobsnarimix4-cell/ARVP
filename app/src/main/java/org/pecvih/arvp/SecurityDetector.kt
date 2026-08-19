package org.pecvih.arvp

import android.app.Activity
import android.content.Context
import android.os.Build
import android.provider.Settings
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.TextView
import java.io.File

object SecurityDetector {

    private const val TAG = "SecurityDetector"

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

    fun isTampered(context: Context): Boolean {
        val prefs = context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
        val storedHash = prefs.getString("assets_hash", null) ?: return false

        return try {
            val files = arrayOf("css/styles.css", "js/data.js", "js/app.js", "js/classification.js", "js/render.js", "js/ui.js")
            val sb = StringBuilder()
            for (f in files) {
                try {
                    context.assets.open("www/$f").bufferedReader().use { sb.append(it.readText()) }
                } catch (_: Exception) {}
            }
            val currentHash = java.security.MessageDigest.getInstance("SHA-256")
                .digest(sb.toString().toByteArray())
                .joinToString("") { "%02x".format(it) }
            currentHash != storedHash
        } catch (e: Exception) {
            false
        }
    }

    fun storeIntegrityHash(context: Context, html: String) {
        val hash = java.security.MessageDigest.getInstance("SHA-256")
            .digest(html.toByteArray())
            .joinToString("") { "%02x".format(it) }
        context.getSharedPreferences("arvp_security", Context.MODE_PRIVATE)
            .edit().putString("assets_hash", hash).apply()
    }
}
