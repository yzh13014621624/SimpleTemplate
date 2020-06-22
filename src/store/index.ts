/*
 * @description: 导出所有状态
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 17:20:24
 * @LastEditTime: 2019-08-27 15:49:35
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { MobxGlobal  } from './subStore/mobxGlobal'
import { MobxTabs } from './subStore/mobxTabs'

const files = require.context('.', true, /\.ts$/)
const store: any = {} 
const regFileName = /^\.\/(\w+\/)?|\.ts$/g

files.keys().forEach((key: string) => {
  store[key.replace(regFileName, '')] = files(key).default
})

export {
  MobxGlobal,
  MobxTabs
}

export default store
