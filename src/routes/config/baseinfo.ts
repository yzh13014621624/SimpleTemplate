/*
 * @description: 基础信息
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-14 15:42:01
 * @LastEditTime: 2019-09-09 10:35:10
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    exact: true,
    icon: '',
    key: 'ZC000100030000',
    level: 2,
    parent: '-1',
    path: '/base-info/category',
    title: '类目管理',
    component: Loadable(() => import('pages/main/baseinfo/categorylist'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000100040000',
    level: 2,
    parent: '-1',
    path: '/base-info/labelmanagement',
    title: '标签管理',
    component: Loadable(() => import('pages/main/baseinfo/labelmanagement'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000100050000',
    level: 2,
    parent: '-1',
    path: '/base-info/goodsmanagement',
    title: '商品单位管理',
    component: Loadable(() => import('pages/main/baseinfo/goodsmanagement'))
  },
  {
    exact: true,
    icon: '',
    key: 'ZC000100060000',
    level: 2,
    parent: '-1',
    path: '/base-info/departmentmanagement',
    title: '部门管理',
    component: Loadable(() => import('pages/main/baseinfo/departmentmanagement'))
  }
]