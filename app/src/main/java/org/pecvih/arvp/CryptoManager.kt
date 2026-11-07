package org.pecvih.arvp

import android.content.Context
import android.util.Base64
import android.util.Log
import org.json.JSONObject
import java.io.File
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

object CryptoManager {

    private const val TAG = "CryptoManager"
    private const val NAMESPACE = "com.example.arvp"
    private const val SALT = "ARVP_SALT_2024_v1"
    private const val ALGO = "AES/CBC/PKCS5Padding"
    private const val ENC_FILE = "index.html.enc"

    @Volatile
    private var cachedKey: ByteArray? = null

    private fun deriveKey(): ByteArray {
        val existing = cachedKey
        if (existing != null) return existing
        val input = (NAMESPACE + SALT).toByteArray(Charsets.UTF_8)
        val key = MessageDigest.getInstance("SHA-256").digest(input)
        cachedKey = key
        return key
    }

    fun decrypt(context: Context): String? {
        val internalFile = File(context.filesDir, ENC_FILE)
        if (!internalFile.exists()) {
            val assetRaw = readAssetRaw(context) ?: return null
            return decryptRaw(assetRaw)
        }

        return try {
            val internalRaw = internalFile.readText(Charsets.UTF_8)
            val internalHtml = decryptRaw(internalRaw)
            val assetRaw = readAssetRaw(context)
            val assetHtml = if (assetRaw != null) decryptRaw(assetRaw) else null

            val internalVersion = extractVersion(internalHtml)
            val assetVersion = extractVersion(assetHtml)

            Log.i(TAG, "Asset Version: $assetVersion | Internal Version: $internalVersion")

            if (assetHtml != null && assetVersion != null && (internalVersion == null || compareVersions(assetVersion, internalVersion) >= 0)) {
                Log.i(TAG, "Asset version ($assetVersion) >= Internal ($internalVersion). Purging internal file.")
                internalFile.delete()
                assetHtml
            } else {
                internalHtml ?: assetHtml
            }
        } catch (e: Exception) {
            Log.e(TAG, "Decryption failed: ${e.message}")
            internalFile.delete()
            val assetRaw = readAssetRaw(context) ?: return null
            decryptRaw(assetRaw)
        }
    }

    private fun readAssetRaw(context: Context): String? {
        return try {
            context.assets.open(ENC_FILE).bufferedReader(Charsets.UTF_8).use { it.readText() }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to read asset: ${e.message}")
            null
        }
    }

    private fun decryptRaw(content: String): String? {
        return try {
            val json = JSONObject(content)
            val iv = Base64.decode(json.getString("iv"), Base64.NO_WRAP)
            val data = Base64.decode(json.getString("data"), Base64.NO_WRAP)

            val keySpec = SecretKeySpec(deriveKey(), "AES")
            val ivSpec = IvParameterSpec(iv)
            val cipher = Cipher.getInstance(ALGO)
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec)
            val decrypted = cipher.doFinal(data)
            String(decrypted, Charsets.UTF_8)
        } catch (e: Exception) {
            Log.e(TAG, "decryptRaw failed: ${e.message}")
            null
        }
    }

    fun getAssetVersion(context: Context): String? {
        val raw = readAssetRaw(context) ?: return null
        val html = decryptRaw(raw)
        return extractVersion(html)
    }

    fun getInstalledVersion(context: Context): String? {
        val internalFile = File(context.filesDir, ENC_FILE)
        if (internalFile.exists()) {
            return try {
                val content = internalFile.readText(Charsets.UTF_8)
                val html = decryptRaw(content)
                extractVersion(html)
            } catch (e: Exception) { null }
        }
        return getAssetVersion(context)
    }

    private fun extractVersion(html: String?): String? {
        if (html == null) return null
        val regex = Regex("""version:\s*["']([^"']+)["']""")
        return regex.find(html)?.groupValues?.get(1)
    }

    fun compareVersions(v1: String, v2: String): Int {
        val parts1 = v1.split(".").mapNotNull { it.toIntOrNull() }
        val parts2 = v2.split(".").mapNotNull { it.toIntOrNull() }
        val maxLen = maxOf(parts1.size, parts2.size)
        for (i in 0 until maxLen) {
            val p1 = parts1.getOrElse(i) { 0 }
            val p2 = parts2.getOrElse(i) { 0 }
            if (p1 != p2) return p1.compareTo(p2)
        }
        return 0
    }

    fun hasInternalUpdate(context: Context): Boolean {
        return File(context.filesDir, ENC_FILE).exists()
    }
}
