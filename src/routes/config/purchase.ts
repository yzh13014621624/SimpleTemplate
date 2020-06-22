/*
 * @description: 采购管理
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-08-26 14:45:38
 * @LastEditTime: 2019-09-19 15:34:46
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000400010000',
    level: 2,
    parent: '-1',
    path: '/purchase-management/purchaseList',
    title: '采购管理',
    component: Loadable(() => import('pages/main/purchase/purchaseList')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '',
        path: '/purchase-management/purchase-details',
        title: '采购订单详情',
        component: Loadable(() => import('pages/main/purchase/purchaseDetails'))
      } 
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000400010001',
    level: 2,
    parent: '',
    path: '/purchase-management/purchaseAdd',
    title: '添加采购单',
    component: Loadable(() => import('pages/main/purchase/purchaseAdd'))
  }
]