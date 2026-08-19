# ARV.P ProGuard Rules

# Keep CryptoManager and security classes
-keep class org.pecvih.arvp.CryptoManager { *; }
-keep class org.pecvih.arvp.SecurityDetector { *; }
-keep class org.pecvih.arvp.UpdateManager { *; }

# Keep CryptoManager$UpdateInfo
-keep class org.pecvih.arvp.UpdateManager$UpdateInfo { *; }

# Keep javax.crypto classes
-keep class javax.crypto.** { *; }
-keep class javax.crypto.spec.** { *; }

# Keep java.security classes
-keep class java.security.** { *; }

# Keep JSONObject
-keep class org.json.** { *; }

# Keep Base64
-keep class android.util.Base64 { *; }

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve line numbers for stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
