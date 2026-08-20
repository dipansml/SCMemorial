package com.scmemorial.ccavenue

import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

object CCAvenueCrypto {

    private val FIXED_IV = byteArrayOf(
        0x00, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f
    )

    fun encrypt(plainText: String, workingKey: String): String {
        val md5 = MessageDigest.getInstance("MD5")
        val keyBytes = md5.digest(workingKey.toByteArray(Charsets.UTF_8))
        val secretKey = SecretKeySpec(keyBytes, "AES")
        val ivSpec = IvParameterSpec(FIXED_IV)
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec)
        val encrypted = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
        return bytesToHex(encrypted)
    }

    fun decrypt(cipherText: String, workingKey: String): String {
        val md5 = MessageDigest.getInstance("MD5")
        val keyBytes = md5.digest(workingKey.toByteArray(Charsets.UTF_8))
        val secretKey = SecretKeySpec(keyBytes, "AES")
        val ivSpec = IvParameterSpec(FIXED_IV)
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec)
        val decrypted = cipher.doFinal(hexToBytes(cipherText))
        return String(decrypted, Charsets.UTF_8)
    }

    private fun bytesToHex(bytes: ByteArray): String {
        val sb = StringBuilder()
        for (b in bytes) { sb.append(String.format("%02x", b)) }
        return sb.toString()
    }

    private fun hexToBytes(hex: String): ByteArray {
        val bytes = ByteArray(hex.length / 2)
        for (i in bytes.indices) {
            bytes[i] = Integer.parseInt(hex.substring(i * 2, i * 2 + 2), 16).toByte()
        }
        return bytes
    }
}
