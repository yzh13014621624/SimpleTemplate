/*
 * @description: huxianghe 接口定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-29 15:50:00
 * @LastEditTime: 2019-07-19 16:03:58
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 系统首页 >>>>>>>> */
  'homeGetSystemHomeInfo'
  /* <<<<<<<< 系统首页 >>>>>>>> */
]

type ServerHXH = {
  [api in (typeof ServerList)[number]]: Api
}

export default ServerHXH
