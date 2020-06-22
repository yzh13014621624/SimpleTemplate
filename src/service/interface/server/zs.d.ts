/*
 * @description: 接口定义文件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-29 14:15:23
 * @LastEditTime: 2019-09-09 17:17:26
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */


type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 商品管理 >>>>>>>> */

  /* <<<<<<<< 商品列表 >>>>>>>> */
  'getGoodsType', 'getGoodsInfo', 'deleteGoods', 'insertShopGoods', 'cancelShopGoodsRelation',
  /* <<<<<<<< 门店商品列表 >>>>>>>> */
  'getShopGoods', 'updateShopGoodsStatus', 'updateShopGoodsPrice',

  /* <<<<<<<< 角色管理、 用户管理 >>>>>>>> */
  
  /* <<<<<<<< 角色管理 >>>>>>>> */
  'findRoleList', 'roleEdit', 'findGrantedPerms', 'grantPerms', 'roleRemove', 'roleAdd',
  /* <<<<<<<< 用户管理 >>>>>>>> */
  'findUserPageList', 'findUser', 'findGrantedRoles', 'userEdit', 'grantRoles', 'userAdd', 'userRemove', 'enableDisable'
]

type ServerZS = {
  [api in (typeof ServerList)[number]]: Api
}

export default ServerZS