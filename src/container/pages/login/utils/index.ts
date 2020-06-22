/*
 * @description: 基于 Axios 工具重新封装的请求
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-12-30 14:10:42
 * @LastEditTime: 2020-03-26 10:53:08
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { Axios } from 'utils'

interface UrlInteface {
  path:string
  type?:string
}
const ServerURL: string = process.env.MODE === 'prod' ? 'https://core-api.sj56.com.cn' : 'https://coret-api.sj56.com.cn'
const axios = Axios.create(false, ServerURL)

export default (url: UrlInteface, param?: any, intercept = false) => {
  const obj = {
    path: url.path,
    type: url.type || 'post',
    params: (typeof param !== 'boolean' && typeof param !== 'undefined') ? param : undefined
  }
  return Axios.OpenRequest(obj, axios, intercept)
}
