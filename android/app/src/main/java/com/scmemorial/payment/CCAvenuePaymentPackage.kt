package com.scmemorial.payment

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * ReactPackage that registers [CCAvenuePaymentModule].
 *
 * STATUS: NOT REGISTERED YET.
 *
 * The payment flow currently runs in MOCK mode and does not need this
 * package. When the official CCAvenue SDK is integrated, register it in
 * MainApplication.kt:
 *
 *   PackageList(this).packages.apply {
 *     add(CCAvenuePaymentPackage())
 *   }
 */
class CCAvenuePaymentPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(CCAvenuePaymentModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
