/*
 * @description: 基于 react-loadable 封装的动态导入组件方法
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 17:23:14
 * @LastEditTime: 2019-08-15 13:57:06
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from 'react-loadable'
import { Loading } from 'components'
import { BaseProps } from 'typings/global'

export default (loader: () => Promise<React.ComponentType<BaseProps> | { default: React.ComponentType<BaseProps> | any}>) => {
  return Loadable({
    loader,
    loading: Loading,
    delay: 10000
  })
}
