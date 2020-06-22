/*
 * @description:
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-23 17:54:26
 * @LastEditTime: 2020-04-10 17:17:40
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  storeCustomerList: {
    // 客户信息列表
    type: 'post',
    path: '/dubrovnik2/shopCustomer/v1/queryCustomerList'
  },
  storeInsetInfo: {
    // 添加客户信息
    type: 'post',
    path: '/dubrovnik2/shopCustomer/v1/insertCustomerInfo'
  },
  storeCustomerInfo: {
    // GET 客户信息详情
    type: 'get',
    path: '/dubrovnik2/shopCustomer/v1/getCustomerInfo'
  },
  storeEditInfo: {
    // 编辑客户信息
    type: 'post',
    path: '/dubrovnik2/shopCustomer/v1/updateCustomerInfo'
  },
  storeSupplierInfo: {
    // GET 供应商信息详情
    type: 'get',
    path: '/dubrovnik2/shopSupplier/v1/getSupplierInfo'
  },
  storeInsertSupplier: {
    // 添加供应商信息
    type: 'post',
    path: '/dubrovnik2/shopSupplier/v1/insertSupplierInfo'
  },
  storeSupplierList: {
    // 供应商信息列表
    type: 'post',
    path: '/dubrovnik2/shopSupplier/v1/querySupplierList'
  },
  storeEditSupplier: {
    // 编辑供应商信息
    type: 'post',
    path: '/dubrovnik2/shopSupplier/v1/updateSupplierInfo'
  },
  storeFindShopList: {
    // 门店商品列表
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/findShopList'
  },
  storeFindShopByShopId: {
    // 门店商品详情
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/findShopByShopId'
  },
  storeUpdateShop: {
    // 编辑商户信息
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/updateShopByShopId'
  },
  storeUpdateShopStatus: {
    // 修改商户状态
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/updateShopStatus'
  },
  storeGetShopTotalByStatus: {
    // 获取各状态下商户数量
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/getShopTotalByStatus'
  },
  storeCateList: {
    // 门店商品分类列表
    type: 'post',
    path: '/dubrovnik2/shopCates/v1/shopGoodsCateList'
  },
  storeCateListInfo: {
    // 门店商品分类列表详情
    type: 'post',
    path: '/dubrovnik2/shopCates/v1/shopGoodsCateGoodsList'
  },
  storeAddShop: {
    // 添加门店
    type: 'post',
    path: '/dubrovnik2/shop/v1/pc/addShop'
  },
  storeShopBindPrint: {
    // 配置/解除打印机
    type: 'post',
    path: '/dubrovnik2/shop/v2/pc/shopBindPrint'
  }
}
