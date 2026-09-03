package com.scmemorial.ccavenue

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.ProgressBar
import java.net.URLDecoder

class CCAvenueCheckoutActivity : Activity() {

    companion object {
        private const val TAG = "CCAvenueCheckoutActivity"
        private const val FLOW = "ANDROID_CCAVENUE"
        private const val CALLBACK_MARKER = "ccavenue-response-handler-fee-api"
        private const val FALLBACK_DELAY_MS = 3000L

        const val EXTRA_ORDER_ID = "order_id"
        const val EXTRA_ENCRYPTED_DATA = "encrypted_data"
        const val EXTRA_ACCESS_CODE = "access_code"
        const val EXTRA_CHECKOUT_URL = "checkout_url"
        const val EXTRA_WORKING_KEY = "working_key"

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
        const val RESULT_MERCHANT_PARAM1 = "result_merchant_param1"
        const val RESULT_MERCHANT_PARAM2 = "result_merchant_param2"
        const val RESULT_MERCHANT_PARAM3 = "result_merchant_param3"
        const val RESULT_MERCHANT_PARAM4 = "result_merchant_param4"
        const val RESULT_MERCHANT_PARAM5 = "result_merchant_param5"
        const val RESULT_CARD_NAME = "result_card_name"
        const val RESULT_STATUS_CODE = "result_status_code"
    }

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private val mainHandler = Handler(Looper.getMainLooper())
    private val completionLock = Any()
    private var orderId = ""
    private var workingKey = ""
    @Volatile private var hasCompleted = false
    @Volatile private var capturedResponse: Map<String, String>? = null

    private val fallbackRunnable = Runnable {
        if (hasCompleted) return@Runnable
        capturedResponse?.let {
            completeWithRealResponse(it)
            return@Runnable
        }
        Log.d(TAG, "$FLOW: fallback cancellation used")
        completeCheckout(Activity.RESULT_CANCELED, buildFallbackIntent())
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        orderId = intent.getStringExtra(EXTRA_ORDER_ID) ?: ""
        val encryptedData = intent.getStringExtra(EXTRA_ENCRYPTED_DATA) ?: ""
        val accessCode = intent.getStringExtra(EXTRA_ACCESS_CODE) ?: ""
        workingKey = intent.getStringExtra(EXTRA_WORKING_KEY) ?: ""
        val checkoutUrl = intent.getStringExtra(EXTRA_CHECKOUT_URL)
            ?: "https://secure.ccavenue.com/transaction/transaction.do"

        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        progressBar = ProgressBar(this).apply { visibility = View.GONE }
        layout.addView(progressBar)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.setSupportZoom(true)
            settings.builtInZoomControls = true
            settings.displayZoomControls = false
            addJavascriptInterface(CcaVenueJsBridge(), "CCAVENUE")
        }
        layout.addView(webView, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            0,
            1f,
        ))
        setContentView(layout)

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                if (url != null && isCallbackUrl(url)) {
                    Log.d(TAG, "$FLOW: callback URL detected")
                }
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                view?.let { injectCallbackCapture(it) }
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                view?.let { injectCallbackCapture(it) }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?,
            ): Boolean {
                val callbackUrl = request?.url?.toString()
                if (request?.isForMainFrame == true && callbackUrl != null && isCallbackUrl(callbackUrl)) {
                    Log.d(TAG, "$FLOW: callback URL detected")
                    val encResp = extractEncResp(callbackUrl)
                    if (!encResp.isNullOrEmpty()) {
                        Log.d(TAG, "$FLOW: encResp field detected")
                        decryptAndCapture(encResp)
                        return true
                    }
                }
                return super.shouldOverrideUrlLoading(view, request)
            }

            override fun onReceivedSslError(
                view: WebView?,
                handler: SslErrorHandler?,
                error: android.net.http.SslError?,
            ) {
                handler?.cancel()
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: ConsoleMessage?): Boolean {
                val text = message?.message()
                if (text != null && text.startsWith("$FLOW:")) {
                    Log.d(TAG, text)
                }
                return true
            }
        }

        val postData = "command=initiateTransaction&encRequest=${
            java.net.URLEncoder.encode(encryptedData, "UTF-8")
        }&access_code=$accessCode"
        Log.d(TAG, "$FLOW: loading checkout URL")
        webView.postUrl(checkoutUrl, postData.toByteArray(Charsets.UTF_8))
    }

    private fun injectCallbackCapture(view: WebView) {
        val script = """
            (function() {
              if (window.__SCM_CCAVENUE_CAPTURE__) return;
              window.__SCM_CCAVENUE_CAPTURE__ = true;
              var callbackMarker = "$CALLBACK_MARKER";

              function isCallbackForm(form) {
                try {
                  return !!form && String(form.action || form.getAttribute('action') || '').indexOf(callbackMarker) !== -1;
                } catch (e) { return false; }
              }

              function sendValue(value) {
                if (value && window.CCAVENUE && window.CCAVENUE.processEncResp) {
                  window.CCAVENUE.processEncResp(String(value));
                  return true;
                }
                return false;
              }

              function inspectForm(form) {
                try {
                  if (!isCallbackForm(form)) return false;
                  var input = form.elements && form.elements.namedItem('encResp');
                  var value = input && input.value !== undefined ? input.value : '';
                  if (value) {
                    return sendValue(value);
                  }
                } catch (e) {}
                return false;
              }

              function inspectDocument() {
                try {
                  var forms = document.forms || [];
                  for (var i = 0; i < forms.length; i++) inspectForm(forms[i]);
                  if (String(location.href).indexOf(callbackMarker) !== -1) {
                    var input = document.querySelector('input[name="encResp"]');
                    if (input) sendValue(input.value || '');
                  }
                } catch (e) {}
              }

              var originalSubmit = HTMLFormElement.prototype.submit;
              HTMLFormElement.prototype.submit = function() {
                if (inspectForm(this)) return;
                return originalSubmit.apply(this, arguments);
              };

              if (HTMLFormElement.prototype.requestSubmit) {
                var originalRequestSubmit = HTMLFormElement.prototype.requestSubmit;
                HTMLFormElement.prototype.requestSubmit = function() {
                  if (inspectForm(this)) return;
                  return originalRequestSubmit.apply(this, arguments);
                };
              }

              document.addEventListener('submit', function(event) {
                if (inspectForm(event.target)) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              }, true);

              var originalAppendChild = Node.prototype.appendChild;
              Node.prototype.appendChild = function(child) {
                var result = originalAppendChild.call(this, child);
                inspectDocument();
                return result;
              };
              var originalInsertBefore = Node.prototype.insertBefore;
              Node.prototype.insertBefore = function(newNode, referenceNode) {
                var result = originalInsertBefore.call(this, newNode, referenceNode);
                inspectDocument();
                return result;
              };

              if (window.MutationObserver && document.documentElement) {
                new MutationObserver(inspectDocument).observe(document.documentElement, {
                  childList: true, subtree: true, attributes: true, attributeFilter: ['action', 'name', 'value']
                });
              }
              inspectDocument();
            })();
        """.trimIndent()
        view.evaluateJavascript(script, null)
    }

    private fun isCallbackUrl(url: String): Boolean = url.contains(CALLBACK_MARKER)

    private fun extractEncResp(urlString: String): String? {
        val uri = Uri.parse(urlString)
        uri.getQueryParameter("encResp")?.takeIf { it.isNotEmpty() }?.let { return it }
        return urlEncodedValue(uri.fragment.orEmpty(), "encResp")
    }

    private fun urlEncodedValue(body: String, key: String): String? {
        body.split('&').forEach { pair ->
            val parts = pair.split('=', limit = 2)
            if (parts.size == 2 && parts[0].trim() == key) {
                return decode(parts[1])
            }
        }
        return null
    }

    private fun decryptAndCapture(encResp: String) {
        if (hasCompleted || workingKey.isEmpty()) return
        val decrypted = try {
            CCAvenueCrypto.decrypt(encResp, workingKey)
        } catch (_: Exception) {
            ""
        }
        if (decrypted.isEmpty()) {
            Log.d(TAG, "$FLOW: decrypt failed")
            return
        }
        Log.d(TAG, "$FLOW: decrypt successful")
        val response = parseResponse(decrypted).toMutableMap()
        if (response.isEmpty()) {
            Log.d(TAG, "$FLOW: response parsed but empty")
            return
        }
        if (response["order_id"].isNullOrEmpty()) response["order_id"] = orderId
        Log.d(TAG, "$FLOW: response parsed")
        completeWithRealResponse(response)
    }

    private fun parseResponse(raw: String): Map<String, String> {
        val result = linkedMapOf<String, String>()
        raw.trim().split('&').forEach { pair ->
            val parts = pair.split('=', limit = 2)
            if (parts.size == 2) {
                val key = decode(parts[0]).trim()
                if (key.isNotEmpty()) result[key] = decode(parts[1])
            }
        }
        return result
    }

    private fun decode(value: String): String = try {
        URLDecoder.decode(value.replace('+', ' '), "UTF-8")
    } catch (_: Exception) {
        value
    }

    private fun completeWithRealResponse(response: Map<String, String>) {
        synchronized(completionLock) {
            if (hasCompleted) return
            capturedResponse = response.toMap()
        }
        Log.d(TAG, "$FLOW: real CCAvenue response captured")
        completeCheckout(Activity.RESULT_OK, buildResultIntent(response))
    }

    private fun completeCheckout(resultCode: Int, resultIntent: Intent) {
        synchronized(completionLock) {
            if (hasCompleted) return
            hasCompleted = true
        }
        mainHandler.removeCallbacks(fallbackRunnable)
        runOnUiThread {
            if (::webView.isInitialized) webView.stopLoading()
            setResult(resultCode, resultIntent)
            finish()
        }
    }

    private fun buildResultIntent(response: Map<String, String>): Intent = Intent().apply {
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
        putExtra(RESULT_MERCHANT_PARAM1, response["merchant_param1"] ?: "")
        putExtra(RESULT_MERCHANT_PARAM2, response["merchant_param2"] ?: "")
        putExtra(RESULT_MERCHANT_PARAM3, response["merchant_param3"] ?: "")
        putExtra(RESULT_MERCHANT_PARAM4, response["merchant_param4"] ?: "")
        putExtra(RESULT_MERCHANT_PARAM5, response["merchant_param5"] ?: "")
        putExtra(RESULT_CARD_NAME, response["card_name"] ?: "")
        putExtra(RESULT_STATUS_CODE, response["status_code"] ?: "")
    }

    private fun buildFallbackIntent(): Intent = buildResultIntent(
        mapOf(
            "order_id" to orderId,
            "order_status" to "Aborted",
            "status_message" to "Payment was cancelled by user",
            "currency" to "INR",
        ),
    )

    private fun scheduleFallback() {
        mainHandler.removeCallbacks(fallbackRunnable)
        mainHandler.postDelayed(fallbackRunnable, FALLBACK_DELAY_MS)
    }

    inner class CcaVenueJsBridge {
        @JavascriptInterface
        fun processEncResp(encResp: String) {
            if (encResp.isEmpty() || hasCompleted) return
            Log.d(TAG, "$FLOW: encResp received from JavaScript")
            decryptAndCapture(encResp)
        }
    }

    @Deprecated("Use OnBackPressedCallback")
    override fun onBackPressed() {
        if (hasCompleted) return
        capturedResponse?.let {
            completeWithRealResponse(it)
            return
        }
        Log.d(TAG, "$FLOW: back pressed; waiting for callback")
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack()
        scheduleFallback()
    }

    override fun onDestroy() {
        mainHandler.removeCallbacks(fallbackRunnable)
        if (::webView.isInitialized) webView.removeJavascriptInterface("CCAVENUE")
        super.onDestroy()
    }
}
