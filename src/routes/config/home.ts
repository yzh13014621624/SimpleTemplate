/*
 * @description: 首页所需路由配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:04:33
 * @LastEditTime: 2019-09-07 15:12:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: '-1',
    level: 2,
    parent: '-1',
    path: '/home/panel',
    title: '系统首页',
    component: Loadable(() => import('pages/main/home/system'))
  },
  {
    exact: true,
    icon: '',
    key: '-1',
    level: 2,
    parent: '-1',
    path: '/home/account',
    title: '账户设置',
    component: Loadable(() => import('pages/main/home/account'))
  }
]
