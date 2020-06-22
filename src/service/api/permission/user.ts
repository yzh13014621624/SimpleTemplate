/*
 * @description: 用户管理接口
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-04 09:59:52
 * @LastEditTime: 2019-09-09 17:17:16
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

 export default {
  findUserPageList: { // 查询用户列表
    type: 'post',
    path: '/stallone/user/findUserPageList/zc'
  },
  findUser: { // 查询用户详情
    type: 'get',
    path: '/stallone/user/findUser/zc/'
  },
  findGrantedRoles: { // 查询匹配用户授权信息
    type: 'get',
    path: '/stallone/user/findGrantedRoles/zc/'
  },
  userEdit: { // 编辑用户
    type: 'post',
    path: '/stallone/user/edit/zc'
  },
  grantRoles: { // 分配角色
    type: 'post',
    path: '/stallone/user/grantRoles/zc'
  },
  userAdd: { // 新增角色
    type: 'post',
    path: '/stallone/user/add/zc'
  },
  userRemove: { // 新增角色
    type: 'get',
    path: '/stallone/user/remove/zc/'
  },
  enableDisable: { // 启用/停用用户
    type: 'get',
    path: '/stallone/user/enableDisable/zc/'
  },
 }