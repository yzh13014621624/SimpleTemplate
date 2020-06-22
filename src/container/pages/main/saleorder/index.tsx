/*
 * @description: 销售订单列表
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 10:23:58
 * @LastEditTime: 2019-09-16 22:13:56
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem, BaseDowload } from 'components'
import { hot } from 'react-hot-loader'
import { Form, DatePicker, Select, Input, Button, Row, Col, Table, Switch, Modal } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { EnumOrderStatus } from './enumorder'
import moment from 'moment'
import './index.less'
import { async } from 'q'

const { Item } = Form
const { Option } = Select
const { RangePicker } = DatePicker
interface BasesaleOrderProps extends BaseProps, FormComponentProps {
}

interface SaleOrderState {
  visible: boolean,
  dataSource: any,
  searchParams: any,
  btnlist: any,
  isRequestData: boolean,
  exportParams: any
}

@hot(module)
class SaleOrder extends RootComponent<BasesaleOrderProps, SaleOrderState> {
  tableRef = React.createRef<TableItem<any>>()
  baseDowloadRef = React.createRef<BaseDowload>()
  constructor (props: any) {
    super(props)
    this.state = {
      visible: false,
      dataSource: [], // tab数据来源,
      btnlist: [], // 按钮集合
      searchParams: {},
      isRequestData: true,
      exportParams: {}
    }
  }

  componentDidMount = () => {
    this.axios.request(this.api.getOrderNumByStatus, {}).then(({ data }) => {
      this.setState({ btnlist: data })
    })
  }

  // 查询结果事件
  searchData = (orderStatus?: any) => {
    const { orderId, nickName, createTime, shopName } = this.props.form.getFieldsValue()
    const startTime = createTime && createTime.length > 0 ? moment(createTime[0]).format('YYYY-MM-DD') : undefined
    const endTime = createTime && createTime.length > 0 ? moment(createTime[1]).format('YYYY-MM-DD') : undefined
    !orderStatus && (orderStatus = undefined)
    // const searchParams = (typeof orderStatus === 'number') ? Object.assign(getFieldsValue, { startTime, endTime }, { orderStatus }) : Object.assign(getFieldsValue, { startTime, endTime })
    const searchParams = {
      orderStatus,
      orderId,
      nickName,
      startTime,
      endTime,
      shopName
    }
    setTimeout(() => {
      this.setState({
        isRequestData: true,
        searchParams
      })
    }, 300)
  }

  // 详情
  goDetail = (orderId: any, orderStatus: number, e: any) => {
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

  // 导出订单事件
  importOrder = () => {
    this.setState({ visible: true })
  }

  // 导出数据按钮
  importBtn = () => {
    console.log('你点击了导出数据按钮')
    alert('你点击了导出数据按钮，该功能暂时没写')
  }

  // 模态框返回
  handleCancel = () => {
    this.setState({ visible: false })
  }

  // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
  }

  // 导出成功
  handleHide = () => {
    this.setState({ visible: false })
  }

  // 点击导出
  exportOrderClick = async (e: any) => {
    e.stopPropagation()
    const { orderIds, nickNames, createTimes, shopNames } = this.props.form.getFieldsValue()
    const startTime = createTimes && moment(createTimes[0]).format('YYYY-MM-DD')
    const endTime = createTimes && moment(createTimes[1]).format('YYYY-MM-DD')
    await this.setState({
      exportParams: {
        orderId: orderIds,
        nickName: nickNames,
        startTime,
        endTime,
        shopName: shopNames
      }
    })
    this.baseDowloadRef.current!.exportData()
  }

  render () {
    const {
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { saleorder }, hasAuthority }
      }
    } = this
    const formcol = { xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }
    const [viewOrder, exportOrder, disposeRefund]:any = hasAuthority(saleorder)
    const { visible, dataSource, searchParams, btnlist, isRequestData, exportParams } = this.state
    const { tableRef } = this
    const columns = [
      {
        title: '销售订单ID',
        dataIndex: 'orderId',
        className: 'col_all'
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      },
      {
        title: '会员昵称',
        dataIndex: 'nickName',
        className: 'col_all'
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        className: 'col_all'
      },
      {
        title: '销售订单金额',
        dataIndex: 'payPrice',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{text ? `￥${text}` : '/'}</span>
        }
      },
      {
        title: '支付方式',
        dataIndex: 'payWay',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{text === 'wxpay' ? '微信' : '未支付'}</span>
        }
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{EnumOrderStatus[text]}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <div>
            {recond.orderStatus === 70 && disposeRefund && <a href='javascript;;' style={{ marginRight: '10px' }} onClick={(e) => this.refund(recond.orderId, e)}>退款</a>}
            {viewOrder && <a href='javascript;;' onClick={(e) => this.goDetail(recond.orderId, recond.orderStatus, e)}>查看订单</a>}
          </div>
        }
      }
    ]
    const title = (
      <div className='tabheader'>
        <span>数据列表</span>
        {exportOrder && <Button onClick={this.importOrder}>导出订单</Button>}
      </div>
    )
    return (
      <div className='member'>
        <div className='btnlist'>
          {/* {
            btnlist && btnlist.map((item: any) => (
             <Button key={item.orderStatus} onClick={() => this.searchData(item.orderStatus)}>{EnumOrderStatus[item.orderStatus]}(<span className={item.orderStatus !== 0 ? 'fontred' : ''}>{item.count}</span>)</Button>
            ))
          } */}
          <Button onClick={() => this.searchData(0)}>全部订单(<span>{btnlist.allCount}</span>)</Button>
          <Button onClick={() => this.searchData(10)}>待支付(<span className='fontred'>{btnlist.dzfCount ? btnlist.dzfCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(20)}>待签到(<span className='fontred'>{btnlist.dqdCount ? btnlist.dqdCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(30)}>待配餐(<span className='fontred'>{btnlist.dpcCount ? btnlist.dpcCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(40)}>已配餐(<span className='fontred'>{btnlist.ypcCount ? btnlist.ypcCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(70)}>退款(<span className='fontred'>{btnlist.tkCount ? btnlist.tkCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(50)}>已完成(<span className='fontred'>{btnlist.ywcCount ? btnlist.ywcCount : 0}</span>)</Button>
          <Button onClick={() => this.searchData(60)}>已取消(<span className='fontred'>{btnlist.yqxCount ? btnlist.yqxCount : 0}</span>)</Button>
        </div>
        <Form className='search'>
          <div className='headertag'>
            <div className='left'>筛选查询</div>
            <div className='right'>
              <Button className='actionbtn' onClick={() => this.searchData('')}>查询结果</Button>
            </div>
          </div>
          <div className='searchparams'>
            <Row type='flex' justify='space-between'>
              <Col {...formcol}>
                <Item
                  label="输入搜索"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('orderId')(
                    <Input allowClear placeholder='订单ID' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
              <Col {...formcol}>
                <Item
                  label="会员昵称"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('nickName')(
                    <Input allowClear placeholder='会员昵称' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
              <Col {...formcol}>
                <Item
                  label="下单时间"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('createTime')(
                    <RangePicker
                    // suffixIcon={(<img src={date} />)}
                      allowClear
                      onChange={this.isRequestData}
                    />
                  )}
                </Item>
              </Col>
              <Col {...formcol}>
                <Item
                  label="门店名称"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('shopName')(
                    <Input allowClear placeholder='门店名称' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
            </Row>
          </div>
        </Form>
        {/* <TableItem
          columns={columns}
          dataSource={dataSource}
          bordered
          title={() => title}
        /> */}
        {title}
        <TableItem
          ref={tableRef}
          rowSelectionFixed
          filterKey="index"
          bordered
          isRequestData={isRequestData}
          rowSelection={false}
          rowKey={({ index }) => index}
          URL={this.api.queryOrderWebList}
          searchParams={searchParams}
          columns={columns as any}
        />
        <Modal
          title="导出销售订单信息"
          visible={visible}
          maskClosable={false}
          destroyOnClose
          onCancel={this.handleCancel}
          className='modal'
          footer={null}
        >
          <Form onSubmit={this.importBtn}>
            <Row>
              <Col span={24}>
                <Item
                  label='销售订单ID'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('orderIds')(
                    <Input allowClear placeholder='请输入销售订单ID' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Item
                  label='会员昵称'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('nickNames')(
                    <Input allowClear placeholder='请输入会员昵称' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className='timestyle'>
                <Item
                  label='下单时间'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('createTimes')(
                    <RangePicker
                    // suffixIcon={(<img src={date} />)}
                      allowClear
                      onChange={this.isRequestData}
                    />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Item
                  label='门店名称'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('shopNames')(
                    <Input allowClear placeholder='请输入门店名称' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={2} offset={20}>
                <span onClick={this.exportOrderClick}>
                  {/* <Button className='importBtn'> */}
                  <BaseDowload
                    title='导出数据'
                    isClickExportData={false}
                    ref={this.baseDowloadRef}
                    exportData
                    action={this.api.exportOrderWebInfo}
                    params={exportParams}
                    fileName={'销售订单数据'}
                    handleHide={this.handleHide}
                  />
                </span>
                {/* </Button> */}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<BasesaleOrderProps>()(SaleOrder)
