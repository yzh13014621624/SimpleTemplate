/*
 * @description: 权限定义文件
 * @author: yanzihao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: yanzihao
 * @Date: 2019-07-01 14:18:18
 * @LastEditTime: 2019-09-09 17:46:37
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 功能权限 >>>>>>>> */
  'goodsmanagement',
  'role',
  'user'
]

type AuthorityZS = {
  [authority in (typeof AuthorityList)[number]]: RA
}

export default AuthorityZS