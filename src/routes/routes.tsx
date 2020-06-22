/*
 * @description: 自定义路由配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:48:18
 * @LastEditTime: 2019-09-04 09:52:31
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { Route, withRouter } from 'react-router-dom'

import { SysUtil, globalEnum } from 'utils'

import { childrenRoutes } from './config'

import { BaseProps } from 'typings/global'

class CustomRoutes extends RootComponent<BaseProps> {
  interceptRoute = (path: string) => {
    const auth = SysUtil.getSessionStorage(globalEnum.auth)
    const {
      mobxTabs: { watchBrowersBehavior, resetAllData, setActivePath, activePath },
      mobxGlobal: { loginOut },
      history: { replace }
    } = this.props
    if (path === activePath) return
    if (auth) {
      const targetPath = watchBrowersBehavior(path)
      if (targetPath) {
        (targetPath === '/login') && (loginOut()) && (resetAllData())
        ;(targetPath === '/404') && (replace('/404'))
      }
      return
    }
    /* TODO - 通过路由记录优化路由跳转逻辑 */
    setActivePath(path)
    if (path === '/reset-password') {
      replace(path)
      return
    }
    replace('/login')
    loginOut()
    resetAllData()
  }

  render () {
    this.interceptRoute(this.props.location.pathname)
    return (
      childrenRoutes.map((route, i) => {
        const { exact, path } = route
        return (
          <Route
            key={i}
            exact={exact}
            path={path}
            render={props => (<route.component {...props} {...this.props} />)} />
        )
      })
    )
  }
}

export default withRouter(CustomRoutes)
