/*
 * @description: 会员管理详情页面
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 11:18:24
 * @LastEditTime: 2020-03-20 19:48:07
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { hot } from 'react-hot-loader'
import { Form, DatePicker, Select, Table } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { HttpUtil } from 'utils'
import { EnumOrderStatus, EnumPayWay, EnumRefundStatus } from '../../saleorder/enumorder'
import moment from 'moment'
import './index.less'

const { Item } = Form
const { Option } = Select
interface BaseMemberDetailProps extends BaseProps, FormComponentProps {
}

interface MemberDetailState {
  userId: any,
  totalMessage: any
}

@hot(module)
class MemberDetail extends RootComponent<BaseMemberDetailProps, MemberDetailState> {
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: any) {
    super(props)
    this.state = {
      userId: '',
      totalMessage: []
    }
  }

  componentDidMount = () => {
    const { userId } = HttpUtil.parseUrl(window.location.href)
    this.axios.request(this.api.getMemberDetail, { userId }).then(({ data }) => {
      this.setState({
        userId,
        totalMessage: [data]
      })
    })
  }

  // 查看订单
  viewOrder = (orderId: string, orderStatus: number, e:any) => {
    console.log(orderId, orderStatus, '123')
    e.preventDefault()
    this.props.history.push(`/sale-management/detail?orderId=${orderId}&&orderStatus=${orderStatus}`)
  }

  // 退款事件
  refund = (orderId: any, e: any) => {
    e.preventDefault()
    this.axios.request(this.api.orderRefund, { id: orderId }).then(({ code }) => {
      if (code === 200) {
        this.tableRef.current!.loadingTableData()
        this.$message.success('退款成功')
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { userId, totalMessage } = this.state
    const { tableRef } = this
    const columnsMemberInformation: any = [
      {
        dataIndex: 'avatarUrl',
        align: 'center',
        render: (text: any, row: any, index: number) => {
          const obj: any = {
            children: <img src={text} style={{ width: '100px' }}/>,
            props: {}
          }
          if (index === 0) obj.props.rowSpan = 5
          if (index === 1) obj.props.rowSpan = 0
          if (index === 2) obj.props.rowSpan = 0
          if (index === 3) obj.props.rowSpan = 0
          if (index === 4) obj.props.colSpan = 0
          return obj
        }
      },
      {
        dataIndex: 'title',
        align: 'center'
      },
      {
        dataIndex: 'concent',
        align: 'center'
      }
    ]
    const columnsTotal: any = [
      {
        title: '消费金额',
        dataIndex: 'orderTotalPrice',
        align: 'center',
        render: (text: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '订单数量',
        dataIndex: 'orderTotalAmount',
        align: 'center',
        render: (text: any) => {
          return <span>{text || '/'}</span>
        }
      }
    ]
    const columnsOrder: any = [
      {
        title: '订单ID',
        dataIndex: 'orderId',
        align: 'center'
      },
      // {
      //   title: '订单编号',
      //   dataIndex: 'orderSn',
      //   align: 'center'
      // },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        align: 'center'
      },
      {
        title: '下单手机号',
        dataIndex: 'contactPhone',
        align: 'center'
      },
      {
        title: '下单门店',
        dataIndex: 'shopName',
        align: 'center'
      },
      {
        title: '订单金额',
        dataIndex: 'payPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
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
        title: '订单状态',
        dataIndex: 'orderStatus',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{EnumOrderStatus[text]}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (text: any, recond: any) => {
          return <a href='javascript;;' onClick={(e) => this.viewOrder(recond.orderId, recond.orderStatus, e)}>查看订单</a>
        }
      }
    ]
    const columnsRefund: any = [
      {
        title: '订单ID',
        dataIndex: 'orderId',
        align: 'center'
      },
      {
        title: '下单时间',
        dataIndex: 'placeOrderTime',
        align: 'center'
      },
      {
        title: '下单手机号',
        dataIndex: 'placeOrderPhone',
        align: 'center'
      },
      {
        title: '下单门店',
        dataIndex: 'shopName',
        align: 'center'
      },
      {
        title: '订单金额',
        dataIndex: 'payPrice',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
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
        title: '订单状态',
        dataIndex: 'status',
        align: 'center',
        render: (text: any, recond: any) => {
          return <span>{EnumRefundStatus[text]}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (text: any, recond: any) => {
          return <div>
            {recond.orderStatus === 70 && <a href='javascript;;' style={{ marginRight: '10px' }} onClick={(e) => this.refund(recond.orderId, e)}>退款</a>}
            <a href='javascript;;' onClick={(e) => this.viewOrder(recond.orderId, recond.orderStatus, e)}>查看订单</a>
          </div>
        }
      }
    ]
    const totalMessages = totalMessage.length > 0 && totalMessage[0]
    const memberinformation = [
      {
        key: '1',
        avatarUrl: `${totalMessages.avatarUrl ? totalMessage[0].avatarUrl : '/'}`,
        title: '会员ID',
        concent: `${totalMessages.userId ? totalMessage[0].userId : '/'}`
      },
      {
        key: '2',
        title: '昵称',
        concent: `${totalMessages.nickName ? totalMessage[0].nickName : '/'}`
      },
      {
        key: '3',
        title: '手机号',
        concent: `${totalMessages.memberPhone ? totalMessage[0].memberPhone : '/'}`
      },
      {
        key: '4',
        title: '注册时间',
        concent: `${totalMessages.authTime ? moment(totalMessage[0].authTime).format('YYYY-MM-DD HH:mm:ss') : '/'}`
      },
      {
        key: '5',
        title: '城市',
        concent: `${totalMessages.memberCity ? totalMessage[0].memberCity : '/'}`
      }
    ]
    return (
      <div className='memberDetail'>
        <Table
          style={{ width: '80%', pointerEvents: 'none' }}
          showHeader={false}
          columns={columnsMemberInformation}
          dataSource={memberinformation}
          size='small'
          pagination={false}
          bordered
          className='memberInformation'
        />
        <div className='main'>
          <Table
            style={{ pointerEvents: 'none' }}
            columns={columnsTotal}
            dataSource={totalMessage}
            pagination={false}
            bordered
            title={() => '统计信息'}
          />
          <div className='tableheader'>
            <div>订单记录</div>
          </div>
          <TableItem
            rowSelectionFixed
            filterKey="index"
            bordered
            rowSelection={false}
            searchParams={{ userId }}
            rowKey={({ index }) => index}
            URL={this.api.getOrderRecordById}
            columns={columnsOrder as any}
          />
          <div className='tableheader'>
            <div>退款记录</div>
          </div>
          <TableItem
            ref={tableRef}
            rowSelectionFixed
            filterKey="index"
            bordered
            rowSelection={false}
            searchParams={{ userId }}
            rowKey={({ index }) => index}
            URL={this.api.getRefundList}
            columns={columnsRefund as any}
          />
        </div>
      </div>
    )
  }
}

export default Form.create<BaseMemberDetailProps>()(MemberDetail)
