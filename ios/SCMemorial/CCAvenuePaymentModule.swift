//
//  CCAvenuePaymentModule.swift
//
//  CCAvenue payment — NATIVE INTEGRATION BOUNDARY (iOS).
//
//  ============================================================================
//  STATUS: PLACEHOLDER — NOT PART OF THE XCODE TARGET YET.
//  ============================================================================
//
//  The React Native payment architecture currently runs in MOCK mode
//  (src/config/payment.ts, PAYMENT_MODE = "MOCK"). The mock adapter is fully
//  self-contained in JavaScript and never calls this module.
//
//  This file is the Swift seam where the OFFICIAL CCAvenue iOS SDK will be
//  connected later. It is intentionally NOT added to the Xcode project
//  (SCMemorial.xcodeproj) right now, so it does not affect the build.
//
//  When the official CCAvenue iOS SDK is available and PAYMENT_MODE switches
//  to "CCAVENUE":
//
//    1. Add the official CCAvenue iOS SDK (CocoaPods / SPM) and add this file
//       to the SCMemorial target in SCMemorial.xcodeproj.
//    2. Implement `startPayment` to launch the official CCAvenue payment
//       screen using the merchant configuration (merchantId / accessCode /
//       workingKey / encryptionKey) passed from JavaScript.
//    3. Implement `verifyPayment` if CCAvenue exposes client-side checks
//       (server-side verification should live in the backend).
//
//  The JS side (src/services/payment/RealCCAvenueProvider.ts) already has the
//  matching calls, marked with TODOs.
//
//  NOTE: No official CCAvenue SDK APIs are referenced here because the SDK is
//  not installed in this project yet. Nothing here is an official CCAvenue
//  API or class.

import Foundation
import React

@objc(CCAvenuePayment)
class CCAvenuePaymentModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  /// Starts a CCAvenue payment session.
  /// - Parameters:
  ///   - options: JSON dictionary with orderId/amount/currency/billing details.
  ///   - resolver: Resolves with the normalized payment result.
  ///   - rejecter: Rejects when the payment could not be started.
  @objc(startPayment:resolver:rejecter:)
  func startPayment(_ options: NSDictionary,
                    resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    // TODO(real CCAvenue):
    //   let orderId = options["orderId"] as? String ?? ""
    //   let amount = options["amount"] as? String ?? "0"
    //   let currency = options["currency"] as? String ?? "INR"
    //   ... initialize the official CCAvenue SDK with merchant config ...
    //   ... present the CCAvenue payment UI and await the callback ...
    //   ... map the gateway callback into the normalized result dictionary
    //       and call resolver(result) or rejecter(code, message, nil) ...
    rejecter(
      "NOT_CONFIGURED",
      "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode.",
      nil
    )
  }

  /// Cancels an in-flight CCAvenue payment session if the SDK supports it.
  @objc(cancelPayment:rejecter:)
  func cancelPayment(_ resolver: @escaping RCTPromiseResolveBlock,
                     rejecter: @escaping RCTPromiseRejectBlock) {
    // TODO(real CCAvenue): dismiss/abort the SDK session if possible.
    rejecter(
      "NOT_CONFIGURED",
      "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode.",
      nil
    )
  }

  /// Placeholder for any client-side transaction status lookups.
  @objc(verifyPayment:transactionId:resolver:rejecter:)
  func verifyPayment(_ orderId: String,
                     transactionId: String,
                     resolver: @escaping RCTPromiseResolveBlock,
                     rejecter: @escaping RCTPromiseRejectBlock) {
    // TODO(real CCAvenue): optional client-side status check.
    rejecter(
      "NOT_CONFIGURED",
      "Real CCAvenue SDK is not configured yet. The app currently runs in MOCK payment mode.",
      nil
    )
  }
}
