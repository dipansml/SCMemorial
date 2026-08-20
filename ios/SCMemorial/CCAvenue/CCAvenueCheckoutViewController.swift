import Foundation
import UIKit
import WebKit

@objc(CCAvenueCheckoutViewController)
class CCAvenueCheckoutViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    var orderId: String = ""
    var encryptedData: String = ""
    var accessCode: String = ""
    var checkoutUrl: String = ""

    var completionHandler: (([String: String]) -> Void)?
    var cancelHandler: (() -> Void)?

    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!

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

        guard let url = webView.url?.absoluteString else { return }

        if url.contains("182.73.216.93") {
            webView.evaluateJavaScript("document.body.innerText") { [weak self] result, _ in
                guard let self = self else { return }
                let bodyText = (result as? String) ?? "No response body"

                DispatchQueue.main.async {
                    let alert = UIAlertController(
                        title: "CCAvenue Response",
                        message: bodyText,
                        preferredStyle: .alert
                    )
                    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                        let response: [String: String] = [
                            "order_id": self.orderId,
                            "order_status": "Success",
                            "status_message": bodyText
                        ]
                        self.completionHandler?(response)
                        self.dismiss(animated: true)
                    })
                    self.present(alert, animated: true)
                }
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        let message = "Navigation failed: \(error.localizedDescription)"
        let alert = UIAlertController(title: "CCAvenue Response", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            let response: [String: String] = [
                "order_id": self.orderId,
                "order_status": "Error",
                "status_message": message
            ]
            self.completionHandler?(response)
            self.dismiss(animated: true)
        })
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        let message = "Failed to load: \(error.localizedDescription)"
        let alert = UIAlertController(title: "CCAvenue Response", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            let response: [String: String] = [
                "order_id": self.orderId,
                "order_status": "Error",
                "status_message": message
            ]
            self.completionHandler?(response)
            self.dismiss(animated: true)
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
            self?.completionHandler?(response)
            self?.dismiss(animated: true)
        }
    }

    private func parseResponse(_ html: String) -> [String: String] {
        var result = [String: String]()
        if let jsonStart = html.range(of: "{"),
           let jsonEnd = html.range(of: "}", options: .backwards) {
            let jsonString = String(html[jsonStart.lowerBound...jsonEnd.upperBound])
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

    private func dismissWithError(_ message: String) {
        let response: [String: String] = [
            "order_id": orderId,
            "order_status": "Error",
            "status_message": message
        ]
        completionHandler?(response)
        dismiss(animated: true)
    }

    @IBAction func cancelTapped(_ sender: Any) {
        cancelHandler?()
        dismiss(animated: true)
    }
}
