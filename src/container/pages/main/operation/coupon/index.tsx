/*
 * @description: 优惠券管理
 * @author: song liu biao
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-02 18:07:15
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Divider, Col, Input, Row, Select, Button, Switch } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'
import { hot } from 'react-hot-loader'
const Item = Form.Item
interface CouponState {
  searchParams: any
}
interface CouponFormProps extends FormComponentProps {
  searchParams: any
}
class CouponForm extends RootComponent<CouponFormProps, any> {
  constructor (props: CouponFormProps) {
    super(props)
  }

  handleSerach = () => {
    const data = this.props.form.getFieldsValue()
    const { searchParams } = this.props
    searchParams && searchParams(data)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='coupon'>
        <Form onSubmit={this.handleSerach}>
          <SearchHeader title='筛选条件' cancelBlock={true} extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row type ='flex' justify='start'>
              <Col span={5}>
                <Item
                  label="优惠券名称"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('name')(<Input type='test' placeholder='请输入优惠券名称' />)}
                </Item>
              </Col>
            </Row>
          </SearchHeader>
        </Form>
      </div>
    )
  }
}
const CouponFormComponent = Form.create<CouponFormProps>()(CouponForm)
@hot(module)
export default class Coupon extends RootComponent<BaseProps, CouponState> {
  constructor (props: BaseProps) {
    super(props)
    this.state = {
      searchParams: {}
    }
  }

  // 搜索列表
  searchData = (data?: any) => {
    this.setState({
      searchParams: data
    })
  }

  // 添加优惠券
  handleAdd = (e: any, item?: any) => {
    const { id } = item
    if (id) this.props.history.push(`/coupon-management/coupon-add?id=${id}`)
    else this.props.history.push('/coupon-management/coupon-add')
  }

  // 查看明细
  handleDetails = () => {
    this.props.history.push('/coupon-management/coupon-details')
  }

  // 上架/下架优惠券
  handleStatus = (e: any, set: number, item: any) => {
    const { id } = item
    const message = set === 1 ? '上架成功' : '下架成功'
    this.axios.request(this.api.ApicouponStatus, { id, set }).then(({ data }) => {
      this.$message.success(message)
      this.searchData()
    })
  }

  render () {
    const columns = [
      {
        title: '批次号',
        dataIndex: 'number',
        align: 'center'
      },
      {
        title: '优惠券名称',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '适用门店',
        dataIndex: 'toShop',
        align: 'center',
        render: (text: string) => (<span>{text === '1' && '全部门店'}</span>)
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (text: string) => (<span>{text === '1' ? '已上架' : '已下架'}</span>)
      },
      {
        title: '已领取',
        dataIndex: 'received',
        align: 'center'
      },
      {
        title: '已使用',
        dataIndex: 'used',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (value: any, item: any) => {
          return (
            <div>
              {item.status === '1' ? <Button type='link' onClick={(e) => this.handleStatus(e, 2, item)}>下架</Button> : <Button type='link' onClick={(e) => this.handleStatus(e, 1, item)}>上架</Button>}
              {item.status === '2' && <Button type='link' onClick={(e) => this.handleAdd(e, item)}>编辑</Button>}
              <Button type='link' onClick={this.handleDetails}>明细</Button>
            </div>
          )
        }
      }
    ]
    const { searchParams } = this.state
    return (
      <div>
        <CouponFormComponent searchParams={this.searchData} />
        <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true} extraButton={<Button type='primary' onClick={(e) => this.handleAdd(e, {})}>添加优惠券</Button>}>
          <TableItem
            rowKey='id'
            columns={columns as any}
            URL={this.api.ApicouponList}
            rowSelection={false}
            bordered={true}
            scroll={{ x: 1320 }}
            searchParams={searchParams}
          />
        </SearchHeader>
      </div>
    )
  }
}
