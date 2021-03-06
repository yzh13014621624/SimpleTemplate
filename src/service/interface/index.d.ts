/*
 * @description: 权限和接口类型定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @LastEditTime: 2019-09-09 14:56:25
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

// 后台接口
import ServerPublic from './server/public'
import ServerHXH from './server/hxh'
import ServerSLB from './server/slb'
import ServerYZH from './server/yzh'
import ServerQY from './server/qy'
import ServerZS from './server/zs'
import ServerWL from './server/wl'

// 权限接口
import AuthorityPublic from './authority/public'
import AuthorityHXH from './authority/hxh'
import AuthoritySLB from './authority/slb'
import AuthorityYZH from './authority/yzh'
import AuthorityWL from './authority/wl'
import AuthorityQY from './authority/qy'
import AuthorityZS from './authority/zs'

export interface ServerList extends ServerPublic, ServerHXH, ServerYZH, ServerSLB, ServerQY, ServerZS, ServerWL {}
export interface AuthorityList extends AuthorityPublic, AuthorityHXH, AuthorityYZH,AuthorityWL,AuthorityQY,AuthoritySLB, AuthorityZS {}
