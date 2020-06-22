/*
 * @description: 顶部 tab 和左侧 tab 联动控制
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-14 14:17:27
 * @LastEditTime: 2019-09-10 10:02:50
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'

import mobxGlobal from './mobxGlobal'

import parentRoutes, { childrenRoutes } from 'routes/config'

import { ComUtil } from 'utils'

import { RouteOption } from 'typings/global'

const activePath = '/login'

export class MobxTabs {
  constructor () {
    this.filterTopTabData()
  }

  openKeys = parentRoutes.map(route => route.path)

  @observable
  topTabData: RouteOption[] = []

  @observable
  activeTopRoute: RouteOption = parentRoutes[0]

  @observable
  siderData: RouteOption[] = parentRoutes[0].children!

  @observable
  activeSiderRoute: RouteOption = parentRoutes[0].children![0]

  @observable // 当前激活的 路由记录
  activeRoute: RouteOption = parentRoutes[0].children![0]

  @observable
  activePath: string = activePath

  @action // 根据权限过滤 tab 数据
  filterTopTabData = () => {
    const list = mobxGlobal.adminAuthorityList
    this.topTabData = parentRoutes.filter(route => {
      const { include } = ComUtil.inArray(route.key, list)
      return include
    })
  }

  @action
  setActiveTopRoute = (parentRoute: RouteOption) => {
    this.activeTopRoute = parentRoute
  }

  @action // 根据顶部 tab 过滤侧边栏数据
  filterSiderData = (path: string) => {
    const list = mobxGlobal.adminAuthorityList
    const parentRoute = this.topTabData.find(route => route.path === path)!
    const { children } = parentRoute
    this.setActiveTopRoute(parentRoute)
    if (children && (!!children.length)) {
      this.siderData = children.filter(route => {
        const { include } = ComUtil.inArray(route.key, list)
        return include
      })
    }
    this.activeSiderRoute = this.siderData[0]
    return this.activeSiderRoute
  }
  
  @action
  setActiveSiderRoute = (path: string) => {
    const childRoute = this.siderData.find(route => route.path === path)!
    this.activeSiderRoute = childRoute
    this.setActiveTopRoute(childRoute.parentRoute!)
  }

  @action
  setActivePath = (path: string) => {
    this.activePath = path
  }

  @action // 监听浏览器地址栏的输入跳转
  watchBrowersBehavior = (path: string) => {
    const routeItem = childrenRoutes.find(routeItem => routeItem.path === path)
    if (routeItem) {
      const list = mobxGlobal.adminAuthorityList
      const { path, level, parentRoute, key } = routeItem
      const hasAuth = level < 3 && !ComUtil.inArray(key, list).include
      this.activeRoute = routeItem
      if (this.activePath === path) return null
      this.setActivePath(path)
      if (/\/login|\/404/.test(path)) return path
      // if (hasAuth) return '/404'
      if (level === 3) {
        const grandParentRoute = this.topTabData.find(par => par.path === parentRoute!.parentRoute!.path)!
        this.setActiveTopRoute(grandParentRoute)
        this.siderData = grandParentRoute.children!
        this.activeSiderRoute = parentRoute!
        return null
      }
      if (level === 2) {
        if (path === this.activeSiderRoute.path) return null
        const parentsRoute = this.topTabData.find(par => par.path === parentRoute!.path)!
        this.setActiveTopRoute(parentsRoute)
        this.siderData = parentsRoute.children!
        this.activeSiderRoute = routeItem
        return null
      }
      const parentsRoute = this.topTabData.find(par => par.path === path)!
      const siderData = parentsRoute.children!
      this.setActiveTopRoute(parentsRoute)
      this.siderData = siderData
      this.activeSiderRoute = siderData[0]
      return null
    }
    return '/404'
  }

  @action
  resetAllData = () => {
    this.topTabData = []
    this.activeTopRoute = parentRoutes[0]
    this.siderData = parentRoutes[0].children!
    this.activeSiderRoute = parentRoutes[0].children![0]
    this.activeRoute = parentRoutes[0].children![0]
    this.activePath = activePath
  }
}


export default new MobxTabs()
