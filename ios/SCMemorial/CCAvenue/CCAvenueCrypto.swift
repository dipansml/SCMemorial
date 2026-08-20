import Foundation
import CommonCrypto

enum CCAvenueCrypto {

    private static let fixedIV: [UInt8] = [
        0x00, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f
    ]

    static func encrypt(plainText: String, workingKey: String) -> String? {
        guard let keyData = workingKey.data(using: .utf8),
              let plainData = plainText.data(using: .utf8) else { return nil }
        let md5Data = digestMD5(keyData)

        let bufferSize = plainData.count + kCCBlockSizeAES128
        var buffer = Data(count: bufferSize)
        var bytesEncrypted = 0

        let status = md5Data.withUnsafeBytes { keyBytes in
            plainData.withUnsafeBytes { plainBytes in
                buffer.withUnsafeMutableBytes { bufferBytes in
                    fixedIV.withUnsafeBytes { ivBytes in
                        CCCrypt(
                            CCOperation(kCCEncrypt),
                            CCAlgorithm(kCCAlgorithmAES),
                            CCOptions(kCCOptionPKCS7Padding),
                            keyBytes.baseAddress, kCCKeySizeAES128,
                            ivBytes.baseAddress,
                            plainBytes.baseAddress, plainData.count,
                            bufferBytes.baseAddress, bufferSize,
                            &bytesEncrypted
                        )
                    }
                }
            }
        }

        guard status == kCCSuccess else { return nil }
        let encryptedData = buffer.prefix(bytesEncrypted)
        return encryptedData.map { String(format: "%02x", $0) }.joined()
    }

    static func decrypt(cipherText: String, workingKey: String) -> String? {
        guard let keyData = workingKey.data(using: .utf8),
              let cipherData = Data(hexString: cipherText) else { return nil }
        let md5Data = digestMD5(keyData)

        let bufferSize = cipherData.count + kCCBlockSizeAES128
        var buffer = Data(count: bufferSize)
        var bytesDecrypted = 0

        let status = md5Data.withUnsafeBytes { keyBytes in
            cipherData.withUnsafeBytes { cipherBytes in
                buffer.withUnsafeMutableBytes { bufferBytes in
                    fixedIV.withUnsafeBytes { ivBytes in
                        CCCrypt(
                            CCOperation(kCCDecrypt),
                            CCAlgorithm(kCCAlgorithmAES),
                            CCOptions(kCCOptionPKCS7Padding),
                            keyBytes.baseAddress, kCCKeySizeAES128,
                            ivBytes.baseAddress,
                            cipherBytes.baseAddress, cipherData.count,
                            bufferBytes.baseAddress, bufferSize,
                            &bytesDecrypted
                        )
                    }
                }
            }
        }

        guard status == kCCSuccess else { return nil }
        let decryptedData = buffer.prefix(bytesDecrypted)
        return String(data: decryptedData, encoding: .utf8)
    }

    private static func digestMD5(_ data: Data) -> Data {
        var digest = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
        data.withUnsafeBytes { bytes in
            CC_MD5(bytes.baseAddress, CC_LONG(data.count), &digest)
        }
        return Data(digest)
    }
}

private extension Data {
    init?(hexString: String) {
        let hex = hexString.replacingOccurrences(of: " ", with: "")
        guard hex.count % 2 == 0 else { return nil }
        var data = Data(capacity: hex.count / 2)
        var index = hex.startIndex
        while index < hex.endIndex {
            let nextIndex = hex.index(index, offsetBy: 2)
            guard let byte = UInt8(hex[index..<nextIndex], radix: 16) else { return nil }
            data.append(byte)
            index = nextIndex
        }
        self = data
    }
}
