/*
 * @description: 
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-29 17:44:00
 * @LastEditTime: 2019-09-19 14:46:10
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
enum EnumOrderStatus {
  全部订单 = 0,
  待支付 = 10,
  待签到 = 20,
  待配餐 = 30,
  已配餐 = 40,
  已完成 = 50,
  已取消 = 60,
  待审核 = 70,
  已退款 = 80
}

enum EnumRefundStatus {
  待审核 = 1,
  已退款 = 2
}

enum EnumOrderDetailStatus {
  全部订单 = 0,
  待支付 = 10,
  待签到 = 20,
  待配餐 = 30,
  已配餐 = 40,
  已完成 = 50,
  已取消 = 60,
  '已取消，未退款' = 70,
  '已取消，已退款' = 80
}

enum EnumDineWay {
  堂食 = 10,
  外带 = 20
}

enum EnumPayWay {
  微信 = 'wxpay'
}

export {
  EnumOrderStatus,
  EnumRefundStatus,
  EnumOrderDetailStatus,
  EnumDineWay,
  EnumPayWay
}
