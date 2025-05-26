package com.focuslynativeapp

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button

class OverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private var overlayView: View? = null

    private val handler = Handler(Looper.getMainLooper())
    private val checkInterval = 1000L // 1 segundo

    private val prefs by lazy { getSharedPreferences("blocked_apps", Context.MODE_PRIVATE) }

    private val checkAppRunnable = object : Runnable {
        override fun run() {
            val currentPackage = getForegroundAppPackageName()
            val blockedApps = prefs.getStringSet("blocked_list", setOf()) ?: setOf()

            if (currentPackage != null && blockedApps.contains(currentPackage)) {
                if (overlayView == null) {
                    showOverlay()
                }
            } else {
                if (overlayView != null) {
                    removeOverlay()
                }
            }
            handler.postDelayed(this, checkInterval)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        createNotificationChannel()

        val notification = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("Overlay Service ativo")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build()
        } else {
            Notification.Builder(this)
                .setContentTitle("Overlay Service ativo")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build()
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notification,
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("OverlayService", "Serviço iniciado")
        handler.post(checkAppRunnable)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(checkAppRunnable)
        removeOverlay()
    }

    private fun getForegroundAppPackageName(): String? {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val time = System.currentTimeMillis()
        // Pega os stats dos últimos 5 segundos
        val usageStatsList: List<UsageStats> =
            usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 5000, time)

        if (usageStatsList.isNullOrEmpty()) return null

        var recentStats: UsageStats? = null
        for (usageStats in usageStatsList) {
            if (recentStats == null || usageStats.lastTimeUsed > recentStats.lastTimeUsed) {
                recentStats = usageStats
            }
        }
        return recentStats?.packageName
    }

    private fun canDrawOverlay(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            android.provider.Settings.canDrawOverlays(this)
        } else {
            true
        }
    }

    private fun showOverlay() {
        if (!canDrawOverlay()) {
            Log.w("OverlayService", "Permissão de overlay não concedida")
            return
        }

        val inflater = LayoutInflater.from(this)
        overlayView = inflater.inflate(R.layout.overlay_layout, null)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )

        windowManager.addView(overlayView, params)

        overlayView?.findViewById<Button>(R.id.proceedButton)?.setOnClickListener {
            removeOverlay()
            stopSelf()
        }

        overlayView?.findViewById<Button>(R.id.cancelButton)?.setOnClickListener {
            removeOverlay()
            stopSelf()
        }
    }

    private fun removeOverlay() {
        overlayView?.let {
            windowManager.removeView(it)
            overlayView = null
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Overlay Service Channel",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    companion object {
        private const val CHANNEL_ID = "overlay_channel"
        private const val NOTIFICATION_ID = 1
    }
}
