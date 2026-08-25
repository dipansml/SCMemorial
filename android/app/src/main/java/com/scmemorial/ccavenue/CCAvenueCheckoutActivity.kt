package com.scmemorial.ccavenue

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.http.SslError
import android.os.Bundle
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.SslErrorHandler
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.ProgressBar

class CCAvenueCheckoutActivity : Activity() {

    companion object {
        const val EXTRA_ORDER_ID = "order_id"
        const val EXTRA_ENCRYPTED_DATA = "encrypted_data"
        const val EXTRA_ACCESS_CODE = "access_code"
        const val EXTRA_CHECKOUT_URL = "checkout_url"
        const val RESULT_ORDER_ID = "result_order_id"
        const val RESULT_TRACKING_ID = "result_tracking_id"
        const val RESULT_BANK_REF_NO = "result_bank_ref_no"
        const val RESULT_ORDER_STATUS = "result_order_status"
        const val RESULT_PAYMENT_MODE = "result_payment_mode"
        const val RESULT_AMOUNT = "result_amount"
        const val RESULT_CURRENCY = "result_currency"
        const val RESULT_BILLING_NAME = "result_billing_name"
        const val RESULT_RESPONSE_CODE = "result_response_code"
        const val RESULT_STATUS_MESSAGE = "result_status_message"
        const val RESULT_FAILURE_MESSAGE = "result_failure_message"
    }

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private var orderId = ""

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        orderId = intent.getStringExtra(EXTRA_ORDER_ID) ?: ""
        val encryptedData = intent.getStringExtra(EXTRA_ENCRYPTED_DATA) ?: ""
        val accessCode = intent.getStringExtra(EXTRA_ACCESS_CODE) ?: ""
        val checkoutUrl = intent.getStringExtra(EXTRA_CHECKOUT_URL)
            ?: "https://secure.ccavenue.com/transaction/transaction.do"

        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        progressBar = ProgressBar(this).apply { visibility = View.GONE }
        layout.addView(progressBar)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.setSupportZoom(true)
            settings.builtInZoomControls = true
            settings.displayZoomControls = false
            isVerticalScrollBarEnabled = true
            isHorizontalScrollBarEnabled = false
            addJavascriptInterface(CCAvenueJsInterface(), "CCAVENUE")
        }
        layout.addView(webView, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
        ))
        setContentView(layout)

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
            }
            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
                handler?.proceed()
            }
        }

        val postData = "command=initiateTransaction&encRequest=${
            java.net.URLEncoder.encode(encryptedData, "UTF-8")
        }&access_code=$accessCode"
        webView.postUrl(checkoutUrl, postData.toByteArray())
    }

    inner class CCAvenueJsInterface {
        @JavascriptInterface
        fun processHTML(html: String) {
            try {
                val response = parseResponse(html)
                val resultIntent = Intent().apply {
                    putExtra(RESULT_ORDER_ID, response["order_id"] ?: orderId)
                    putExtra(RESULT_TRACKING_ID, response["tracking_id"] ?: "")
                    putExtra(RESULT_BANK_REF_NO, response["bank_ref_no"] ?: "")
                    putExtra(RESULT_ORDER_STATUS, response["order_status"] ?: "")
                    putExtra(RESULT_PAYMENT_MODE, response["payment_mode"] ?: "")
                    putExtra(RESULT_AMOUNT, response["amount"] ?: "")
                    putExtra(RESULT_CURRENCY, response["currency"] ?: "")
                    putExtra(RESULT_BILLING_NAME, response["billing_name"] ?: "")
                    putExtra(RESULT_RESPONSE_CODE, response["response_code"] ?: "")
                    putExtra(RESULT_STATUS_MESSAGE, response["status_message"] ?: "")
                    putExtra(RESULT_FAILURE_MESSAGE, response["failure_message"] ?: "")
                }
                setResult(RESULT_OK, resultIntent)
                finish()
            } catch (e: Exception) {
                val resultIntent = Intent().apply {
                    putExtra(RESULT_ORDER_ID, orderId)
                    putExtra(RESULT_ORDER_STATUS, "Error")
                    putExtra(RESULT_STATUS_MESSAGE, "Failed to parse response: ${e.message}")
                }
                setResult(RESULT_OK, resultIntent)
                finish()
            }
        }

        private fun parseResponse(html: String): Map<String, String> {
            val result = mutableMapOf<String, String>()
            try {
                val jsonStart = html.indexOf("{")
                val jsonEnd = html.lastIndexOf("}") + 1
                if (jsonStart >= 0 && jsonEnd > jsonStart) {
                    val jsonString = html.substring(jsonStart, jsonEnd)
                    val pairs = jsonString.removeSurrounding("{", "}").split(",")
                    for (pair in pairs) {
                        val colonIndex = pair.indexOf(":")
                        if (colonIndex > 0) {
                            val key = pair.substring(0, colonIndex).trim().removeSurrounding("\"")
                            val value = pair.substring(colonIndex + 1).trim().removeSurrounding("\"")
                            result[key] = value
                        }
                    }
                }
            } catch (_: Exception) {
                val keyValues = html.split("&")
                for (kv in keyValues) {
                    val parts = kv.split("=", limit = 2)
                    if (parts.size == 2) result[parts[0].trim()] = parts[1].trim()
                }
            }
            return result
        }
    }

    @Deprecated("Use OnBackPressedCallback")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else {
            val resultIntent = Intent().apply {
                putExtra(RESULT_ORDER_ID, orderId)
                putExtra(RESULT_ORDER_STATUS, "Aborted")
                putExtra(RESULT_STATUS_MESSAGE, "Payment was cancelled by user")
            }
            setResult(RESULT_CANCELED, resultIntent)
            finish()
        }
    }
}
