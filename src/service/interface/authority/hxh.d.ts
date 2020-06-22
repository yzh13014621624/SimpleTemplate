/*
 * @description: huxianghe 权限定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-29 15:50:37
 * @LastEditTime: 2019-09-09 14:28:04
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 首页模块 >>>>>>>> */
  'home',
  /* <<<<<<<< 首页模块 >>>>>>>> */
]

type AuthorityHXH = {
  [authority in (typeof AuthorityList)[number]]: RA
}

export default AuthorityHXH
