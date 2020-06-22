/*
 * @description: 商品管理模块接口路径
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-28 15:05:05
 * @LastEditTime: 2020-04-07 18:06:18
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  getGoodsType: { // 获取商品类型
    type: 'get',
    path: '/dubrovnik2/common/v1/basic/getGoodsType'
  },
  getGoodsInfo: { // 商品详情
    type: 'post',
    path: '/dubrovnik2/goods/v2/getGoodsInfo'
  },
  deleteGoods: { // 删除商品
    type: 'post',
    path: '/dubrovnik2/goods/v1/deleteGoods'
  },
  insertShopGoods: { // 销售门店列表-新增提交
    type: 'post',
    path: '/dubrovnik2/goods/v1/insertShopGoods'
  },
  cancelShopGoodsRelation: { // 删除商品
    type: 'post',
    path: '/dubrovnik2/goods/v1/cancelShopGoodsRelation'
  },

  // 门店商品
  getShopGoods: { // 门店商品列表
    type: 'post',
    path: '/dubrovnik2/goods/v2/getShopGoods'
  },
  updateShopGoodsStatus: { // 商品上下架
    type: 'post',
    path: '/dubrovnik2/goods/v1/updateShopGoodsStatus'
  },
  updateShopGoodsPrice: { // 商品上下架
    type: 'post',
    path: '/dubrovnik2/goods/v1/updateShopGoodsPrice'
  }
}
