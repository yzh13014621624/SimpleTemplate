/*
 * @description: 所有权限列表
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-05-31 09:19:45
 * @LastEditTime: 2019-08-07 09:45:13
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const files = require.context('.', true, /\.ts$/)
const authorityList: any = {}
const regFileName = /^\.\/(\w+\/)?|\.ts$/g

files.keys().forEach((key: string) => {
  authorityList[key.replace(regFileName, '')] = files(key).default
})

export default authorityList
