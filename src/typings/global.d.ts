/*
 * @description: 全局类型定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 15:26:39
 * @LastEditTime: 2019-08-20 15:37:40
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as H from 'history'
import { MobxGlobal, MobxTabs } from 'store/index'

declare interface KeyValue {
  [key: string]: any
}

declare interface RouteOption extends KeyValue {
  readonly alias?: string
  readonly exact: boolean
  readonly icon: string
  readonly key: string
  readonly name?: string
  readonly level: number
  readonly parent: string
  readonly path: string
  readonly title: string
  readonly component?: any
  parentRoute?: RouteOption
  children?: Array<RouteOption>
}

declare interface BaseProps {
  history: H.History
  location: Location
  match: RouteMatch
  mobxGlobal: MobxGlobal
  mobxTabs: MobxTabs
  isFind?: boolean
  staticContext?: StaticContext
}

interface RouteMatch {
  params: KeyValue
  isExact: boolean
  path: string
  url: string
}

interface StaticContext {
  statusCode?: number
}

interface Location extends H.Location {
  query?: KeyValue
}
