/*
 * @description: 销售订单列表
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 10:23:58
 * @LastEditTime: 2020-04-16 18:41:01
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { hot } from 'react-hot-loader'
import { Form, Select, Button, Table, Steps, Popover, ConfigProvider } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { HttpUtil } from 'utils'
import { EnumOrderDetailStatus, EnumDineWay } from '../enumorder'
import { EmptyTable } from 'components/index'
import './index.less'

const { Step } = Steps
interface BasesaleOrderDetailProps extends BaseProps, FormComponentProps {
}

interface SaleOrderDetailState {
  orderId: string
  orderStatus: any
  information: any,
  baseOrderWebInfos: Array<[]>,
  costOrderWebInfos: any,
  shopOrderWebInfos: Array<[]>,
  current: number
}

@hot(module)
class SaleOrderDetail extends RootComponent<BasesaleOrderDetailProps, SaleOrderDetailState> {
  constructor (props: any) {
    super(props)
    this.state = {
      orderId: '',
      orderStatus: 0,
      information: {
        xdTime: '',
        zfTime: '',
        pcTime: '',
        wcTime: '',
        tkdshTime: '',
        ytkTime: '',
        yqxTime: ''
      }, // 所有的信息
      baseOrderWebInfos: [], // 基本信息
      costOrderWebInfos: [], // 费用信息
      shopOrderWebInfos: [], // 门店信息
      current: 0
    }
  }

  componentDidMount = async () => {
    const { orderId, orderStatus } = HttpUtil.parseUrl(window.location.href)
    let current: number = 0
    switch (Number(orderStatus)) {
      case 10: current = 0; break
      case 20:
      case 30: current = 1; break
      case 50: current = 3; break
      case 60:
      case 70:
      case 80:
      case 40: current = 2; break
    }
    await this.setState({
      current,
      orderId,
      orderStatus: Number(orderStatus)
    })
    this.getData()
  }

  // 请求数据
  getData = () => {
    const { orderId } = this.state
    this.axios.request(this.api.getOrderWebInfo, { orderId }).then(({ data }) => {
      this.setState({
        information: data,
        costOrderWebInfos: [data.costOrderWebInfos],
        shopOrderWebInfos: [data.shopOrderWebInfos],
        baseOrderWebInfos: [data.baseOrderWebInfos]
      })
    })
  }

  // 退款的事件
  refundClick = () => {
    const { orderId } = this.state
    this.axios.request(this.api.orderRefund, { id: orderId }).then(({ code }) => {
      if (code === 200) {
        this.$message.success('退款成功')
        this.getData()
      }
    })
  }

  render () {
    const {
      orderStatus, baseOrderWebInfos, costOrderWebInfos, shopOrderWebInfos,
      information: { comGoodsOrderWebInfoList, supGoodsOrderWebInfoList, timeList },
      current, information
    } = this.state
    const {
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { saleorder }, hasAuthority }
      }
    } = this
    const [viewOrder, exportOrder, disposeRefund]: any = hasAuthority(saleorder)
    const isShow = !(comGoodsOrderWebInfoList && comGoodsOrderWebInfoList.length > 0 && costOrderWebInfos.length > 0)
    const footer = (
      <div>
        <span>合计：</span>
        <span className='price'>{!isShow ? `￥${costOrderWebInfos[0].allGoodsCost}` : ''}</span>
      </div>
    )
    const columns1: any = [
      {
        title: '销售订单ID',
        dataIndex: 'orderId',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '会员ID',
        dataIndex: 'userId',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '会员昵称',
        dataIndex: 'nickName',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '联系方式',
        dataIndex: 'contactPhone',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '支付方式',
        dataIndex: 'payWay',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text === 'wxpay' ? '微信' : '未支付'}</span>
        }
      },
      {
        title: '优惠券',
        dataIndex: 'couponName',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '就餐时间',
        dataIndex: 'dineTimeName',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '就餐方式',
        dataIndex: 'dineWay',
        align: 'center',
        render: (text: any) => {
          return <span>{EnumDineWay[text] || '/'}</span>
        }
      }
    ]
    const columns2: any = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '联系方式',
        dataIndex: 'linkmanPhone',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '门店地址',
        dataIndex: 'address',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '营业时间',
        dataIndex: 'businessTime',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      }
    ]
    const columns3: any = [
      {
        title: '门店标准商品ID',
        dataIndex: 'goodsId',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '商品图片',
        dataIndex: 'goodsImg',
        align: 'center',
        render: (text: any) => {
          return <span>{text ? <img src={text} style={{ width: '100px' }} /> : '/'}</span>
        }
      },
      {
        title: '标准商品名称',
        dataIndex: 'title',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '门店标准商品价格',
        dataIndex: 'price',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '购买数量',
        dataIndex: 'goodsAmount',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '小计',
        dataIndex: 'totalPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
        }
      }
    ]
    const columns4: any = [
      {
        title: '门店包材商品ID',
        dataIndex: 'goodsId',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      },
      {
        title: '门店包材商品图片',
        dataIndex: 'goodsAttachImg',
        align: 'center',
        render: (text: any) => {
          return <span>{text ? <img src={text} style={{ width: '100px' }} /> : '/'}</span>
        }
      },
      {
        title: '包材商品名称',
        dataIndex: 'goodsAttachTitle',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text || '/'}</span>
        }
      }
    ]
    const columns5: any = [
      {
        title: '商品合计',
        dataIndex: 'allGoodsCost',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '销售订单总金额',
        dataIndex: 'originalPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span className='pricecolor_red'>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '优惠金额',
        dataIndex: 'couponPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span className='pricecolor_red'>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '应付款金额',
        dataIndex: 'payPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span className='pricecolor_red'>{text ? `￥${text}` : '/'}</span>
        }
      }
    ]
    return (
      <div className='saleorderddetail'>
        <div className='steps'>
          {/* <Steps current={current} progressDot>
            {
              timeList && timeList.map((item: any, i: number) => (
                <Step key={item.status} title={item.status} description={item.time} />
              ))
            }
          </Steps> */}
          {orderStatus < 60
            ? <Steps current={current} progressDot>
              <Step title='买家下单' description={timeList && timeList.xdTime} />
              <Step title='买家支付' description={timeList && timeList.zfTime} />
              <Step title='配餐' description={timeList && timeList.pcTime} />
              <Step title='完成' description={timeList && timeList.wcTime} />
            </Steps>
            : <Steps current={current} progressDot>
              <Step title='买家下单' description={timeList && timeList.xdTime} />
              <Step title='买家支付' description={timeList && (orderStatus !== 60 ? timeList.zfTime : '未支付')} />
              {orderStatus === 70 && <Step title='退款，待审核' description={timeList && timeList.tkdshTime} />}
              {orderStatus === 80 && <Step title='已退款' description={timeList && timeList.ytkTime} />}
              {orderStatus === 60 && <Step title='已取消' description={timeList && timeList.yqxTime} />}
            </Steps>
          }
        </div>
        <div className='orderstatus'>当前订单状态：{EnumOrderDetailStatus[orderStatus]}</div>
        <div className='main'>
          <ConfigProvider renderEmpty={EmptyTable}>
            <Table
              style={{ pointerEvents: 'none' }}
              columns={columns1}
              dataSource={baseOrderWebInfos}
              pagination={false}
              title={() => '基本信息'}
              bordered
            />
          </ConfigProvider>
          <ConfigProvider renderEmpty={EmptyTable}>
            <Table
              columns={columns2}
              dataSource={shopOrderWebInfos}
              bordered
              pagination={false}
              title={() => '门店信息'}
            />
          </ConfigProvider>
          <ConfigProvider renderEmpty={EmptyTable}>
            <Table
              columns={columns3}
              dataSource={comGoodsOrderWebInfoList}
              bordered
              title={() => '门店标准商品信息'}
              footer={() => footer}
              pagination={false}
            />
          </ConfigProvider>
          <ConfigProvider renderEmpty={EmptyTable}>
            <Table
              columns={columns4}
              dataSource={supGoodsOrderWebInfoList}
              bordered
              pagination={false}
              title={() => '门店包材商品信息'}
            />
          </ConfigProvider>
          <ConfigProvider renderEmpty={EmptyTable}>
            <Table
              columns={columns5}
              dataSource={costOrderWebInfos}
              bordered
              pagination={false}
              title={() => '费用信息'}
            />
          </ConfigProvider>
          {
            disposeRefund && orderStatus === 70
              ? <div className='actionbtn'>
                <Button className='refundbtn' onClick={this.refundClick}>退款</Button>
              </div>
              : ''
          }
        </div>
      </div>
    )
  }
}

export default Form.create<BasesaleOrderDetailProps>()(SaleOrderDetail)
