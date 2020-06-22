/**
 * @description AES加密工具类
 * @author minjie
 * @class AesUtils
 * @createTime 2019/03/18
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const JSEncrypt = require('jsencrypt')
const CryptoJS = require('crypto-js')
const key = 'hoYdxx*6A7HWrs4Mb}r9wPTm'
const iv = '0102030405060708'
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPS8eaxMEKLTNL+oYwliannp44+tKS65nR4ODYFsmGaQGkoe7LhznkLyl+NARtrxwU7Hp7jW49Gc0evCK+fLPmotdpGKGHnbQQXLAJKHKG1A8rRxKxByOJCAgQdZ4G0oh7vTEGUve8Dmp5Bearbno5fIFnrHymNKajy3AT0JXWuQIDAQAB'

const encrypt = new JSEncrypt.JSEncrypt()
encrypt.setPublicKey(publicKey)

/* ECB加密 */
const optionsECB = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}
/* CBC加密 */
const optionsCBC = {
  iv: CryptoJS.enc.Utf8.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}
export default class AesUtils {
  static encrypt (v: string) {
    return encrypt.encrypt(v)
  }
  /**
   * AES_CBC 加密
   * @param {*} text 加密的明文
   */
  static encryptCBC (text:string) {
    let keyHex = CryptoJS.enc.Utf8.parse(key)
    let encryptedData = CryptoJS.AES.encrypt(text, keyHex, optionsCBC)
    return encryptedData.ciphertext.toString().toUpperCase()
  }

  /**
   * AES_CBC 解密
   * @param {*} text 需要解密
   */
  static decryptCBC (text:string) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(text)
    let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let keyHex = CryptoJS.enc.Utf8.parse(key)
    let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, optionsCBC)
    return decryptedData.toString(CryptoJS.enc.Utf8)
  }

  /**
   * AES_ECB 加密
   * @param {*} text 加密的明文
   */
  static encryptECB (text:string) {
    let keyHex = CryptoJS.enc.Utf8.parse(key)
    let encryptedData = CryptoJS.AES.encrypt(text, keyHex, optionsECB)
    return encryptedData.ciphertext.toString().toUpperCase()
  }

  /**
   * AES_ECB 解密
   * @param {*} text 需要解密
   */
  static decryptECB (text:string) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(text)
    let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let keyHex = CryptoJS.enc.Utf8.parse(key)
    let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, optionsECB)
    return decryptedData.toString(CryptoJS.enc.Utf8)
  }
}
