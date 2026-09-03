import Foundation
import UIKit
import WebKit

@objc(CCAvenueCheckoutViewController)
class CCAvenueCheckoutViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    var orderId: String = ""
    var encryptedData: String = ""
    var accessCode: String = ""
    var checkoutUrl: String = ""
    var workingKey: String = ""

    var completionHandler: (([String: String]) -> Void)?

    private var hasCompleted = false
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!

    private func completeOnce(_ response: [String: String]) {
        guard !hasCompleted else { return }
        hasCompleted = true
        completionHandler?(response)
        DispatchQueue.main.async { [weak self] in
            self?.dismiss(animated: true)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        setupWebView()
        setupActivityIndicator()
        loadCheckout()
    }

    private func setupWebView() {
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        contentController.add(self, name: "ccavenue")
        config.userContentController = contentController

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)

        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    private func setupActivityIndicator() {
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)

        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }

    private func loadCheckout() {
        let encodedData = encryptedData.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? encryptedData

        let html = """
        <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body>
        <form id="ccavenueForm" method="POST" action="\(checkoutUrl)">
            <input type="hidden" name="command" value="initiateTransaction">
            <input type="hidden" name="encRequest" value="\(encodedData)">
            <input type="hidden" name="access_code" value="\(accessCode)">
        </form>
        <script>document.getElementById('ccavenueForm').submit();</script>
        </body>
        </html>
        """

        webView.loadHTMLString(html, baseURL: nil)
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        activityIndicator.startAnimating()
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        #if DEBUG
        print("===== CCAVENUE NAVIGATION - IOS =====")
        print("URL = \(url.absoluteString)")
        print("=====================================")
        #endif

        let targetIsMainFrame = navigationAction.targetFrame?.isMainFrame ?? true
        if targetIsMainFrame && isRedirectURL(url.absoluteString) {
            decisionHandler(.cancel)
            let response = handleRedirectResponse(
                request: navigationAction.request,
                url: url
            )
            completeOnce(response)
            return
        }

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code == NSURLErrorCancelled { return }
        activityIndicator.stopAnimating()
        let message = "Navigation failed: \(error.localizedDescription)"
        let alert = UIAlertController(title: "CCAvenue Response", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            self.completeOnce([
                "order_id": self.orderId,
                "order_status": "Error",
                "status_message": message
            ])
        })
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code == NSURLErrorCancelled { return }
        activityIndicator.stopAnimating()
        let message = "Failed to load: \(error.localizedDescription)"
        let alert = UIAlertController(title: "CCAvenue Response", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            self.completeOnce([
                "order_id": self.orderId,
                "order_status": "Error",
                "status_message": message
            ])
        })
        present(alert, animated: true)
    }

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == "ccavenue",
              let body = message.body as? String else { return }

        let response = parseResponse(body)
        DispatchQueue.main.async { [weak self] in
            self?.completeOnce(response)
        }
    }

    private func isRedirectURL(_ urlString: String) -> Bool {
        return urlString.contains("ccavenue-response-handler-fee-api")
    }

    private func handleRedirectResponse(request: URLRequest, url: URL) -> [String: String] {
        guard let encResp = extractEncResponse(from: request, url: url) else {
            #if DEBUG
            print("CCAvenue: redirect without encResp — neutral failure")
            #endif
            return failureResult("Payment response was not received")
        }

        guard let decrypted = CCAvenueCrypto.decrypt(cipherText: encResp, workingKey: workingKey),
              !decrypted.isEmpty else {
            #if DEBUG
            print("CCAvenue: encResp could not be decrypted")
            #endif
            return failureResult("Payment response could not be verified")
        }

        var response = parseResponse(decrypted)
        response["order_id"] = response["order_id"] ?? orderId

        #if DEBUG
        print("===== CCAVENUE RESPONSE - IOS =====")
        let respOrderId = response["order_id"] ?? orderId
        print("order_id        = \(respOrderId)")
        for key in [
            "tracking_id", "bank_ref_no", "order_status", "failure_message",
            "payment_mode", "card_name", "status_code", "status_message",
            "currency", "amount", "billing_name", "merchant_param1",
            "merchant_param2", "merchant_param3", "merchant_param4",
            "merchant_param5", "vault", "offer_type", "offer_code",
            "discount_value", "mer_amount", "eci_value", "retry",
            "response_code", "billing_notes", "trans_date", "bin_country",
            "auth_ref_num"
        ] {
            if let value = response[key], !value.isEmpty {
                print("\(key.padding(toLength: 16, withPad: " ", startingAt: 0)) = \(value)")
            }
        }
        print("==================================")
        #endif

        return response
    }

    private func extractEncResponse(from request: URLRequest, url: URL) -> String? {
        var bodyData: Data? = request.httpBody
        if bodyData == nil {
            bodyData = readBodyStream(request.httpBodyStream)
        }

        if let bodyData = bodyData,
           let body = String(data: bodyData, encoding: .utf8),
           let value = urlEncodedValue(body, key: "encResp") {
            return value
        }

        if let value = queryValue(url, key: "encResp") {
            return value
        }

        if let rawFragment = url.fragment,
           let value = urlEncodedValue(rawFragment, key: "encResp") {
            return value
        }

        return nil
    }

    private func readBodyStream(_ stream: InputStream?) -> Data? {
        guard let stream = stream else { return nil }
        stream.open()
        defer { stream.close() }

        var data = Data()
        let bufferSize = 4096
        let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: bufferSize)
        defer { buffer.deallocate() }

        while stream.hasBytesAvailable {
            let readCount = stream.read(buffer, maxLength: bufferSize)
            if readCount <= 0 {
                break
            }
            data.append(buffer, count: readCount)
        }

        return data.isEmpty ? nil : data
    }

    private func urlEncodedValue(_ body: String, key: String) -> String? {
        let pairs = body.split(separator: "&")
        for pair in pairs {
            let parts = pair.split(separator: "=", maxSplits: 1)
            if parts.count == 2, parts[0] == key {
                let encoded = String(parts[1])
                let value = encoded.replacingOccurrences(of: "+", with: " ")
                return value.removingPercentEncoding ?? encoded
            }
        }
        return nil
    }

    private func queryValue(_ url: URL, key: String) -> String? {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        return components?.queryItems?.first(where: { $0.name == key })?.value
    }

    private func failureResult(_ message: String) -> [String: String] {
        return [
            "order_id": orderId,
            "order_status": "Failure",
            "status_message": message,
            "failure_message": message
        ]
    }

    private func parseResponse(_ raw: String) -> [String: String] {
        var result = [String: String]()

        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)

        if trimmed.contains("=") {
            let pairs = trimmed.split(separator: "&")
            for pair in pairs {
                let parts = pair.split(separator: "=", maxSplits: 1)
                if parts.count == 2 {
                    let key = parts[0].trimmingCharacters(in: .whitespaces)
                    let value = String(parts[1])
                        .replacingOccurrences(of: "+", with: " ")
                        .removingPercentEncoding
                    if !key.isEmpty, let decoded = value {
                        result[key] = decoded
                    }
                }
            }
            if !result.isEmpty {
                return result
            }
        }

        if let jsonStart = trimmed.range(of: "{"),
           let jsonEnd = trimmed.range(of: "}", options: .backwards) {
            let jsonString = String(trimmed[jsonStart.lowerBound...jsonEnd.upperBound])
            let cleaned = jsonString
                .replacingOccurrences(of: "{", with: "")
                .replacingOccurrences(of: "}", with: "")
                .replacingOccurrences(of: "\"", with: "")
            let pairs = cleaned.split(separator: ",")
            for pair in pairs {
                let parts = pair.split(separator: ":", maxSplits: 1)
                if parts.count == 2 {
                    result[parts[0].trimmingCharacters(in: .whitespaces)] =
                        parts[1].trimmingCharacters(in: .whitespaces)
                }
            }
        }
        return result
    }

    @IBAction func cancelTapped(_ sender: Any) {
        completeOnce([
            "order_id": orderId,
            "order_status": "Aborted",
            "status_message": "Payment cancelled by user"
        ])
    }
}
