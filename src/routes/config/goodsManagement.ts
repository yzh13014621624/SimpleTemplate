/*
 * @description: 商品管理路由
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-15 16:05:49
 * @LastEditTime: 2019-09-09 16:13:30
 * @Copyright: Copyright © 2019 Shanghai Shangjia Logistics Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000100000000',
    name: 'goodsManagement',
    level: 2,
    parent: '-1',
    path: '/goods-management/index',
    title: '商品列表',
    component: Loadable(() => import('pages/main/goodsManagement/goodsList')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        name: 'goodsManagement',
        level: 3,
        parent: '-1',
        path: '/goods-management/good-detail/index',
        title: '商品详情',
        component: Loadable(() => import('pages/main/goodsManagement/goodsList/goodDetail'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        name: 'goodsManagement',
        level: 3,
        parent: '-1',
        path: '/goods-management/good-edit/index',
        title: '编辑商品',
        component: Loadable(() => import('pages/main/goodsManagement/goodsList/editGoods'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        name: 'goodsManagement',
        level: 3,
        parent: '-1',
        path: '/goods-management/store-list/index',
        title: '销售门店列表',
        component: Loadable(() => import('pages/main/goodsManagement/goodsList/storeList'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        name: 'goodsManagement',
        level: 3,
        parent: '-1',
        path: '/goods-management/sales-store/index',
        title: '新增销售门店',
        component: Loadable(() => import('pages/main/goodsManagement/goodsList/addSaleStore'))
      },
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000100020000',
    name: 'goodsManagement',
    level: 2,
    parent: '-1',
    path: '/goods-management/store-products/index',
    title: '门店商品列表',
    component: Loadable(() => import('pages/main/goodsManagement/storeProducts')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        name: 'goodsManagement',
        level: 3,
        parent: '-1',
        path: '/goods-management/store-products-detail/index',
        title: '门店商品详情',
        component: Loadable(() => import('pages/main/goodsManagement/goodsList/goodDetail'))
      }
    ]
  },
]
