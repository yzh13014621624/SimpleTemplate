/*
 * @description: 根路由
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:58:13
 * @LastEditTime: 2019-09-04 09:40:14
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { HashRouter as Router, Switch, Redirect } from 'react-router-dom'

import CustomRoutes from './routes'

import { BaseProps } from 'typings/global'

export default class Routes extends RootComponent<BaseProps> {
  render () {
    return (
      <Router hashType="noslash">
        <Switch>
          <Redirect exact from="/" to='/home/panel' />
          <CustomRoutes {...this.props} />
        </Switch>
      </Router>
    )
  }
}
