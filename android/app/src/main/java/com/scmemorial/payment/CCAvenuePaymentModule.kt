package com.scmemorial.payment

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

/**
 * CCAvenuePaymentModule — NATIVE INTEGRATION BOUNDARY.
 *
 * ============================================================================
 * STATUS: PLACEHOLDER — NOT WIRED INTO THE ACTIVE PAYMENT FLOW.
 * ============================================================================
 *
 * The React Native payment architecture currently runs in MOCK mode
 * (src/config/payment.ts, PAYMENT_MODE = "MOCK"). The mock adapter is fully
 * self-contained in JavaScript and does NOT call this module. This file is
 * the Kotlin seam where the OFFICIAL CCAvenue Android SDK will be connected
 * later.
 *
 * When the official CCAvenue SDK is available and PAYMENT_MODE switches to
 * "CCAVENUE":
 *
 *   1. Add the official CCAvenue SDK dependency to android/app/build.gradle.
 *   2. Implement `startPayment` here to launch the CCAvenue payment activity
 *      using the merchant configuration (merchantId / accessCode / workingKey /
 *      encryptionKey) that will be passed from JavaScript.
 *   3. Implement `verifyPayment` if CCAvenue exposes client-side status checks.
 *      (Server-side verification should live in the backend, not the app.)
 *   4. Register this package in MainApplication.kt inside the `packages` list:
 *
 *          add(CCAvenuePaymentPackage())
 *
 * The JS side (src/services/payment/RealCCAvenueProvider.ts) already has the
 * matching calls, marked with TODOs.
 *
 * NOTE: This module intentionally contains NO real CCAvenue SDK calls today.
 * No official CCAvenue SDK classes are referenced because the SDK is not
 * installed in this project yet.
 */
class CCAvenuePaymentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = NAME

    companion object {
        const val NAME = "CCAvenuePayment"
    }

    /**
     * Starts a CCAvenue payment session.
     *
     * @param options Map with orderId, amount, currency, billingName,
     *                billingEmail, billingPhone (payload from JS).
     * @param promise Resolves with the normalized payment result
     *                (status/orderId/transactionId/amount/currency/message).
     */
    @ReactMethod
    fun startPayment(options: ReadableMap, promise: Promise) {
        // TODO(real CCAvenue):
        //   val orderId = options.getString("orderId") ?: ""
        //   val amount = options.getString("amount") ?: "0"
        //   val currency = options.getString("currency") ?: "INR"
        //   ... initialize the official CCAvenue SDK with the merchant config ...
        //   ... launch the payment UI and wait for the callback ...
        //   ... map the gateway callback into the normalized result map and
        //       call promise.resolve(resultMap) or promise.reject(...) ...
        promise.reject(
            "NOT_CONFIGURED",
            "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode."
        )
    }

    /**
     * Cancels an in-flight CCAvenue payment session if the SDK supports it.
     */
    @ReactMethod
    fun cancelPayment(promise: Promise) {
        // TODO(real CCAvenue): close/abort the SDK session if possible.
        promise.reject(
            "NOT_CONFIGURED",
            "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode."
        )
    }

    /**
     * Placeholder for any client-side transaction status lookups.
     * Prefer server-side verification via the backend.
     */
    @ReactMethod
    fun verifyPayment(orderId: String, transactionId: String, promise: Promise) {
        // TODO(real CCAvenue): optional client-side status check.
        promise.reject(
            "NOT_CONFIGURED",
            "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode."
        )
    }
}
