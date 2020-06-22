/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 模态框
 * @copyright Copyright © 2019 Shanghai Shangjia Logistics Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '../index'
import { Layout, Row, Col } from 'antd'
import './index.less'

interface BasicHeaderProps {
  title: string | any // 顶部的提示
  extraButton?: string | any // 侧边额外按钮
  cancelPadding?: boolean,
  className?: string,
  cancelBlock?: boolean
}

interface BasicModalState {
}

export default class BasicModal extends RootComponent<BasicHeaderProps, BasicModalState> {
  render () {
    const { children, title, extraButton, cancelPadding, className, cancelBlock } = this.props
    return (
      <div className={`search-container ${className ? className : ''}`}>
        <Row className='search-header' justify='space-between' type='flex' align='middle'>
          <Col className='header-left'>
            {
              cancelBlock ?
              ''
              :
              <span className='block'></span>
            }
            <span>{title}</span>
          </Col>
          <Col>{extraButton}</Col>
        </Row>
        <div className={cancelPadding ? 'search-body' : 'search-body padding'}>
          {children}
        </div>
      </div>
    )
  }
}
