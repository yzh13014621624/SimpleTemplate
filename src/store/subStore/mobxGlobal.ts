/*
 * @description: 全局状态管理
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 15:20:00
 * @LastEditTime: 2019-09-09 11:06:47
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action, computed } from 'mobx'
import { SysUtil, globalEnum, ComUtil, JudgeUtil } from 'utils'

import AuthorityList from 'service/AuthorityList'

const { getSessionStorage, removeSession, clearSession } = SysUtil
const { admin, auth, token } = globalEnum

export class MobxGlobal {
  authorityList = AuthorityList // 总权限列表

  @observable // 登录角色信息
  admin: any = getSessionStorage(admin) || {}

  @observable // 当前角色权限列表
  adminAuthorityList: string[] = getSessionStorage(auth) || []

  @computed
  get isLogin () {
    return this.adminAuthorityList.length > 0
  }

  @action
  loginOut = () => {
    removeSession(auth)
    removeSession(admin)
    removeSession(token)
    this.adminAuthorityList = []
  }

  @action
  setAdminInfo = (admin: any) => { this.admin = admin }

  @action
  setAuthorityList = (adminAuthorityList: string[]) => { this.adminAuthorityList = adminAuthorityList }

  @action // 判断权限，支持列表形式权限判断
  hasAuthority = (key: string | ReadonlyArray<string>): boolean | boolean[] => {
    const adminAuthorityList = this.adminAuthorityList
    if (typeof key === 'string') return ComUtil.inArray(key, adminAuthorityList).include
    const tempList = [...adminAuthorityList, ...key]
    if (tempList.length === adminAuthorityList.length) return Array(key.length).fill(true)
    const tempArr: boolean[] = []
    key.forEach(item => {
      tempArr.push(ComUtil.inArray(item, adminAuthorityList).include)
    })
    return tempArr
  }
}

export default new MobxGlobal()
