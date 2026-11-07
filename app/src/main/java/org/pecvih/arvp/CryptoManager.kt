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
    // Key seed namespace matching the initial asset encryption scheme
    private const val NAMESPACE = "com.example.arvp"
    private const val SALT = "ARVP_SALT_2024_v1"
    private const val ALGO = "AES/CBC/PKCS5Padding"
    private const val ENC_FILE = "index.html.enc"

    private fun deriveKey(): ByteArray {
        val input = (NAMESPACE + SALT).toByteArray(Charsets.UTF_8)
        return MessageDigest.getInstance("SHA-256").digest(input)
    }

    fun decrypt(context: Context): String? {
        val content = readEncryptedContent(context) ?: return null
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
            Log.e(TAG, "Decryption failed: ${e.message}", e)
            null
        }
    }

    private fun readEncryptedContent(context: Context): String? {
        val assetContent = try {
            context.assets.open(ENC_FILE).bufferedReader(Charsets.UTF_8).use { it.readText() }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to read asset: ${e.message}")
            null
        }

        val internalFile = File(context.filesDir, ENC_FILE)
        if (internalFile.exists()) {
            try {
                val internalContent = internalFile.readText(Charsets.UTF_8)
                val internalVersion = extractVersion(decryptContent(internalContent))
                val assetVersion = extractVersion(decryptContent(assetContent ?: ""))

                Log.i(TAG, "Asset Version: $assetVersion | Internal Version: $internalVersion")

                if (assetVersion != null && (internalVersion == null || compareVersions(assetVersion, internalVersion) >= 0)) {
                    Log.i(TAG, "Asset version ($assetVersion) >= Internal ($internalVersion). Purging internal file.")
                    internalFile.delete()
                    return assetContent
                }
                return internalContent
            } catch (e: Exception) {
                Log.e(TAG, "Failed to read internal update: ${e.message}")
                internalFile.delete()
            }
        }

        return assetContent
    }

    fun getAssetVersion(context: Context): String? {
        return try {
            val content = context.assets.open(ENC_FILE).bufferedReader(Charsets.UTF_8).use { it.readText() }
            val html = decryptContent(content)
            extractVersion(html)
        } catch (e: Exception) { null }
    }

    fun getInstalledVersion(context: Context): String? {
        val internalFile = File(context.filesDir, ENC_FILE)
        if (internalFile.exists()) {
            return try {
                val content = internalFile.readText(Charsets.UTF_8)
                val html = decryptContent(content)
                extractVersion(html)
            } catch (e: Exception) { null }
        }

        return getAssetVersion(context)
    }

    private fun decryptContent(content: String): String? {
        return try {
            val json = JSONObject(content)
            val iv = Base64.decode(json.getString("iv"), Base64.NO_WRAP)
            val data = Base64.decode(json.getString("data"), Base64.NO_WRAP)
            val keySpec = SecretKeySpec(deriveKey(), "AES")
            val ivSpec = IvParameterSpec(iv)
            val cipher = Cipher.getInstance(ALGO)
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec)
            String(cipher.doFinal(data), Charsets.UTF_8)
        } catch (e: Exception) { null }
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
