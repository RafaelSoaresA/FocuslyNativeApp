package com.focuslynativeapp

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.content.Intent
import android.content.Context

class AppMonitorService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString() ?: return

            val prefs = getSharedPreferences("blocked_apps", Context.MODE_PRIVATE)
            val blocked = prefs.getStringSet("blocked_list", mutableSetOf()) ?: mutableSetOf()

            if (blocked.contains(packageName)) {
                val intent = Intent(this, OverlayService::class.java)
                intent.putExtra("packageName", packageName)
                startService(intent)
            }
        }
    }

    override fun onInterrupt() {}
}
