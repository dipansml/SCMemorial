package com.scmemorial

import android.view.View
import android.view.WindowManager
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExamModeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ExamMode"
    }

    /**
     * Enables exam mode by hiding the navigation bar and status bar
     * to provide a full-screen, distraction-free exam environment.
     */
    @ReactMethod
    fun enableExamMode() {
        val activity = reactApplicationContext.currentActivity
        activity?.runOnUiThread {
            // Hide the status bar and navigation bar for full-screen exam mode
            activity.window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            )

            // Keep the screen on during exam
            activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    /**
     * Disables exam mode by restoring the normal navigation and status bar.
     */
    @ReactMethod
    fun disableExamMode() {
        val activity = reactApplicationContext.currentActivity
        activity?.runOnUiThread {
            // Restore normal view (exit full screen mode)
            activity.window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE

            // Remove the keep-screen-on flag
            activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }
}
