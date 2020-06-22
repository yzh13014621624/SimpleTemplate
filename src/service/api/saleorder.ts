/*
 * @description: 销售单接口集合
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-28 19:48:11
 * @LastEditTime: 2020-04-16 17:30:54
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  queryOrderWebList: { // 销售订单列表
    type: 'post',
    path: '/chamonix2/orderWeb/v1/queryOrderWebList'
  },
  getOrderWebInfo: { // 销售订单详情
    type: 'post',
    path: '/chamonix2/orderWeb/v2/getOrderWebInfo'
  },
  orderRefund: { // 销售订单退款
    type: 'get',
    path: '/chamonix2/orderWeb/v1/orderRefund'
  },
  getOrderNumByStatus: { // 列表-根据状态获取订单数
    type: 'get',
    path: '/chamonix2/orderWeb/v1/getOrderNumByStatus'
  },
  exportOrderWebInfo: { // 列表-销售订单导出
    type: 'post',
    path: '/chamonix2/orderWeb/v1/exportOrderWebInfo'
  }
}
