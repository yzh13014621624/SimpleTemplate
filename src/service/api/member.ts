/*
 * @description: 会员接口集合
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-30 15:28:54
 * @LastEditTime: 2020-03-20 19:42:50
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  getMemberDetail: { // 会员详情
    type: 'post',
    path: '/dubrovnik2/users/v1/getMemberDetail'
  },
  getMemberList: { // 会员列表
    type: 'post',
    path: '/dubrovnik2/users/v1/getMemberList'
  },
  getRefundList: { // 用户退款记录
    type: 'post',
    path: 'chamonix2/orderWeb/v1/getRefundList'
  },
  getOrderRecordById: { // 根据userId获取订单记录
    type: 'post',
    path: '/chamonix2/orderWeb/v1/getOrderRecordById'
  },
  getExportMemberList: { // 会员列表导出(仅时间筛选)
    type: 'post',
    path: '/dubrovnik2/users/v1/getExportMemberList'
  },
  getExportMemberStatistics: { // 会员统计信息导出（按时间筛选）
    type: 'post',
    path: '/dubrovnik2/users/v1/getExportMemberStatistics'
  }
}
