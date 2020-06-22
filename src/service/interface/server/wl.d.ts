/*
 * @description:
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-29 10:33:37
 * @LastEditTime: 2020-04-10 15:26:10
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 客户管理 >>>>>>>> */
  /* <<<<<<<< 供应商管理 >>>>> */
  'storeCustomerList', 'storeInsetInfo', 'storeCustomerInfo', 'storeEditInfo', 'storeSupplierInfo', 'storeInsertSupplier', 'storeSupplierList', 'storeEditSupplier',
  /* <<<<<<<< 门店列表 >>>>>>>> */
  /* <<<<<<<< 门店商品分类 >>>>> */
  /* <<<<<<<< 添加门店 >>>>>>> */
  'storeFindShopList', 'storeFindShopByShopId', 'storeCateList', 'storeCateListInfo', 'storeUpdateShop', 'storeUpdateShopStatus', 'storeAddShop', 'storeGetShopTotalByStatus', 'storeShopBindPrint'
]

type ServerWL = {
  [api in (typeof ServerList)[number]]: Api
}

export default ServerWL
