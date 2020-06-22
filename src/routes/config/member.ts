/*
 * @description: 会员路由
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 11:11:17
 * @LastEditTime: 2019-09-02 12:00:09
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000200010000',
    level: 2,
    parent: '-1',
    path: '/vip-management/list',
    title: '会员列表',
    component: Loadable(() => import('pages/main/member/index')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/vip-management/detail',
        title: '会员详情',
        component: Loadable(() => import('pages/main/member/memberDetail/index'))
      }
    ]
  }
]
