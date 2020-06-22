/*
 * @description: 角色管理接口
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-04 09:35:32
 * @LastEditTime: 2019-09-06 09:45:29
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  findRoleList: { // 查询角色列表
    type:'post',
    path: '/stallone/role/findRoleList/zc'
  },
  findGrantedPerms: { // 拉取角色权限信息
    type:'get',
    path: '/stallone/role/findGrantedPerms/zc/'
  },
  grantPerms: { // 分配角色权限
    type:'post',
    path: '/stallone/role/grantPerms/zc'
  },
  roleRemove: { // 删除角色
    type:'post',
    path: '/stallone/role/remove/zc'
  },
  roleEdit: { // 修改角色
    type:'post',
    path: '/stallone/role/edit/zc'
  },
  roleAdd: { // 新增角色
    type:'post',
    path: '/stallone/role/add/zc'
  },
}
