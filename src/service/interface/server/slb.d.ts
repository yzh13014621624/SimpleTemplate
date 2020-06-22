/*
 * @description: songliubiao 接口定义文件
 * @author: songliubiao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: songliubiao
 * @Date: 2019-07-01 11:26:10
 * @LastEditTime: 2020-03-25 15:34:06
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 采购管理模块 >>>>>>>> */
    'ApifindPurchaseOrderList','ApifindPurchaseOrderInfo', 'ApiGetShopGoods', 'ApiUpdatePurchaseOrderStatust', 'ApiUpdatePurchaseOrderStatus',
    'ApiAddPurchaseOrder', 'ApiDeletePurchaseOrder','ApiGetPurchaseOrderCount','ApiGetGoodsType','ApiSelectShopPc','ApiExportTemplate','ApiExportData',
    'ApiImportData',
  /* <<<<<<<< 采购管理模块 >>>>>>>> */
/* <<<<<<<< 运营管理模块 >>>>>>>> */
  'ApicouponList', 'ApicouponStatus', 'ApicouponaddOrEdit', 'ApicouponDetail', 'ApiccountList', 'ApiccountListExport'
  /* <<<<<<<< 运营管理模块 >>>>>>>> */
]

type ServerSLB = {
  [api in (typeof ServerList)[number]]: Api
}

export default ServerSLB
