/*
 * @description: 采购订单详情
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-08-27 11:15:40
 * @LastEditTime: 2019-09-19 15:39:00
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import './index.styl'
import { RootComponent } from 'components'
import { hot } from 'react-hot-loader'
import { BaseProps } from 'typings/global'
import { Form, Input, Popover, Table, Col, Steps, Button, Radio, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { HttpUtil } from 'utils'
const { Step } = Steps
interface PurchaseDetailsState {
  purchOrderInfo: any
  shopInfo: any
  proceInfo: any
}
const shopColumns = [
  {
    title: '采购订单ID',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '采购订单类型',
    dataIndex: 'sendType',
    align: 'center',
    render: (text: number) => {
      return (
        <span>
          {(text === 0 && '商户采购') ||
            (text === 1 && '总部配送')
          }
        </span>
      )
    }
  },
  {
    title: '门店ID',
    dataIndex: 'shopId',
    align: 'center'
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    align: 'center'
  },
  {
    title: '门店名称',
    dataIndex: 'shopName',
    align: 'center'
  },
  {
    title: '联系方式',
    dataIndex: 'linkmanPhone',
    align: 'center'
  },
  {
    title: '门店地址',
    dataIndex: 'shopAddr',
    align: 'center'
  }
]
const goodsColumns = [
  {
    title: '门店商品ID',
    dataIndex: 'goodsId',
    align: 'center'
  },
  {
    title: '商品名称',
    dataIndex: 'goodsTitle',
    align: 'center'
  },
  {
    title: '商品类型',
    dataIndex: 'goodsType',
    align: 'center'

  },
  {
    title: '商品采购价',
    dataIndex: 'purchasePrice',
    align: 'center'
  },
  {
    title: '采购数量',
    dataIndex: 'goodsNum',
    align: 'center'
  }
]
const priceColumns = [
  {
    title: '商品数量',
    dataIndex: 'goodsTotalNumber',
    align: 'center'
  },
  {
    title: '合计金额',
    dataIndex: 'totalPriceStr',
    align: 'center',
    render: (text: any) => {
      return (
        <span>
          ￥{text}
        </span>
      )
    }
  }
]
interface PurchaseDetailsProps extends BaseProps, FormComponentProps { }
@hot(module)
class PurchaseDetails extends RootComponent<PurchaseDetailsProps, PurchaseDetailsState> {
  constructor (props: PurchaseDetailsProps) {
    super(props)
    this.state = {
      purchOrderInfo: {}, // 采购订单详情
      shopInfo: [], // 商户信息
      proceInfo: [] // 费用信息
    }
  }

  componentDidMount = () => {
    const { shopId, purchOrderId } = HttpUtil.parseUrl(window.location.href)
    this.axios.request(this.api.ApifindPurchaseOrderInfo, { shopId, purchOrderId }).then(({ data }) => {
      const shopInfo = [{
        index: 1,
        id: data.orderSn,
        linkman: data.linkman,
        shopName: data.shopName,
        linkmanPhone: data.linkmanPhone,
        shopAddr: data.shopAddr,
        sendType: data.sendType,
        shopId: data.shopId
      }]
      const proceInfo = [{
        index: 1,
        totalPriceStr: data.totalPriceStr,
        goodsTotalNumber: data.goodsTotalNumber,
        goodsType: data.goodsType,
        goodsId: data.goodsId
      }]
      if (data.goodsList.length > 0) {
        data.goodsList.map((item: any, index: number) => {
          item.shopSn = data.shopSn
          item.index = index + 1
          return item
        })
      }
      this.setState({
        purchOrderInfo: data,
        shopInfo,
        proceInfo
      })
    })
  }

  // 取消/配送订单
  handleUpdateOrder = (e: any, item: any, status: number) => {
    const { shopId, purchOrderId } = HttpUtil.parseUrl(window.location.href)
    e.stopPropagation()
    this.axios.request(this.api.ApiUpdatePurchaseOrderStatus, { purchOrderId, shopId, status }).then(({ data }) => {
      this.$message.success('操作成功')
      this.props.history.push('/purchase-management/purchaseList')
    })
  }

  render () {
    const { purchOrderInfo, shopInfo, proceInfo } = this.state
    return (
      <div id='PurchaseDetails'>
        <div className='PurchaseDetails-head'>
          <Steps current={purchOrderInfo.orderStatus / 10} progressDot>
            <Step title="提交订单" description={purchOrderInfo.createTime || ''} />
            <Step title="待配送" description={purchOrderInfo.createTime || ''} />
            {purchOrderInfo.orderStatus != 40 &&
              <Step title="配送中" description={purchOrderInfo.realitySendTime || ''} />
            }
            {purchOrderInfo.orderStatus != 40 &&
              <Step title="已完成" description={purchOrderInfo.confirmTime || ''} />
            }

            {purchOrderInfo.orderStatus === 40 &&
              <Step title="已取消" description={purchOrderInfo.cancelTime || ''} />
            }
          </Steps>
        </div>
        <div className='PurchaseDetails-content'>
          <div className='PurchaseDetails-content-title'>
            当前采购订单状态： {
              (purchOrderInfo.orderStatus === 10 && '待配送') ||
              (purchOrderInfo.orderStatus === 20 && '配送中') ||
              (purchOrderInfo.orderStatus === 30 && '已签收') ||
              (purchOrderInfo.orderStatus === 40 && '已取消')
            }
          </div>
          <div className='PurchaseDetails-content-box'>
            <div className='PurchaseDetails-content-box-item'>
              <div className='desc'>采购门店信息</div>
              <Table
                dataSource={shopInfo}
                columns={shopColumns as any}
                rowKey={({ index }: any) => index}
                bordered
                pagination={false}
              />
            </div>
            <div className='PurchaseDetails-content-box-item'>
              <div className='desc'>采购商品信息</div>
              <Table
                dataSource={purchOrderInfo.goodsList}
                columns={goodsColumns as any}
                bordered
                rowKey={({ index }: any) => index}
                pagination={false}
              />
            </div>
            <div className='PurchaseDetails-content-box-item'>
              <div className='desc'>采购商品费用信息</div>
              <Table
                dataSource={proceInfo}
                columns={priceColumns as any}
                rowKey={({ index }: any) => index}
                bordered
                pagination={false}
              />
            </div>
            {purchOrderInfo.orderStatus === 10 &&
              <div className='PurchaseDetails-content-box-btn'>
                <Button className='left' onClick={(e) => this.handleUpdateOrder(e, purchOrderInfo, 1)}>取消采购订单</Button>
                <Button type='primary' onClick={(e) => this.handleUpdateOrder(e, purchOrderInfo, 2)}>配送订单</Button>
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}
export default Form.create<PurchaseDetailsProps>()(PurchaseDetails)