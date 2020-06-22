/*
 * @description: 上传文件到 OSS
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-04 14:50:34
 * @LastEditTime: 2019-09-05 09:20:00
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import SysUtil from './SysUtil'
import { OSSEnum } from './Enum'
import Axios from './Axios'
import Api from 'service/ServerApi'

const OSS = require('ali-oss')


export default class OSSUtil {
  static ak = SysUtil.getSessionStorage(OSSEnum.osskey)

  /**
   * 上传图片或者文件
   * @param file File 对象
   * @param modules 对应的需要上传图片的模块
   */
  static async multipartUpload (file: File, moudle: string): Promise<{ name: string, url: string }> {
    try {
      await OSSUtil.getSTS(moudle)
      const { accessKeyId, accessKeySecret, securityToken, region, path, bucketName }: any = OSSUtil.ak
      const client = new OSS({
        region,
        accessKeyId,
        accessKeySecret,
        bucket: bucketName,
        stsToken: securityToken,
        secure: true
      })
      const name = path + '/' + OSSUtil.createFileName(file.name)
      const result = await client.multipartUpload(name, file)
      console.log(result)
      return { name: result.name, url: result.res.requestUrls }
    } catch (e) {
      console.log(e)
      return { name: '', url: '' } 
    }
  }

  /* 获取 STS */
  static async getSTS (moudle: string) {
    try {
      const ak = OSSUtil.ak
      if (ak) {
        if (new Date().getTime() < new Date(ak.expiration).getTime()) return
        const { data } = await Axios.request(Api.publicGetSt, { moudle })
        SysUtil.setSessionStorage(OSSEnum.osskey, data)
        OSSUtil.ak = data
      }
      const { data } = await Axios.request(Api.publicGetSt, { moudle })
      SysUtil.setSessionStorage(OSSEnum.osskey, data)
      OSSUtil.ak = data
    } catch (e) {
      console.log(e)
    }
  }

  /* 统一生成文件名 */
  static createFileName (filePath: string) {
    const suffer = filePath.substring(filePath.lastIndexOf('.'))
    const timestamp = new Date().getTime()
    return `zc__${timestamp}${suffer}`
  }
}
