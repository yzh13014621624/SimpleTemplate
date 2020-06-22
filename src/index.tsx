/*
 * @description: 入口文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-07 17:13:35
 * @LastEditTime: 2019-09-27 15:39:11
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { message, ConfigProvider } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zhCN from 'antd/es/locale/zh_CN'
import App from './App'

import { AppContainer } from 'react-hot-loader'

import store from './store'

import 'normalize.css'
import './assets/style/common.styl'

message.config({ duration: 2 })
moment.locale('zh-cn')

const configProvider = {
  locale: zhCN,
  csp: { nonce: new Date().getTime().toString() }
}

const render = (Component: any) => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...store}>
        <ConfigProvider {...configProvider} >
          <Component />
        </ConfigProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root'))
}
render(App)
if (module.hot) module.hot.accept('./App', () => render(App))
