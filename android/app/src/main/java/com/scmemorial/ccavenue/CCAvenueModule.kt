package com.scmemorial.ccavenue

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.scmemorial.BuildConfig

class CCAvenueModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        private const val TAG = "CCAvenueModule"
        private const val PAYMENT_REQUEST_CODE = 1001
        private const val MERCHANT_ID = "227678"
        private const val ACCESS_CODE = "AVCO86GH94AD42OCDA"
        private const val WORKING_KEY = "80EE0DCADBEE34DC409A6F550B92630E"
        private const val CHECKOUT_URL = "https://secure.ccavenue.com/transaction/transaction.do"
        // private const val CCAVENUE_REDIRECT_URL =
        //     "http://182.73.216.93/scms.beas.in/api/ccavenue-response-handler-fee-api"
        // private const val CCAVENUE_CANCEL_URL =
        //     "http://182.73.216.93/scms.beas.in/api/ccavenue-response-handler-fee-api"
    }

    private var pendingPromise: Promise? = null

    init { reactApplicationContext.addActivityEventListener(this) }

    override fun getName(): String = "CCAvenueModule"

    private fun phpUrlEncode(value: String): String {
        val sb = StringBuilder()
        for (c in value) {
            when {
                c.isLetterOrDigit() -> sb.append(c)
                c == '-' || c == '_' || c == '.' -> sb.append(c)
                c == ' ' -> sb.append('+')
                else -> sb.append(String.format("%%%02X", c.code))
            }
        }
        return sb.toString()
    }

    private fun buildMerchantData(
        orderId: String, amount: String, customerName: String,
        studentCode: String, formNo: String,
        merchantParam1: String, merchantParam2: String, merchantParam3: String,
        merchantParam4: String, merchantParam5: String
    ): String {
        val sb = StringBuilder(MERCHANT_ID)
        val params = listOf(
            "student_code" to studentCode,
            "finalPayAmt" to amount,
            "first_name" to customerName,
            "form_no" to formNo,
            // "redirect_url" to CCAVENUE_REDIRECT_URL,
            // "cancel_url" to CCAVENUE_CANCEL_URL,
            "currency" to "INR",
            "language" to "EN",
            "amount" to String.format("%.2f", amount.toDoubleOrNull() ?: 0.0),
            "merchant_id" to MERCHANT_ID,
            "order_id" to orderId,
            "merchant_param1" to merchantParam1,
            "merchant_param2" to merchantParam2,
            "merchant_param3" to merchantParam3,
            "merchant_param4" to merchantParam4,
            "merchant_param5" to merchantParam5
        )
        for ((key, value) in params) {
            sb.append(key).append('=').append(phpUrlEncode(value)).append('&')
        }

        if (BuildConfig.DEBUG) {
            Log.d(TAG, "===== CCAVENUE REQUEST - ANDROID =====")
            Log.d(TAG, "order_id        = $orderId")
            Log.d(TAG, "student_code    = $studentCode")
            Log.d(TAG, "finalPayAmt     = $amount")
            Log.d(TAG, "first_name      = $customerName")
            Log.d(TAG, "form_no         = $formNo")
            Log.d(TAG, "amount          = ${String.format("%.2f", amount.toDoubleOrNull() ?: 0.0)}")
            Log.d(TAG, "merchant_id     = $MERCHANT_ID")
            Log.d(TAG, "merchant_param1 = $merchantParam1")
            Log.d(TAG, "merchant_param2 = $merchantParam2")
            Log.d(TAG, "merchant_param3 = $merchantParam3")
            Log.d(TAG, "merchant_param4 = $merchantParam4")
            Log.d(TAG, "merchant_param5 = $merchantParam5")
            Log.d(TAG, "======================================")
        }

        return sb.toString()
    }

    @ReactMethod
    fun startPayment(params: ReadableMap, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "Current activity is null")
            return
        }
        pendingPromise = promise

        val orderId = params.getString("orderId") ?: ""
        val amount = params.getString("amount") ?: "0.00"
        val customerName = params.getString("customerName") ?: ""
        val studentCode = params.getString("studentCode") ?: ""
        val formNo = params.getString("formNo") ?: ""
        val merchantParam1 = params.getString("merchantParam1") ?: ""
        val merchantParam2 = params.getString("merchantParam2") ?: ""
        val merchantParam3 = params.getString("merchantParam3") ?: amount
        val merchantParam4 = params.getString("merchantParam4") ?: studentCode
        val merchantParam5 = params.getString("merchantParam5") ?: customerName

        val merchantData = buildMerchantData(
            orderId, amount, customerName, studentCode, formNo,
            merchantParam1, merchantParam2, merchantParam3, merchantParam4, merchantParam5
        )

        val encryptedData = CCAvenueCrypto.encrypt(merchantData, WORKING_KEY)

        Log.d(TAG, "Order: $orderId, Amount: $amount")

        val intent = Intent(activity, CCAvenueCheckoutActivity::class.java)
        intent.putExtra(CCAvenueCheckoutActivity.EXTRA_ORDER_ID, orderId)
        intent.putExtra(CCAvenueCheckoutActivity.EXTRA_ENCRYPTED_DATA, encryptedData)
        intent.putExtra(CCAvenueCheckoutActivity.EXTRA_ACCESS_CODE, ACCESS_CODE)
        intent.putExtra(CCAvenueCheckoutActivity.EXTRA_CHECKOUT_URL, CHECKOUT_URL)

        activity.startActivityForResult(intent, PAYMENT_REQUEST_CODE)
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != PAYMENT_REQUEST_CODE) return
        val promise = pendingPromise
        pendingPromise = null

        if (resultCode == Activity.RESULT_CANCELED) {
            val result = Arguments.createMap()
            result.putString("orderId", data?.getStringExtra(CCAvenueCheckoutActivity.RESULT_ORDER_ID) ?: "")
            result.putString("trackingId", "")
            result.putString("bankRefNo", "")
            result.putString("orderStatus", data?.getStringExtra(CCAvenueCheckoutActivity.RESULT_ORDER_STATUS) ?: "Aborted")
            result.putString("paymentMode", "")
            result.putString("amount", "")
            result.putString("currency", "INR")
            result.putString("statusMessage", data?.getStringExtra(CCAvenueCheckoutActivity.RESULT_STATUS_MESSAGE) ?: "Cancelled")
            result.putString("failureMessage", "")
            result.putString("billingName", "")
            result.putString("responseCode", "")
            result.putString("merchantParam1", "")
            result.putString("merchantParam2", "")
            result.putString("merchantParam3", "")
            result.putString("merchantParam4", "")
            result.putString("merchantParam5", "")
            result.putString("cardName", "")
            result.putString("statusCode", "")
            promise?.resolve(result)
            return
        }

        if (data == null) {
            promise?.reject("NO_DATA", "No payment result received")
            return
        }

        val result = Arguments.createMap()
        result.putString("orderId", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_ORDER_ID) ?: "")
        result.putString("trackingId", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_TRACKING_ID) ?: "")
        result.putString("bankRefNo", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_BANK_REF_NO) ?: "")
        result.putString("orderStatus", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_ORDER_STATUS) ?: "")
        result.putString("paymentMode", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_PAYMENT_MODE) ?: "")
        result.putString("amount", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_AMOUNT) ?: "")
        result.putString("currency", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_CURRENCY) ?: "")
        result.putString("billingName", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_BILLING_NAME) ?: "")
        result.putString("responseCode", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_RESPONSE_CODE) ?: "")
        result.putString("statusMessage", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_STATUS_MESSAGE) ?: "")
        result.putString("failureMessage", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_FAILURE_MESSAGE) ?: "")
        result.putString("billingName", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_BILLING_NAME) ?: "")
        result.putString("responseCode", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_RESPONSE_CODE) ?: "")
        result.putString("merchantParam1", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_MERCHANT_PARAM1) ?: "")
        result.putString("merchantParam2", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_MERCHANT_PARAM2) ?: "")
        result.putString("merchantParam3", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_MERCHANT_PARAM3) ?: "")
        result.putString("merchantParam4", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_MERCHANT_PARAM4) ?: "")
        result.putString("merchantParam5", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_MERCHANT_PARAM5) ?: "")
        result.putString("cardName", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_CARD_NAME) ?: "")
        result.putString("statusCode", data.getStringExtra(CCAvenueCheckoutActivity.RESULT_STATUS_CODE) ?: "")
        promise?.resolve(result)
    }

    override fun onNewIntent(intent: Intent) {}
}
