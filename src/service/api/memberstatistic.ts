/*
 * @description: 会员统计接口
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-04 15:26:35
 * @LastEditTime: 2020-03-18 17:55:25
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  getMemberListByTime: { // 会员列表(仅时间筛选)
    type: 'post',
    path: '/dubrovnik2/users/v1/getMemberListByTime'
  },
  getMemberStatisticsByTime: { // 会员统计信息（按时间筛选）
    type: 'post',
    path: '/dubrovnik2/users/v1/getMemberStatisticsByTime'
  }
}
