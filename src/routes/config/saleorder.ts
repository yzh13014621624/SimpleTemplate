/*
 * @description: 销售单路由
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 11:11:17
 * @LastEditTime: 2019-09-02 12:01:15
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000300010000',
    level: 2,
    parent: '-1',
    path: '/sale-management/list',
    title: '销售单列表',
    component: Loadable(() => import('pages/main/saleorder/index')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/sale-management/detail',
        title: '销售单详情',
        component: Loadable(() => import('pages/main/saleorder/saleOrderDetail/index'))
      }
    ]
  }
]