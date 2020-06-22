/*
 * @description: 接口定义文件
 * @author: yanzihao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: yanzihao
 * @Date: 2019-07-01 13:52:14
 * @LastEditTime: 2019-09-11 22:01:15
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 销售单 >>>>>>>> */
  'queryOrderWebList', 'getOrderWebInfo', 'orderRefund', 'getOrderNumByStatus', 'exportOrderWebInfo',
  /* <<<<<<<< 会员 >>>>>>>> */
  'getMemberDetail', 'getMemberList', 'getRefundList', 'getOrderRecordById',
  /* <<<<<<<< 会员统计 >>>>>>>> */
  'getMemberStatisticsByTime', 'getMemberListByTime', 'getExportMemberList', 'getExportMemberStatistics',
    /* <<<<<<<< 营业额统计统计 >>>>>>>> */
    'getBusinessReceipt', 'getGoodsStatisList'
]

type ServerYZH = {
  [api in (typeof ServerList)[number]]: Api
}

export default ServerYZH
