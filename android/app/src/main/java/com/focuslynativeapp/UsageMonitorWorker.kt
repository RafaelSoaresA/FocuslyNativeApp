package com.focuslynativeapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.util.Calendar
import java.util.Date

class UsageMonitorWorker(
    context: Context,
    workerParams: WorkerParameters
) : Worker(context, workerParams) {

    override fun doWork(): Result {
        Log.d("UsageMonitorWorker", "Worker iniciado")
        sendNotification("Teste de notificacao")

        val usageStatsManager = applicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        // Início do dia atual (00:00)
        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val startTime = calendar.time.time
        val endTime = System.currentTimeMillis()

        // Logs de tempo
        Log.d("UsageMonitorWorker", "startTime (ms): $startTime")
        Log.d("UsageMonitorWorker", "startTime (data): ${Date(startTime)}")
        Log.d("UsageMonitorWorker", "endTime (ms): $endTime")
        Log.d("UsageMonitorWorker", "endTime (data): ${Date(endTime)}")

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        )

        // Log da lista de estatísticas retornadas
        if (stats.isNullOrEmpty()) {
            Log.d("UsageMonitorWorker", "Nenhuma estatística de uso encontrada.")
        } else {
            Log.d("UsageMonitorWorker", "Total de apps com uso retornado: ${stats.size}")
            stats.forEach {
                Log.d(
                    "UsageMonitorWorker",
                    "App: ${it.packageName}, Tempo em foreground: ${it.totalTimeInForeground / 1000}s"
                )
            }
        }

        stats?.forEach { usage ->
            val monitoredEntry = ScreenTimeModule.monitoredApps[usage.packageName]
            if (monitoredEntry != null) {
                val (appName, appImage, usageLimitMillis) = monitoredEntry
                if (usage.totalTimeInForeground >= usageLimitMillis) {
                    Log.d("UsageMonitorWorker", "$appName excedeu o limite diário")
                    sendNotification("Você usou o $appName por mais de ${usageLimitMillis / 60000} minutos hoje.")
                }
            }
        }

        return Result.success()
    }

    private fun sendNotification(message: String) {
        val channelId = "usagelimit_channel"
        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Limite de Uso", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(applicationContext, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Limite de Uso Atingido")
            .setContentText(message)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
