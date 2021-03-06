/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 自定义 全局的 空当显示为 空时
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import empty from 'assets/images/empty.png'
import './index.less'

export const customizeRenderEmpty = () => {
  return (
    <div className="empty-content" >
      {/* <img src={zw}></img> */}
      <p>暂无数据</p>
    </div>
  )
}

export const EmptyTable = (props: any) => {
  return (
    <div className="empty-content" style={{ padding: '0.5rem 0' }}>
      <img src={empty} style={{ paddingBottom: 10 }}></img>
      <p>{props.tips || '暂无数据'}</p>
    </div>
  )
}
export const ReportTable = (props: any) => {
  return (
    <div className="empty-content" style={{ padding: '0.5rem 0' }}>
      {/* <img src={zw}></img> */}
      <p>无搜索结果，换一个关键词试试~</p>
    </div>
  )
}
