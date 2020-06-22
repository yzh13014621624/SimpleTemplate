/*
 * @description: 版本组件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-05 18:41:26
 * @LastEditTime: 2020-06-09 15:46:55
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import './index.styl'

interface VersionProps {
  color: '#fff' | '#c0c0c0'
}

export default class Version extends RootComponent<VersionProps> {
  render () {
    const { color = '#c0c0c0' } = this.props
    const ambient = () => {
      switch (process.env.MODE) {
        case 'dev':
          return '开发'
        case 'test':
          return '测试'
        case 'pre':
          return '预发'
        default:
          return ''
      }
    }
    const tips = `${ambient()} version: ${process.env.version}  build:${process.env.build}`
    return <div className={`cus-version-content`} style={{ color }}>{tips}</div>
  }
}
