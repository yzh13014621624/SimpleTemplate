/*
 * @description: login、404 等路由配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-20 16:09:59
 * @LastEditTime: 2019-08-30 15:28:52
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: '-1',
    level: 1,
    parent: '-1',
    path: '/login',
    title: '登录',
    component: Loadable(() => import('pages/login'))
  },
  {
    exact: true,
    icon: '',
    key: '-1',
    level: 1,
    parent: '-1',
    path: '/reset-password',
    title: '忘记密码',
    component: Loadable(() => import('pages/login/resetpassword'))
  },
  {
    exact: true,
    icon: '',
    key: '-1',
    level: 1,
    parent: '-1',
    path: '/404',
    title: '404',
    component: Loadable(() => import('pages/notfound'))
  }
]
