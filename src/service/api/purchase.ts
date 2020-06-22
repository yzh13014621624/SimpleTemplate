/*
 * @description: 采购管理
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-08-26 17:39:51
 * @LastEditTime: 2020-04-07 17:53:09
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  ApifindPurchaseOrderList: { // 采购订单列表
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/findPurchaseOrderList'
  },
  ApifindPurchaseOrderInfo: { // 采购订单详情
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/findPurchaseOrderById'
  },
  ApiGetShopGoods: { // 商品列表
    type: 'post',
    path: '/dubrovnik2/goods/v2/getShopGoods'
  },
  ApiUpdatePurchaseOrderStatus: { // 修改采购订单
    type: 'post',
    path: '/chamonix2/purchase/v1/b/updatePurchaseOrderStatus'
  },
  ApiAddPurchaseOrder: { // 添加采购订单
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/addPurchaseOrder'
  },
  ApiDeletePurchaseOrder: { // 删除采购订单
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/deletePurchaseOrderById'
  },
  ApiGetPurchaseOrderCount: { // 查询各种状态下订单数量
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/getPurchaseOrderCount'
  },
  ApiGetGoodsType: { // 查询各种状态下订单数量
    type: 'get',
    path: '/dubrovnik2/goods/v1/getGoodsType'
  },
  ApiSelectShopPc: { // 查询门店列表
    type: 'get',
    path: '/dubrovnik2/shop/v1/pc/selectShopPc'
  },
  ApiExportTemplate: { // 下载模板采购订单
    type: 'get',
    path: '/chamonix2/purchase/v1/pc/exportTemplate'
  },
  ApiExportData: { // 导出采购订单
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/exportData'
  },
  ApiImportData: { // 导入采购订单
    type: 'post',
    path: '/chamonix2/purchase/v1/pc/importData'
  }
}
