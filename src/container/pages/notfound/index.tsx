/*
 * @description: 404 页面
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-20 16:07:54
 * @LastEditTime: 2019-08-20 16:35:35
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import notFound from 'assets/images/404/notfound.png'

import './style/index.less'

export default class Account extends RootComponent {
  render () {
    return (
      <div id="not-found">
        <img src={notFound} />
      </div>
    )
  }
}
