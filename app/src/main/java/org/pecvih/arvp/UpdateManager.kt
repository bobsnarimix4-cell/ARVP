package org.pecvih.arvp

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

object UpdateManager {

    private const val TAG = "ARVP_Update"
    private const val UPDATE_URL = "https://bobsnarimix4-cell.github.io/ARVP/gh-pages/update.json"
    private const val UPDATE_FILE = "index.html.enc"
    private const val PREFS_NAME = "arvp_updates"
    private const val KEY_VERSION_CODE = "last_version_code"

    data class UpdateInfo(
        val version: String,
        val versionCode: Long,
        val sha256: String,
        val url: String,
        val releaseNotes: String
    )

    enum class UpdateResult {
        NO_NETWORK,
        NO_UPDATE,
        HASH_MISMATCH,
        DOWNLOAD_FAILED,
        APPLIED,
        ERROR
    }

    @Volatile
    var lastAppliedVersion: String = ""
        private set

    @Volatile
    var lastResult: UpdateResult = UpdateResult.NO_UPDATE
        private set

    @Volatile
    var lastError: String = ""
        private set

    fun checkAndApply(context: Context): UpdateResult {
        lastError = ""
        try {
            val info = fetchUpdateInfo(context)
            if (info == null) {
                lastResult = UpdateResult.NO_UPDATE
                Log.i(TAG, "Already up to date")
                return UpdateResult.NO_UPDATE
            }
            Log.i(TAG, "Update found: ${info.version} (code=${info.versionCode})")

            val data = downloadEncrypted(info)
            if (data == null) {
                lastResult = UpdateResult.DOWNLOAD_FAILED
                lastError = "Download failed: ${info.url}"
                Log.e(TAG, "Failed to download encrypted bundle")
                return UpdateResult.DOWNLOAD_FAILED
            }

            val computedHash = MessageDigest.getInstance("SHA-256")
                .digest(data.toByteArray(Charsets.UTF_8))
                .joinToString("") { "%02x".format(it) }

            Log.i(TAG, "Computed hash: $computedHash")
            Log.i(TAG, "Expected hash: ${info.sha256}")

            if (!computedHash.equals(info.sha256, ignoreCase = true)) {
                lastResult = UpdateResult.HASH_MISMATCH
                lastError = "Expected: ${info.sha256}, Got: $computedHash"
                Log.e(TAG, "Hash mismatch!")
                return UpdateResult.HASH_MISMATCH
            }

            val file = File(context.filesDir, UPDATE_FILE)
            file.writeText(data, Charsets.UTF_8)
            Log.i(TAG, "Written ${data.length} chars to ${file.absolutePath}")

            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit().putLong(KEY_VERSION_CODE, info.versionCode).apply()
            Log.i(TAG, "Saved versionCode ${info.versionCode} to SharedPreferences")

            lastAppliedVersion = info.version
            lastResult = UpdateResult.APPLIED
            Log.i(TAG, "UPDATE APPLIED: ${info.version}")
            return UpdateResult.APPLIED
        } catch (e: Exception) {
            lastResult = UpdateResult.ERROR
            lastError = e.message ?: "Unknown error"
            Log.e(TAG, "Update error: ${e.message}", e)
            return UpdateResult.ERROR
        }
    }

    fun clearUpdate(context: Context) {
        val file = File(context.filesDir, UPDATE_FILE)
        if (file.exists()) file.delete()
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().clear().apply()
        lastAppliedVersion = ""
        lastResult = UpdateResult.NO_UPDATE
        lastError = ""
        Log.i(TAG, "Update data cleared")
    }

    private fun fetchUpdateInfo(context: Context): UpdateInfo? {
        val conn = URL(UPDATE_URL).openConnection() as HttpURLConnection
        try {
            conn.connectTimeout = 15000
            conn.readTimeout = 15000
            conn.setRequestProperty("Cache-Control", "no-cache, no-store, must-revalidate")
            conn.setRequestProperty("Pragma", "no-cache")
            conn.connect()

            if (conn.responseCode != 200) {
                val msg = "HTTP ${conn.responseCode} from update.json"
                lastError = msg
                Log.e(TAG, msg)
                throw Exception(msg)
            }

            val body = conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }

            val json = JSONObject(body)
            val info = UpdateInfo(
                version = json.optString("version", "0.0.0"),
                versionCode = json.optLong("versionCode", 0),
                sha256 = json.optString("sha256", ""),
                url = json.optString("url", ""),
                releaseNotes = json.optString("releaseNotes", "")
            )

            val lastCode = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getLong(KEY_VERSION_CODE, 0)

            Log.i(TAG, "Remote: v${info.version} code=${info.versionCode} | Local: lastCode=$lastCode")

            if (info.versionCode <= lastCode) {
                Log.i(TAG, "No update needed (remote=$lastCode <= local=$lastCode)")
                return null
            }

            if (info.url.isEmpty()) {
                lastError = "Empty download URL in update.json"
                throw Exception(lastError)
            }

            return info
        } finally {
            conn.disconnect()
        }
    }

    private fun downloadEncrypted(info: UpdateInfo): String? {
        val conn = URL(info.url).openConnection() as HttpURLConnection
        try {
            conn.connectTimeout = 30000
            conn.readTimeout = 30000
            conn.connect()

            if (conn.responseCode != 200) {
                val msg = "HTTP ${conn.responseCode} downloading bundle"
                lastError = msg
                Log.e(TAG, msg)
                return null
            }

            val data = conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            Log.i(TAG, "Downloaded ${data.length} chars from ${info.url}")
            return data
        } catch (e: Exception) {
            lastError = "Download error: ${e.message}"
            Log.e(TAG, "downloadEncrypted failed: ${e.message}")
            return null
        } finally {
            conn.disconnect()
        }
    }
}
