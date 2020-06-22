/*
 * @description: 采购管理首页
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-08-26 14:52:34
 * @LastEditTime: 2019-09-17 17:38:44
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import './index.styl'
import { RootComponent, TableItem, BaseDowload, BasicModal } from 'components'
import { hot } from 'react-hot-loader'
import { BaseProps } from 'typings/global'
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker
const { Item } = Form
interface PurchaseListState {
  searchParams: any
  purchaseOrderCount: any
  isRefresh: boolean
}
interface PurchaseListFormState {

}
interface PurchaseListFormProps extends FormComponentProps {
  searchData: Function
  purchaseOrderCount: any
}
// 搜索組件
class PurchaseListForm extends RootComponent<PurchaseListFormProps, PurchaseListFormState> {
  constructor (props: PurchaseListFormProps) {
    super(props)
  }

  handleSerach = (orderStatus: string) => {
    const data = this.props.form.getFieldsValue()
    const { createTime = [], key, orderSn, sendType } = data
    const searchParams = {
      beginTime: createTime.length > 1 ? moment(createTime[0]).format('YYYY-MM-DD') : '',
      endTime: createTime.length > 1 ? moment(createTime[1]).format('YYYY-MM-DD') : '',
      key,
      orderSn,
      orderStatus,
      sendType
    }
    this.props.searchData(searchParams)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { purchaseOrderCount } = this.props
    return (
      <div className='purchaseList-head'>
        <div className='purchaseList-head-btn'>
          <Button onClick={() => this.handleSerach('')} type='primary'>全部订单({purchaseOrderCount.totalCount})</Button>
          <Button onClick={() => this.handleSerach('waitShipping')}>待配送({purchaseOrderCount.dpsCount})</Button>
          <Button onClick={() => this.handleSerach('distributing')}>配送中({purchaseOrderCount.pszCount})</Button>
          <Button onClick={() => this.handleSerach('alreadyDone')}>已完成({purchaseOrderCount.yqsCount})</Button>
          <Button onClick={() => this.handleSerach('alreadyCancel')}>已取消({purchaseOrderCount.yqxCount})</Button>
        </div>
        <div className='purchaseList-head-serach'>
          <Row className='title' type='flex' justify='space-between'>
            <Col>筛选查询</Col>
            <Col><Button type="primary" htmlType="submit" onClick={() => this.handleSerach('')}>查询结果</Button></Col>
          </Row>
          <Form>
            <Row className='serach' type='flex' justify='space-between'>
              <Col span={5}>
                <Item
                  label="输入搜索"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('orderSn')(<Input type='test' placeholder='采购单ID' />)}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="输入搜索"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('key')(<Input type='test' placeholder='门店名称' />)}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="采购时间"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="采购类型"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('sendType', { initialValue: '' })(
                    <Select placeholder="全部">
                      <Option value={''}>全部</Option>
                      <Option value={0}>商户采购</Option>
                      <Option value={1}>总部配送</Option>
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
const PurchaseListFormComponent = Form.create<PurchaseListFormProps>()(
  PurchaseListForm
)
interface OperateProps extends FormComponentProps {
  history: any
}
// 操作組件
class Operate extends RootComponent<OperateProps> {
  modalRef: any = React.createRef<BasicModal>()
  constructor (props: OperateProps) {
    super(props)
  }

  // 添加采购订单
  handleAddPurchase = () => {
    this.props.history.push('/purchase-management/purchaseAdd?type=0')
  }

  // 导出采购单
  handleExportPurchase = () => {
    this.modalRef.current!.handleOk()
    this.props.form.resetFields()
  }

  // 导出成功
  handleHide = () => {
    this.modalRef.current!.handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Row className='title' type='flex' justify='space-between'>
        <Col>数据列表</Col>
        <Col>
          <BaseDowload
            downloadTemplate
            action={this.api.ApiExportTemplate}
            fileName={'采购订单模板'}
          />

          <Button type="primary" htmlType="submit" onClick={this.handleAddPurchase}>添加采购单</Button>
          <Button type="primary" htmlType="submit" onClick={this.handleExportPurchase}>导出采购单</Button>
          <BasicModal
            ref={this.modalRef}
            title='导出采购订单信息'
            width={'40%'}
          >
            <Form>
              <Item
                label="采购单ID"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}>
                {getFieldDecorator('key')(<Input type='test' placeholder='请输入采购单ID' />)}
              </Item>
              <Item
                label="采购时间"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}>
                {getFieldDecorator('startDate')(<DatePicker placeholder='采购开始时间' showTime format="YYYY-MM-DD" />)}--
                {getFieldDecorator('endDate')(<DatePicker placeholder='采购结束时间' showTime format="YYYY-MM-DD" />)}
              </Item>
              <Item
                label="采购门店"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}>
                {getFieldDecorator('orderSn')(<Input type='test' placeholder='请输入门店名称' />)}
              </Item>
              <Item
                label="采购类型"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}>
                {getFieldDecorator('sendType', { initialValue: [] })(
                  <Checkbox.Group>
                    <Checkbox value="1">总部配送</Checkbox>
                    <Checkbox value="0">门店采购</Checkbox>
                  </Checkbox.Group>
                )}
              </Item>
              <Item
                label="订单状态"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}>
                {getFieldDecorator('orderStatus', { initialValue: [] })(
                  <Checkbox.Group>
                    <Checkbox value="waitShipping">待配送</Checkbox>
                    <Checkbox value="distributing">配送中</Checkbox>
                    <Checkbox value="alreadyDone">已完成</Checkbox>
                    <Checkbox value="alreadyCancel">已取消</Checkbox>
                  </Checkbox.Group>
                )}
              </Item>
            </Form>
            <BaseDowload
              exportData
              action={this.api.ApiExportData}
              params={this.props.form.getFieldsValue()}
              fileName={'采购订单模板'}
              handleHide={this.handleHide}
            />
          </BasicModal>
        </Col>
      </Row>
    )
  }
}
const OperateComponent = Form.create<FormComponentProps>()(
  Operate
)
// 父組件
@hot(module)
export default class PurchaseList extends RootComponent<BaseProps, PurchaseListState> {
  constructor (props: BaseProps) {
    super(props)
    this.state = {
      searchParams: {},
      isRefresh: false,
      purchaseOrderCount: []
    }
  }

  componentDidMount = () => {
    this.ApiGetPurchaseOrderCount()
  }

  // 获取采购订单状态数量
  ApiGetPurchaseOrderCount = () => {
    this.axios.request(this.api.ApiGetPurchaseOrderCount, {}).then(({ data }) => {
      this.setState({
        purchaseOrderCount: data
      })
    })
  }

  // 搜索订单
  searchData = (data: any) => {
    this.setState({
      searchParams: data
    })
  }

  // 查看订单
  handleLookOrder = (e: any, record: any) => {
    e.stopPropagation()
    this.props.history.push(`/purchase-management/purchase-details?purchOrderId=${record.id}&&shopId=${record.shopId}`)
  }

  // 取消/配送订单
  handleUpdateOrder = (e: any, item: any, status: number) => {
    e.stopPropagation()
    this.axios.request(this.api.ApiUpdatePurchaseOrderStatus, { purchOrderId: item.id, shopId: item.shopId, status }).then(({ data }) => {
      this.$message.success('操作成功')
      this.ApiGetPurchaseOrderCount()
    })
  }

  // 删除订单
  handleDeleteOrder = (e: any, item: any) => {
    e.stopPropagation()
    this.axios.request(this.api.ApiDeletePurchaseOrder, { purchOrderId: item.id, orderStatus: item.orderStatus }).then(({ data }) => {
      this.$message.success('操作成功')
      this.ApiGetPurchaseOrderCount()
    })
  }

  // 再来一单
  handleRecurOrder = (e: any, record: any) => {
    e.stopPropagation()
    this.props.history.push(`/purchase-management/purchaseAdd?purchOrderId=${record.id}&&shopId=${record.shopId}&&type=1`)
  }

  render () {
    const columns = [
      {
        title: '采购单ID',
        dataIndex: 'orderSn',
        align: 'center'
      },
      {
        title: '采购时间',
        dataIndex: 'createTime',
        align: 'center'
      },
      {
        title: '采购类型',
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
        title: '门店名称',
        dataIndex: 'shopName',
        align: 'center'
      },
      {
        title: '门店联系方式',
        dataIndex: 'linkmanPhone',
        align: 'center'
      },
      {
        title: '采购单金额',
        dataIndex: 'totalPriceStr',
        align: 'center'
      },
      {
        title: '采购单状态',
        dataIndex: 'orderStatus',
        align: 'center',
        render: (text: string) => {
          return (
            <span>
              {(text === '10' && '待配送') ||
                (text === '20' && '配送中') ||
                (text === '30' && '已完成') ||
                (text === '40' && '已取消')
              }
            </span>
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        render: (text: string, record: any) => {
          return (
            <div>
              {record.orderStatus === '10' &&
                <div>
                  <Button type='link' onClick={(e) => this.handleLookOrder(e, record)}>查看订单</Button>
                  <Button type='link' onClick={(e) => this.handleUpdateOrder(e, record, 1)}>取消订单</Button>
                  <Button type='link' onClick={(e) => this.handleUpdateOrder(e, record, 2)}>配送订单</Button>
                </div>
              }
              {record.orderStatus === '20' &&
                <div>
                  <Button type='link' onClick={(e) => this.handleLookOrder(e, record)}>查看订单</Button>
                </div>
              }
              {record.orderStatus !== '10' && record.orderStatus !== '20' &&
                <div>
                  <Button type='link' onClick={(e) => this.handleLookOrder(e, record)}>查看订单</Button>
                  <Button type='link' onClick={(e) => this.handleDeleteOrder(e, record)}>删除订单</Button>
                  {record.sendType === 1 && <Button type='link' onClick={(e) => this.handleRecurOrder(e, record)}>再来一单</Button>}
                </div>
              }
            </div>
          )
        }
      }
    ]
    const { searchParams, isRefresh, purchaseOrderCount } = this.state
    const { mobxGlobal: { authorityList: { purchase }, hasAuthority } } = this.props
    const [sImpo, sLook, sCancel, sSend, sDele, sRecur, sExpo, sDown]:any = hasAuthority(purchase)
    return (
      <div id='purchaseList'>
        <PurchaseListFormComponent searchData={this.searchData} purchaseOrderCount={purchaseOrderCount } />
        <div className='purchaseList-content'>
          <OperateComponent {...this.props} />
          <TableItem
            rowSelectionFixed
            filterKey="index"
            bordered
            rowSelection={false}
            rowKey={({ index }) => index}
            URL={this.api.ApifindPurchaseOrderList}
            searchParams={searchParams}
            columns={columns as any}
          />

        </div>
      </div>
    )
  }
}
