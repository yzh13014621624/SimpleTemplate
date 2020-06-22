/*
 * @description: 运营管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-14 15:42:01
 * @LastEditTime: 2020-04-16 17:25:42
 * @Copyright: Copyright ? 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000600010000',
    level: 2,
    parent: '-1',
    path: '/operation-management/advertisement',
    title: '广告管理',
    component: Loadable(() => import('pages/main/operation/advertisement')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/operation-management/advertisement/add',
        title: '添加广告管理',
        component: Loadable(() => import('pages/main/operation/advertisement/addadvertisement'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/operation-management/advertisement/info',
        title: '查看广告',
        component: Loadable(() => import('pages/main/operation/advertisement/advertisetmentinfo'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/operation-management/advertisement/edit',
        title: '编辑广告',
        component: Loadable(() => import('pages/main/operation/advertisement/editadvertisement'))
      }
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000600020000',
    level: 2,
    parent: '-1',
    path: '/role-management/index',
    title: '角色管理',
    component: Loadable(() => import('pages/main/operation/roles')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/role-management/permission-setting',
        title: '权限设置',
        component: Loadable(() => import('pages/main/operation/roles/permissionSetting'))
      }
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000600030000',
    level: 2,
    parent: '-1',
    path: '/user-management/permission',
    title: '用户管理',
    component: Loadable(() => import('pages/main/operation/user')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/user-management/user-edit',
        title: '编辑用户',
        component: Loadable(() => import('pages/main/operation/user/userEdit'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/user-management/user-detail',
        title: '用户详情',
        component: Loadable(() => import('pages/main/operation/user/userDetail'))
      }
    ]
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000600030000',
    level: 2,
    parent: '-1',
    path: '/coupon-management/coupon',
    title: '优惠券管理',
    component: Loadable(() => import('pages/main/operation/coupon')),
    children: [
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/coupon-management/coupon-add',
        title: '编辑优惠券',
        component: Loadable(() => import('pages/main/operation/coupon/couponAdd'))
      },
      {
        exact: true,
        icon: '',
        key: '',
        level: 3,
        parent: '-1',
        path: '/coupon-management/coupon-details',
        title: '优惠券明细',
        component: Loadable(() => import('pages/main/operation/coupon/couponDetail'))
      }
    ]
  }
]
