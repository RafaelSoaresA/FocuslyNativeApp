package com.focuslynativeapp

import android.app.job.JobParameters
import android.app.job.JobService

class FetchJobService : JobService() {
    override fun onStartJob(params: JobParameters?): Boolean {
        // Your job logic here
        return false
    }

    override fun onStopJob(params: JobParameters?): Boolean {
        // Cleanup logic here
        return true
    }
}
