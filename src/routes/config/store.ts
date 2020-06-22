/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-26 10:25:51
 * @LastEditTime: 2019-09-12 18:01:06
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000500010000',
    level: 2,
    parent: '-1',
    path: '/shop-management/list',
    title: '门店列表',
    component: Loadable(() => import('pages/main/store/storelist/list')),
    children:[
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/list/edit',
        title: '门店编辑页',
        component: Loadable(() => import('pages/main/store/storelist/edit'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/list/detail',
        title: '门店详情页',
        component: Loadable(() => import('pages/main/store/storelist/detail'))
      },
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000500020000',
    level: 2,
    parent: '-1',
    path: '/shop-management/classfiy',
    title: '门店商品分类',
    component: Loadable(() => import('pages/main/store/goodsclassify/list')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/classfiy/detail',
        title: '门店商品分类-详情页',
        component: Loadable(() => import('pages/main/store/goodsclassify/detail'))
      }
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000500010001',
    level: 2,
    parent: '-1',
    path: '/shop-management/store',
    title: '添加门店',
    component: Loadable(() => import('pages/main/store/addstore'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000500030000',
    level: 2,
    parent: '-1',
    path: '/shop-management/client',
    title: '客户管理',
    component: Loadable(() => import('pages/main/store/clientmanage/list')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/client/add',
        title: '添加客户',
        component: Loadable(() => import('pages/main/store/clientmanage/add'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/client/edit',
        title: '客户编辑',
        component: Loadable(() => import('pages/main/store/clientmanage/edit'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/client/detail',
        title: '客户详情',
        component: Loadable(() => import('pages/main/store/clientmanage/detail'))
      }
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000500040000',
    level: 2,
    parent: '-1',
    path: '/shop-management/provider',
    title: '供应商管理',
    component: Loadable(() => import('pages/main/store/providermanage/list')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/provider/add',
        title: '添加供应商',
        component: Loadable(() => import('pages/main/store/providermanage/add'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/provider/edit',
        title: '供应商编辑',
        component: Loadable(() => import('pages/main/store/providermanage/edit'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/shop-management/provider/detail',
        title: '查看供应商',
        component: Loadable(() => import('pages/main/store/providermanage/detail'))
      }
    ]
  }
]