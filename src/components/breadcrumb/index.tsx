/*
 * @description: 页面面包屑
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-16 11:39:26
 * @LastEditTime: 2019-09-16 16:57:42
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '../index'
import { Breadcrumb } from 'antd'
import './index.less'
import refresh from 'assets/images/app/refresh.png'

const BreadcrumbItem = Breadcrumb.Item

interface BasicBreadCrumbProps {
  activeRoute: any,
  alias: string | undefined,
  refreshCurrentPage: () => void,
  onBackParent: () => void
}

interface BasicBreadCrumbState {
}

export default class BreadCrumb extends RootComponent<BasicBreadCrumbProps, BasicBreadCrumbState> {
  render () {
    const { activeRoute, refreshCurrentPage, alias, onBackParent } = this.props
    
    return (
      <div className="breadcrumb_wrapper">
        <div className="breadcrumb_title">
          <div className='breadcrumb_block'></div>
          <Breadcrumb>
            {activeRoute.parentRoute.level === 2 && <BreadcrumbItem href='javascript:;' onClick={onBackParent}>{activeRoute.parentRoute.title}</BreadcrumbItem>}
            {activeRoute.parentRoute.level === 3 && <BreadcrumbItem href='javascript:;' onClick={onBackParent}>{activeRoute.parentRoute.title}</BreadcrumbItem>}
            <BreadcrumbItem>{activeRoute && activeRoute.title || alias}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="refresh_button" onClick={refreshCurrentPage}>
          <img src={refresh} alt=""/>刷新
        </div>
      </div>
    )
  }
}
