/*
 * @description: 类目列表
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-15 10:45:46
 * @LastEditTime: 2019-09-11 23:52:24
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Table, Button } from 'antd'
import { inject, observer } from 'mobx-react'
import './index.less'
import { BaseProps } from 'typings/global'

interface state {
  dataSource:any[]
}

let edit = true 

@inject()
@observer
export default class CategoryList extends RootComponent<BaseProps,state> {
  columns: any = [
    {
      title: '类目ID',
      dataIndex: 'categoryId',
      className: 'table-head',
    },
    {
      title: '类目名称',
      dataIndex: 'name',
      className: 'table-head',
    },
    {
      title: '级别',
      dataIndex: 'level',
      className: 'table-head',
    },
    {
      title: '商品数量',
      dataIndex: 'goodsNumber',
      className: 'table-head',
      render: (dataSource:number) => {
        if(dataSource === 0){
          edit = false
        } else {
          edit = true
        }
        return (
           dataSource === 0 ?<div>0</div>:
           <div className="edit-btn-link">
            <div>
              <span onClick = {this.goodsNumber}>
                {dataSource}
              </span>
            </div>
         </div>
        )
      },
    },
    // {
    //   title: '设置',
    //   dataIndex: 'setUp',
    //   key:'setUp',
    //   render: (record: any) => {
    //     return (
    //       <div className="edit-btn-link">
    //         <div>
    //           <span onClick={this.addSubordinate}>新增下级</span>
    //           <span onClick={this.checkSubordinate}>查看下级</span>
    //         </div>
    //       </div>
    //     );
    //   },
    //  },
     {
      title: '操作',
      dataIndex: 'edit',
      key: 'edit',
      render: (text: any, records: any) => {
        return (
          <div className="edit-btn-link">
            <span onClick={() => this.handlerDeleted(records)}>删除</span>
          </div>
        )
     },
    }
  ]
    constructor(props:any){
    super(props)
    this.state = {
      dataSource:[
        {
          key: '1',
          name: '胡彦斌',
          categoryId:'FL000001',
          level:'一级类目',
          goodsNumber: 0,
        },
        {
          key: '2',
          name: '周杰伦',
          categoryId:'FL000002',
          level:'一级类目',
          goodsNumber: 32,
        },
        {
          key: '3',
          name: '李健',
          categoryId:'FL000003',
          level:'一级类目',
          goodsNumber: 100,
        },
      ]
    }
  }

  /** 
   * 
   * 列表头部 
  */
  headList = () => {
    return <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{lineHeight:'26px'}}>数据列表</div>
                {/* <Button  type="primary" className='but-top'>
                  添加类目
                </Button> */}
           </div>
  }

  // 商品数量
  goodsNumber = () => {
    console.log('商品数量');
  }

  // 添加下级
  addSubordinate = () => {
    console.log('添加下级');
  }

  // 查看下级
  checkSubordinate = () => {
    console.log('查看下级');
  }

  
  // 删除
  handlerDeleted = (records: any) => {
    console.log('删除')
    
  }

  // 编辑
  hanlderEdit = () => {
    console.log('编辑');
  }


  render () {
    const { dataSource }=this.state
    return (
      <div className = 'ant-categorylist'>
        <Table
          rowClassName={() => 'table-row'}
          bordered
          dataSource={dataSource}
          columns={this.columns}
          title={this.headList}
          size='default'
        />
      </div>
    //    <div className='labelmanagement-content'>
    //    <Row className='title' type='flex' justify='space-between'>
    //      <Col >数据列表</Col>
    //      <Col >
    //        <Button  type="primary" htmlType="submit" onClick = { this.titleBtn }>添加标签</Button>
    //      </Col>
    //    </Row>
    //    <TableItem 
    //      rowSelectionFixed
    //      filterKey="id"
    //      rowKey={({ id }) => id}
    //      dataSource = {dataSource}
    //      URL={this.api.postLabelmanagementList}
    //      columns={this.columns}
    //      rowSelection={false}
    //      bordered={true}
    //      scroll={{x: 1320}}
    //    />
    //  </div>
    )
  }
}
