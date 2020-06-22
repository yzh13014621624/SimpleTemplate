/*
 * @description: 根组件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 14:57:37
 * @LastEditTime: 2019-10-15 18:03:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { message, Modal } from 'antd'
import { Axios } from 'utils/index'
import ServerApi from 'service/ServerApi'
// import AuthorityList from '@server/AuthorityList'


/**
 * 错误的输出
 * @param msg 输出的消息
 * @param title 标题
 */
const error = (msg: any, title?: string) => {
  Modal.error({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}

const warning = (msg: any, title?: string) => {
  Modal.warning({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}

export default class RootComponent<P = {}, S = {}> extends React.Component<P, S> {
  $message = message // 消息组件
  axios = Axios
  api = ServerApi // api 的调用
  // AuthorityList = AuthorityList
  error = error // model 弹出框的Error
  warning = warning // model 弹出框的Waring
  lastClickTime = 1

  preventMoreClick = (callback: Function, interval = 500) => {
    const current = Date.now()
    if (current - this.lastClickTime > interval) {
      this.lastClickTime = current
      callback()
    }
  }
}
