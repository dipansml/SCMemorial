import Foundation
import React
import UIKit

@objc(CCAvenueModule)
class CCAvenueModule: NSObject {

    private static let merchantId = "227678"
    private static let accessCode = "AVCO86GH94AD42OCDA"
    private static let workingKey = "80EE0DCADBEE34DC409A6F550B92630E"
    private static let checkoutUrl = "https://secure.ccavenue.com/transaction/transaction.do"

    private static let ccavenueRedirectUrl =
        "http://182.73.216.93/scms.beas.in/api/ccavenue-response-handler-fee-api"
    private static let ccavenueCancelUrl =
        "http://182.73.216.93/scms.beas.in/api/ccavenue-response-handler-fee-api"

    private var pendingResolve: RCTPromiseResolveBlock?
    private var pendingReject: RCTPromiseRejectBlock?

    @objc static func requiresMainQueueSetup() -> Bool { return false }

    private static func phpUrlEncode(_ value: String) -> String {
        var allowed = CharacterSet.alphanumerics
        allowed.insert(charactersIn: "-_.")
        return value.addingPercentEncoding(withAllowedCharacters: allowed)?
            .replacingOccurrences(of: "%20", with: "+") ?? value
    }

    private static func buildMerchantData(
        orderId: String, amount: String, customerName: String,
        studentCode: String, formNo: String,
        merchantParam1: String, merchantParam2: String, merchantParam3: String,
        merchantParam4: String, merchantParam5: String
    ) -> String {
        var sb = merchantId
        let params: [(String, String)] = [
            ("student_code", studentCode),
            ("finalPayAmt", amount),
            ("first_name", customerName),
            ("form_no", formNo),
            ("redirect_url", ccavenueRedirectUrl),
            ("cancel_url", ccavenueCancelUrl),
            ("currency", "INR"),
            ("language", "EN"),
            ("amount", String(format: "%.2f", Double(amount) ?? 0.0)),
            ("merchant_id", merchantId),
            ("order_id", orderId),
            ("merchant_param1", merchantParam1),
            ("merchant_param2", merchantParam2),
            ("merchant_param3", merchantParam3),
            ("merchant_param4", merchantParam4),
            ("merchant_param5", merchantParam5)
        ]
        for (key, value) in params {
            sb += "\(key)=\(phpUrlEncode(value))&"
        }

        #if DEBUG
        print("===== CCAVENUE REQUEST - IOS =====")
        print("order_id        = \(orderId)")
        print("student_code    = \(studentCode)")
        print("finalPayAmt     = \(amount)")
        print("first_name      = \(customerName)")
        print("form_no         = \(formNo)")
        print("redirect_url    = \(ccavenueRedirectUrl)")
        print("cancel_url      = \(ccavenueCancelUrl)")
        print("currency        = INR")
        print("language        = EN")
        print("amount          = \(String(format: "%.2f", Double(amount) ?? 0.0))")
        print("merchant_id     = \(merchantId)")
        print("merchant_param1 = \(merchantParam1)")
        print("merchant_param2 = \(merchantParam2)")
        print("merchant_param3 = \(merchantParam3)")
        print("merchant_param4 = \(merchantParam4)")
        print("merchant_param5 = \(merchantParam5)")
        print("==================================")
        #endif

        return sb
    }

    @objc func startPayment(
        _ params: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.pendingResolve = resolve
            self.pendingReject = reject

            guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
                reject("NO_ROOT_VC", "No root view controller found", nil)
                return
            }

            let orderId = params["orderId"] as? String ?? ""
            let amount = params["amount"] as? String ?? "0.00"
            let customerName = params["customerName"] as? String ?? ""
            let studentCode = params["studentCode"] as? String ?? ""
            let formNo = params["formNo"] as? String ?? ""
            let merchantParam1 = params["merchantParam1"] as? String ?? ""
            let merchantParam2 = params["merchantParam2"] as? String ?? ""
            let merchantParam3 = params["merchantParam3"] as? String ?? amount
            let merchantParam4 = params["merchantParam4"] as? String ?? studentCode
            let merchantParam5 = params["merchantParam5"] as? String ?? customerName

            let merchantData = Self.buildMerchantData(
                orderId: orderId, amount: amount, customerName: customerName,
                studentCode: studentCode, formNo: formNo,
                merchantParam1: merchantParam1, merchantParam2: merchantParam2,
                merchantParam3: merchantParam3, merchantParam4: merchantParam4,
                merchantParam5: merchantParam5
            )

            guard let encryptedData = CCAvenueCrypto.encrypt(plainText: merchantData, workingKey: Self.workingKey) else {
                reject("ENCRYPTION_FAILED", "Failed to encrypt payment data", nil)
                return
            }

            let checkoutVC = CCAvenueCheckoutViewController()
            checkoutVC.orderId = orderId
            checkoutVC.encryptedData = encryptedData
            checkoutVC.accessCode = Self.accessCode
            checkoutVC.checkoutUrl = Self.checkoutUrl
            checkoutVC.workingKey = Self.workingKey
            checkoutVC.completionHandler = { [weak self] response in
                self?.handlePaymentResult(response)
            }

            let navController = UINavigationController(rootViewController: checkoutVC)
            navController.modalPresentationStyle = .fullScreen

            if let presentedVC = rootVC.presentedViewController {
                presentedVC.present(navController, animated: true)
            } else {
                rootVC.present(navController, animated: true)
            }
        }
    }

    private func handlePaymentResult(_ response: [String: String]) {
        let result: [String: Any] = [
            "orderId": response["order_id"] ?? "",
            "trackingId": response["tracking_id"] ?? "",
            "bankRefNo": response["bank_ref_no"] ?? "",
            "orderStatus": response["order_status"] ?? "",
            "paymentMode": response["payment_mode"] ?? "",
            "amount": response["amount"] ?? "",
            "currency": response["currency"] ?? "",
            "responseCode": response["response_code"] ?? "",
            "statusMessage": response["status_message"] ?? "",
            "failureMessage": response["failure_message"] ?? "",
            "billingName": response["billing_name"] ?? "",
            "merchantParam1": response["merchant_param1"] ?? "",
            "merchantParam2": response["merchant_param2"] ?? "",
            "merchantParam3": response["merchant_param3"] ?? "",
            "merchantParam4": response["merchant_param4"] ?? "",
            "merchantParam5": response["merchant_param5"] ?? "",
            "cardName": response["card_name"] ?? "",
            "statusCode": response["status_code"] ?? ""
        ]
        pendingResolve?(result)
        pendingResolve = nil
        pendingReject = nil
    }
}
