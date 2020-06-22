/*
 * @description: 导出所有路由记录配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:27:18
 * @LastEditTime: 2019-09-07 15:09:16
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { RouteOption } from 'typings/global'

const files = require.context('.', true, /\.ts$/)
const modules: { [key: string]: RouteOption[] } = {}
const regFileName = /^\.\/(\w+\/)?|\.ts$/g
const cloneDeep = <T>(d: any): T => JSON.parse(JSON.stringify(d))

const parentRoutes: RouteOption[] = [
  {
    alias: '系统首页',
    exact: true,
    icon: '',
    key: '-1',
    name: 'home',
    level: 1,
    parent: '-1',
    path: '/home',
    title: '首页'
  },
  {
    alias: '基本信息',
    exact: true,
    icon: '',
    key: '-1',
    name: 'baseinfo',
    level: 1,
    parent: '-1',
    path: '/base-info',
    title: '基础信息'
  },
  {
    name: 'member',
    alias: '会员管理',
    exact: true,
    icon: '',
    key: 'ZC000200000000',
    level: 1,
    parent: '-1',
    path: '/vip-management',
    title: '会员管理'
  },
  {
    alias: '门店管理',
    exact: true,
    icon: '',
    key: 'ZC000500000000',
    name: 'store',
    level: 1,
    parent: '-1',
    path: '/shop-management',
    title: '门店管理'
  },
  {
    alias: '商品管理',
    exact: true,
    icon: '',
    key: 'ZC000100000000',
    name: 'goodsManagement',
    level: 1,
    parent: '-1',
    path: '/goods-management',
    title: '商品管理'
  },
  {
    name: 'saleorder',
    alias: '销售管理',
    exact: true,
    icon: '',
    key: 'ZC000300000000',
    level: 1,
    parent: '-1',
    path: '/sale-management',
    title: '销售管理'
  },
  {
    alias: '采购管理',
    exact: true,
    icon: '',
    key: 'ZC000400000000',
    name:'purchase',
    level: 1,
    parent: '-1',
    path: '/purchase-management',
    title: '采购管理'
  },
  {
    alias: '运营管理',
    exact: true,
    icon: '',
    key: 'ZC000600000000',
    name:'operation',
    level: 1,
    parent: '-1',
    path: '/operation-management',
    title: '运营管理'
  },
  {
    alias: '报表中心',
    exact: true,
    icon: '',
    key: 'ZC000700000000',
    name: 'statistic',
    level: 1,
    parent: '-1',
    path: '/statistic-management',
    title: '报表中心'
  }
]

const childrenRoutes: RouteOption[] = [...parentRoutes]

const spreadChildRoute = (routeList: RouteOption[]) => {
  routeList.forEach(routeConfig => {
    const { children } = routeConfig
    childrenRoutes.push(routeConfig)
    children && (!!children.length) && spreadChildRoute(children)
  })
}

const injectParentRoute = (routeList: RouteOption[]) => {
   routeList.forEach(route => {
    let { name, level, children } = route
    level < 2 && (children = modules[name!])
    if (children) {
      children.forEach(child => {
        child.parentRoute = cloneDeep(route)
      })
      route.children = cloneDeep(children)
      injectParentRoute(children)
    }
  })
}

files.keys().forEach((key: string) => {
  if (key !== './index.ts') {
    const childRouteConfig = files(key).default
    modules[key.replace(regFileName, '')] = childRouteConfig
    spreadChildRoute(childRouteConfig)
  }
})

injectParentRoute(parentRoutes)

export { childrenRoutes }

export default parentRoutes
