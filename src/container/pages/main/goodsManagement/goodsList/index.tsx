/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-16 14:27:32
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Divider } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import ListComponent from './listComponet'
import './index.less'

import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps, FormComponentProps{}

interface GoodsState {
  condition: any
}

const CONDITIONS = {
  customerId: '',
  goodsTitleOrId: undefined,
  goodsType: '',
  supplierId: ''
}

@hot(module)
class Goods extends RootComponent<FormProps, GoodsState> {
  constructor (props: any) {
    super(props)
    this.state = {
      condition: {
        ...CONDITIONS
      }
    }
  }

  componentDidMount () {

  }

  /** 页面事件 */
  onDelate = (id: any) => {
    const { condition } = this.state
    this.axios.request(this.api.deleteGoods, { id: id }, false).then(({ code }) => {
      if (code && code === 200) {
        this.$message.success('删除成功')
        this.setState({
          condition: condition
        })
      }
    })
  }

  /** 子组件事件 */
  childChangeCondition = (condi: object) => {
    this.setState({
      condition: condi
    })
  }

  render () {
    const {
      props: {
        mobxGlobal: { authorityList: { goodsmanagement }, hasAuthority }
      },
      state: {
        condition
      }
    } = this
    const [pAddGoods, pEditGoods, pDetail, pAddStore, ...rest]:any = hasAuthority(goodsmanagement)
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'goodsId',
        align: 'center'
      },
      {
        title: '商品图片',
        dataIndex: 'imagePath',
        align: 'center',
        render: (value: any) => {
          return (
            <img className='table-goodsimg' src={value} alt='' />
          )
        }
      },
      {
        title: '商品名称',
        dataIndex: 'title',
        align: 'center'
      },
      {
        title: '商品类型',
        dataIndex: 'goodsType',
        align: 'center'
      },
      {
        title: '所属客户',
        dataIndex: 'customer',
        align: 'center'
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        align: 'center'
      },
      {
        title: '商品售价',
        dataIndex: 'price',
        align: 'center',
        render: (value: any) => {
          return <div>￥{value}</div>
        }
      },
      {
        title: '商品采购价',
        dataIndex: 'purchasePrice',
        align: 'center',
        render: (value: any) => {
          return <div>￥{value}</div>
        }
      },
      {
        title: '销售门店',
        dataIndex: 'shopNum',
        align: 'center',
        render: (value: any, item: any) => {
          return (
            <>
              <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/goods-management/store-list/index?id=${item.goodsId}`) }}>{value}</a>
            </>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pDetail &&
                <>
                  <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/goods-management/good-detail/index?id=${item.goodsId}`) }}>查看</a>
                  <Divider type='vertical' />
                </>
              }
              <a href='javacript:void(0);' onClick={() => this.onDelate(item.goodsId)}>删除</a>
              {
                item.goodsType === '标准商品' && pAddStore &&
                <>
                  <Divider type='vertical' />
                  <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/goods-management/sales-store/index?id=${item.goodsId}&&name=${item.title}`) }}>新增销售门店</a>
                </>
              }
            </>
          )
        }
      }
    ]

    return (
      <React.Fragment>
        <ListComponent
          onChangeParams={this.childChangeCondition}
          parentState={condition}
        />
        {/* <SearchHeader title='数据列表' cancelPadding={true} extraButton={<Button type='primary' onClick={this.onSearch}>添加商品</Button>}> // 第一期不做添加商品功能 */}
        <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true}>
          <TableItem
            rowKey='goodsId'
            columns={columns as any}
            URL={{ path: '/dubrovnik2/goods/v1/getGoodsList' }}
            rowSelection={false}
            bordered={true}
            scroll={{ x: 1320 }}
            searchParams={condition}
          />
        </SearchHeader>
      </React.Fragment>
    )
  }
}

export default Form.create<FormProps>()(Goods)
