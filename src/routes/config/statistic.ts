/*
 * @description: 报表中心路由
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-15 16:05:49
 * @LastEditTime: 2019-09-11 17:44:21
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000700010000',
    level: 2,
    parent: '-1',
    path: '/statistic-management/shop',
    title: '营业额统计',
    component: Loadable(() => import('pages/main/statistic/shop-statistic'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000700020000',
    level: 2,
    parent: '-1',
    path: '/statistic-management/goods',
    title: '商品统计',
    component: Loadable(() => import('pages/main/statistic/goods-statistic'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000700030000',
    level: 2,
    parent: '-1',
    path: '/statistic-management/member',
    title: '会员统计',
    component: Loadable(() => import('pages/main/statistic/member-statistic'))
  }
]
