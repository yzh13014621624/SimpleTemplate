/*
 * @description: 读取所有接口
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 16:17:40
 * @LastEditTime: 2019-08-08 16:35:02
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const files = require.context('.', true, /\.ts$/)

const modules:any = {}
files.keys().forEach((key:any) => {
  if (key === './index.ts') return
  Object.assign(modules, files(key).default)
})

export default modules
