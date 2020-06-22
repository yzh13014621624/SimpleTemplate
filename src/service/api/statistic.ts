/*
 * @description: 报表中心
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-04 15:37:49
 * @LastEditTime: 2020-03-18 17:57:03
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  goodsStatisticsPostList:{ // 报表中心-商品统计-列表
    type: 'post',
    path: '/chamonix2/goods/v1/getGoodsStatistics'
  },
  shopStatisticPostBusinessReceipt: { // 报表中心-营业额统计-营业额总计
    type: 'post',
    path: '/chamonix2/orderWeb/v1/getBusinessReceipt'
  },
  getBusinessReceipt: { // 营业额统计-营业额总计（报表中心）[web]
    type: 'post',
    path: '/chamonix2/orderWeb/v1/getBusinessReceipt'
  },
  getGoodsStatisList: { // 营业额统计-营业额趋势（报表中心）
    type: 'post',
    path: '/chamonix2/orderWeb/v1/getGoodsStatisList'
  },
  postExportBusinessReceipt: { // 营业额统计（营业额总计导出）[web]
    type: 'post',
    path: '/chamonix2/orderWeb/v1/exportBusinessReceipt'
  },
  postExportSalesVolume: { // 营业额统计（门店销售额排名导出）[web]
    type: 'post',
    path: '/chamonix2/orderWeb/v1/exportSalesVolume'
  },
  postExportVolumeTrend: { // 营业额统计（营销额趋势导出）[web]
    type: 'post',
    path: '/chamonix2/orderWeb/v1/exportVolumeTrend'
  },
  postExportGoodsStatistics: {
    type: 'post',
    path: '/chamonix2/goods/v1/exportGoodsStatistics'
  }
}
