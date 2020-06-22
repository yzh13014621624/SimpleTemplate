/*
 * @description: 接口请求工具
 * @author: minjie, huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 14:57:41
 * @LastEditTime: 2020-04-15 17:42:14
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import axios from 'axios'
import { Modal } from 'antd'
import { globalEnum } from './Enum'
import SysUtil from './SysUtil'

import { createHashHistory } from 'history'

// 类型检查
interface UrlInteface {
  path:string
  type?:string
}

/* 方法请求的参数检查 */
interface Parms {
  type:string
  path:string
  params?:object
  config?:object
}

/* request 返回值类型 */
interface Response {
  code: number
  data: any
  msg: (string|number)[]
  [key: string]: any
}

const ServerURL = process.env.REACT_APP_API!
const isPreEnv = process.env.MODE === 'pre'
const { replace } = createHashHistory()

export default class Axios {
  static traceId: string

  static authorization: string

  static showTipsOnce: boolean = true

  static axios:any = axios

  static path: string = ServerURL

  // 普通
  static instance = Axios.create()
  // 上传
  static upload:any = Axios.create(true)

  // 缓存 header 所需信息
  static cacheAxiosHeaderConfig () {
    let traceId: string
    let oldUuid = SysUtil.getSessionStorage(globalEnum.uuid)
    const uid = SysUtil.uuid()
    const admin = SysUtil.getSessionStorage(globalEnum.admin)
    const token = SysUtil.getSessionStorage(globalEnum.token) || ''
    !oldUuid && (oldUuid = uid)
    SysUtil.setSessionStorage(globalEnum.uuid, oldUuid)
    if (admin) traceId = `web_${oldUuid}_${admin.userID}`
    else traceId = `web_${oldUuid}`
    Axios.authorization = token
    Axios.traceId = traceId
  }

  static create (upload: boolean = false, baseURL = Axios.path) {
    const axiosN = axios.create({
      baseURL,
      timeout: 5000
    })

    // 请求拦截
    axiosN.interceptors.request.use((config: any) => {
      return Axios.requestConfig(config, upload)
    }, (err:any) => {
      console.log(err)
    })
    // http response 拦截器 响应
    axiosN.interceptors.response.use((response: any) => {
      const token = response.headers.authorization
      if (token) {
        SysUtil.setSessionStorage(globalEnum.token, token)
        Axios.authorization = token
      }
      return response // token 验证失败
    }, (err:any) => {
      return Axios.responseConfigError(err)
    })
    return axiosN
  }

  static request (url:UrlInteface, interceptor?: boolean): Promise<Response>
  static request (url:UrlInteface, param?:object | Boolean, interceptor?: boolean): Promise<Response>
  static request (url:UrlInteface, param?:object | Boolean, interceptor?: boolean, mock?:Boolean): Promise<Response>
  static request (url: UrlInteface, param?: object | Boolean, interceptor?: boolean, mock?: Boolean): Promise<Response> {
    interceptor = interceptor || false
    // 访问路径:访问类型（post|get）:添加参数(data|params):添加额外的配置
    const obj:Parms = {
      path: '',
      type: url.type || 'post',
      params: (typeof param !== 'boolean' && typeof param !== 'undefined') ? param : undefined
    }
    // 是否进行mockJS 模拟数据
    if (typeof param === 'boolean' || mock) {
      obj.path = (param || mock) ? url.path + '.mock' : url.path
      // 发起请求返回请求的对象
      return Axios.OpenRequest(obj, axios, false, true)
    } else {
      obj.path = url.path
      // 发起请求返回请求的对象
      return Axios.OpenRequest(obj, Axios.instance, interceptor)
    }
  }

  static OpenRequest ({ type, path, params }: Parms, AxiosObj: any, interceptor: boolean, mock?: boolean): Promise<Response> {
    console.log(path, 'path')
    return new Promise((resolve, reject) => {
      let ax: Promise<any>
      if (type === 'post') {
        ax = AxiosObj.post(path, params)
      } else {
        ax = AxiosObj.get(path, { params })
      }
      ax.then((res:any) => {
        const { code, msg, data, message } = res.data
        if (code && code === 1001) {
          sessionStorage.clear()
          replace('/login')
        }
        if (code && code !== 200) {
          const a = { code: code, msg: msg || message, data: data }
          if (!interceptor && Axios.showTipsOnce) {
            Axios.showTipsOnce = false
            Axios.errorTips(a.msg[0])
          }
          if (interceptor) reject(a)
        } else {
          resolve(res.data)
        }
      }).catch((err:any) => {
        const a = { msg: err.message }
        if (!interceptor && Axios.showTipsOnce) {
          Axios.showTipsOnce = false
          Axios.errorTips(a.msg[0])
        }
        if (interceptor) reject(a)
        else reject(a)
      })
    })
  }

  static requestConfig (config:any, upload: boolean = false) {
    const { authorization, traceId } = Axios
    config.headers = {
      traceId,
      Authorization: authorization,
      platform: 'web',
      'Content-Type': upload ? 'multipart/form-data' : 'application/json;charset=utf-8',
      'X-Ca-Stage': 'PRE'
    }
    if (!isPreEnv) delete config.headers['X-Ca-Stage']
    return config
  }

  // 错误码修改
  static switchResponse (code: number): string {
    let message = '出错啦'
    switch (code) {
      case 400 : message = '请求错误(400), 最大的可能参数传错了'
        break
      case 401 : message = '请重新登录(401)'
        break
      case 403 : message = '您没有权限'
        break
      case 404 : message = '请求出错(404)'
        break
      case 408 : message = '请求超时(408)'
        break
      case 409 : message = '未查询到数据信息！'
        break
      case 500 : message = '请求方式错误，服务器错误(500)'
        break
      case 501 : message = '服务未实现(501)'
        break
      case 503 : message = '跨域的问题或是其他的'
        break
      default : message = '连接出错!'
    }
    return message
  }

  static responseConfigError (err:any) {
    if (err.message.indexOf('Network') >= 0) {
      err.message = '404 找不到服务器啦'
    } else if (err.message.indexOf('timeout') >= 0) {
      err.message = '请求超时啦'
    } else if (err.response) {
      err.message = Axios.switchResponse(err.response.status)
    }
    return Promise.reject(err) // 返回接口返回的错误信息
  }

  // 提示信息
  static errorTips (msg: any, title?:string) {
    Modal.error({
      title: title || '消息提示',
      centered: true,
      content: msg,
      onOk () {
        Axios.showTipsOnce = true
        return new Promise((resolve, reject) => (resolve()))
      }
    })
  }
}
