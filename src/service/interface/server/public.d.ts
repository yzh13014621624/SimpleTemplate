/*
 * @description: 公共接口
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-07-01 11:19:39
 * @LastEditTime: 2019-09-04 14:36:08
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const PublicList: [
  'publicLogin', 'publibGetVerifyCode', 'publicRetrievePassword', 'publicChangeUserPassword', 'publicGetSt'
]

type ServerPublic = {
  [api in (typeof PublicList)[number]]: Api
}

export default ServerPublic
