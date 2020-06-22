/*
 * @description: 登录相关接口，保存凭证，权限等
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-05-31 09:19:45
 * @LastEditTime: 2020-03-18 17:51:32
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  publicLogin: {
    path: '/stallone/auth/web/login/zc'
  },
  publibGetVerifyCode: { // 获取验证码
    type: 'get',
    path: '/stallone/sms/sendCode/web/zc'
  },
  publicRetrievePassword: { // 找回密码
    path: '/stallone/auth/web/retrievePassword/zc'
  },
  publicChangeUserPassword: { // 修改密码
    path: '/stallone/user/changeUserPassword/zc'
  },
  publicGetSt: { // 获取 ST
    type: 'get',
    path: '/dubrovnik2/common/V1/getAliBaBaCopyright'
  }
}
