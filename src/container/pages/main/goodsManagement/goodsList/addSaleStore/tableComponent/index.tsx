import * as React from 'react'
import { TableItem } from 'components/index'
import { RootComponent } from 'components'
import './index.less'

interface TableProps {
  getSeletedRow: (selectedRowKeys: any, selectRow: any) => void,
  params: object,
  onAddStore: Function
}

export default class TableComponent extends RootComponent<TableProps> {
  onAddStore = (item: any) => {
    const { onAddStore } = this.props
    onAddStore(item)
  }
  render() {
    const columns = [
      {
        title: '门店ID',
        dataIndex: 'shopId',
      },
      {
        title: '门店LOGO',
        dataIndex: 'shopLogo',
        render: (value: any) => {
          return (
            <img className='table-goodsimg' src={value} alt='' />
          )
        }
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
      },
      {
        title: '门店类型',
        dataIndex: 'shopType',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (value: any, item: any) => {
          return (
            <a href='javacript:void(0);' onClick={() => this.onAddStore(item)}>添加</a>
          )
        }
      }
    ]

    const { getSeletedRow, params } = this.props

    return (
      <TableItem
        rowKey='index'
        columns={columns as any}
        URL={{path: '/dubrovnik2/goods/v1/insertShopGoodsView'}}
        rowSelection={true}
        bordered={true}
        scroll={{x: 1320}}
        searchParams={params}
        getSelectedRow={getSeletedRow}
        onRow={false}
      />
    )
  }
}