/*
* @description:
              1.审批记录 Table
              2.2019/07/10 优化表格传值方式 --- huxianghe
* @author: maqian, huxianghe
* @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
* @lastEditors: huxianghe
* @Date: 2019-06-25 14:13:33
 * @LastEditTime: 2019-09-04 16:18:17
* @Copyright: Copyright  @  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
*/
import * as React from 'react'
import { Table } from 'antd'
import { RootComponent } from 'components/index'

const columnData: any = [
  { title: '序号', dataIndex: 'index', align: 'center', width: 50, render: (text: string) => (<span>{text || '/'}</span>) },
  { title: '操作人', dataIndex: 'reviewAdminName', width: 80, render: (text: string) => (<span>{text || '/'}</span>) },
  { title: '操作时间', dataIndex: 'reviewTime', width: 80, render: (text: string) => (<span>{text || '/'}</span>) },
  { title: '操作结果', dataIndex: 'reviewStatusName', width: 80, render: (text: string) => (<span>{text || '/'}</span>) },
  { title: '处理意见', dataIndex: 'reviewReason', width: 100, render: (text: string) => (<span>{text || '/'}</span>) }
]
const Each = (list: any[]) => list.forEach((item: any, i: number) => { item.index = (i + 1) })

interface RecordTableProps {
  dataSource: Array<any>
}

interface RecordTableState {
  tableList: Array<any>
}

export default class RecordTable extends RootComponent<RecordTableProps, RecordTableState> {
  constructor (props: RecordTableProps) {
    super(props)
    const { dataSource } = props
    Each(dataSource)
    this.state = {
      tableList: dataSource
    }
  }

  componentWillReceiveProps (props: RecordTableProps) {
    const { dataSource } = props
    Each(dataSource)
    this.setState({ tableList: dataSource })
  }

  render () {
    const { tableList } = this.state
    return (
      <div>
        {
          !!tableList.length &&
          <div id='record-table-page' style={{ paddingTop: 20 }}>
            <Table
              style={{ width: '95%', marginLeft: '40px', border: '1px solid #EBEBEB', borderBottom: 'none' }}
              rowKey={({ index }:any) => index }
              columns={columnData}
              dataSource={tableList}
              pagination={false}
              size='middle' />
          </div>
        }
      </div>
    )
  }
}
