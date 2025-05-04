package com.focuslynativeapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.Settings
import android.util.Base64
import com.google.gson.Gson
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import java.io.ByteArrayOutputStream

@ReactModule(name = "ScreenTimeModule")
class ScreenTimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ScreenTimeModule"

    @ReactMethod
    fun checkUsageStatsPermission(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 60 * 24

            val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            if (usageStatsList.isEmpty()) {
                promise.resolve(false)
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e("ScreenTimeModule", "Erro ao verificar permissão", e)
            promise.reject("ERROR", "Erro ao verificar permissão", e)
        }
    }
    @ReactMethod
    fun openUsageAccessSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("ScreenTimeModule", "Erro ao abrir configurações", e)
            promise.reject("ERROR", "Não foi possível abrir as configurações", e)
        }
    }


    @ReactMethod
    fun getUsageStats(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 60 * 24

            val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val pm = reactApplicationContext.packageManager
            val results = WritableNativeArray()
            Log.d("ScreenTimeModule", "Uso de apps obtido com sucesso. Total de apps: ${results.size()}")
            val gson = Gson()
            val json = gson.toJson(usageStatsList)
            Log.d("ScreenTimeModule", "StatsList: $json")

            val fallbackAppNames = mapOf(
                "com.facebook.katana" to "Facebook",
                "com.instagram.android" to "Instagram",
                "com.whatsapp" to "WhatsApp",
                "com.twitter.android" to "Twitter (X)",
                "com.snapchat.android" to "Snapchat",
                "com.tiktok.android" to "TikTok",
                "com.telegram.messenger" to "Telegram",
                "com.android.chrome" to "Google Chrome",
                "com.facebook.orca" to "Messenger",
                "com.linkedin.android" to "LinkedIn",
                "com.reddit.frontpage" to "Reddit",
                "jp.naver.line.android" to "LINE",
                "com.vkontakte.android" to "VK",
                "com.discord" to "Discord",
                "org.thoughtcrime.securesms" to "Signal",
                "com.zhiliaoapp.musically" to "TikTok",
                "com.pinterest" to "Pinterest",
                "com.bbm" to "BBM",
                "com.skype.raider" to "Skype"
            )

            val fallbackAppData = mapOf(
                "com.facebook.katana" to Pair("Facebook", "https://cdn-icons-png.flaticon.com/512/733/733547.png"),
                "com.instagram.android" to Pair("Instagram", "https://cdn-icons-png.flaticon.com/512/733/733558.png"),
                "com.whatsapp" to Pair("WhatsApp", "https://cdn-icons-png.flaticon.com/512/733/733585.png"),
                "com.zhiliaoapp.musically" to Pair("TikTok", "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"),
                "com.twitter.android" to Pair("X (Twitter)", "https://cdn-icons-png.flaticon.com/512/733/733579.png"),
                "com.snapchat.android" to Pair("Snapchat", "https://cdn-icons-png.flaticon.com/512/733/733585.png"),
                "org.telegram.messenger" to Pair("Telegram", "https://cdn-icons-png.flaticon.com/512/2111/2111646.png"),
                "com.facebook.orca" to Pair("Messenger", "https://cdn-icons-png.flaticon.com/512/733/733559.png"),
                "com.google.android.youtube" to Pair("YouTube", "https://cdn-icons-png.flaticon.com/512/733/733646.png"),
                "com.pinterest" to Pair("Pinterest", "https://cdn-icons-png.flaticon.com/512/733/733603.png"),
                "com.reddit.frontpage" to Pair("Reddit", "https://cdn-icons-png.flaticon.com/512/733/733646.png"),
                "com.discord" to Pair("Discord", "https://cdn-icons-png.flaticon.com/512/733/733646.png")
            )






            for (stat in usageStatsList) {
                if (stat.totalTimeInForeground > 0) {
                    val packageName = stat.packageName
                    try{
                        val app = WritableNativeMap()
                        app.putString("packageName", packageName)
                        app.putDouble("totalTimeInForeground", stat.totalTimeInForeground.toDouble() / 1000)

                        try {
                            val appInfo = pm.getApplicationInfo(packageName, 0)
                            val appLabel = pm.getApplicationLabel(appInfo).toString()
                            Log.d("AppInfo", "App: $appLabel, Tempo em 1º plano: ${stat.totalTimeInForeground}")
                            app.putString("appName", appLabel)

                            try {
                                val drawable = pm.getApplicationIcon(appInfo)
                                val bitmap = (drawable as android.graphics.drawable.BitmapDrawable).bitmap
                                val stream = ByteArrayOutputStream()
                                bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream)
                                val base64 = Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)
                                app.putString("icon", "data:image/png;base64,$base64")
                            } catch (e: Exception) {
                                app.putString("icon", "")
                            }

                        } catch (e: Exception) {
                            app.putString("icon", fallbackAppData[packageName]?.second)
                            val appLabel = fallbackAppNames[packageName] ?: packageName
                            app.putString("appName", appLabel)
                        }



                        results.pushMap(app)
                    }catch (e: Exception) {
                        Log.e("AppInfo", "Pacote não encontrado: $packageName", e)
                    }

                }
            }
            promise.resolve(results)
        } catch (e: Exception) {
            Log.e("ScreenTimeModule", "Erro ao obter uso de apps", e)
            promise.reject("ERROR", "Erro ao obter uso de apps", e)
        }
    }

    @ReactMethod
    fun checkAndNotifyUsageLimit(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 60 * 24 // últimas 24h

            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val monitoredApps = listOf(
                "com.instagram.android",
                "com.zhiliaoapp.musically", // TikTok
                "com.facebook.katana"
            )

            for (stat in usageStatsList) {
                val packageName = stat.packageName
                val totalUsageSec = stat.totalTimeInForeground / 1000

                if (monitoredApps.contains(packageName) && totalUsageSec > 3600) {
                    sendNotification("Você usou o ${packageName} por mais de 1 hora hoje.")
                }
            }

            promise.resolve(true)

        } catch (e: Exception) {
            Log.e("ScreenTimeModule", "Erro ao checar limite de uso", e)
            promise.reject("ERROR", "Erro ao checar limite de uso", e)
        }
    }

    private fun sendNotification(message: String) {
        val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "usagelimit_channel"

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Limite de Uso", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(reactApplicationContext, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Limite de Uso Atingido")
            .setContentText(message)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }

}
