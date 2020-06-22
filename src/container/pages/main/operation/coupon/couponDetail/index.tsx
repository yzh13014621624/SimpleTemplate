/*
 * @description: 优惠券管理
 * @author: song liu biao
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-03-25 17:22:22
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BaseDowload } from 'components'
import { Form, Divider, Col, Input, Row, Select, Button, DatePicker } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import { hot } from 'react-hot-loader'
import moment from 'moment'
const Item = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
interface CouponDetailState {
  searchParams: any
}
interface CouponDetailFormProps extends FormComponentProps {
  searchParams: any
}
class CouponDetailForm extends RootComponent<CouponDetailFormProps, any> {
  constructor (props: CouponDetailFormProps) {
    super(props)
    this.state = {
    }
  }

  handleSerach = async () => {
    const { nickOrMobile, status, time } = this.props.form.getFieldsValue()
    const params = {
      nickOrMobile,
      status,
      startAt: time.length > 1 ? moment(time[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endAt: time.length > 1 ? moment(time[1]).format('YYYY-MM-DD HH:mm:ss') : null
    }
    await this.setState({
      searchParams: params
    })
    const { searchParams } = this.props
    searchParams && searchParams(params)
  }

  render () {
    const { nickOrMobile, status, time = [] } = this.props.form.getFieldsValue()
    const { getFieldDecorator } = this.props.form
    return (
      <div className='coupon'>
        <Form onSubmit={this.handleSerach}>
          <SearchHeader title='筛选条件' cancelBlock={true} extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row type ='flex' justify='start'>
              <Col span={6}>
                <Item
                  label="领券人"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('nickOrMobile')(<Input type='test' placeholder='请输入优惠券名称' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item
                  label="券状态"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('status', {
                    initialValue: 0
                  })(
                    <Select>
                      <Option value={0}>全部</Option>
                      <Option value={1}>未使用</Option>
                      <Option value={2}>已使用</Option>
                      <Option value={3}>已过期</Option>
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={7}>
                <Item
                  label="领取时间"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('time', {
                    initialValue: []
                  })(<RangePicker showTime />)}
                </Item>
              </Col>
            </Row>
          </SearchHeader>
          <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true} extraButton={ <BaseDowload
            exportData
            action={this.api.ApiccountListExport}
            params={{
              nickOrMobile,
              status,
              startAt: time.length > 1 ? moment(time[0]).format('YYYY-MM-DD HH:mm:ss') : null,
              endAt: time.length > 1 ? moment(time[1]).format('YYYY-MM-DD HH:mm:ss') : null
            }}
            fileName={'优惠券模板'}
          />
          }>
          </SearchHeader>
        </Form>
      </div>
    )
  }
}
const CouponDetailFormComponent = Form.create<CouponDetailFormProps>()(CouponDetailForm)
@hot(module)
export default class CouponDetailDetail extends RootComponent<BaseProps, CouponDetailState> {
  serachform = React.createRef<any>()
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

  // 上架/下架优惠券
  handleStatus = (e: any, set: number, item: any) => {
    const { id } = item
    const message = set === 1 ? '上架成功' : '下架成功'
    this.axios.request(this.api.ApicouponStatus, { id, set }).then(({ data }) => {
      this.$message.success(message)
      this.searchData()
    })
  }

  // 优惠券明细
  handleDetails = (e: any, item: any) => {
    const { id } = item
    this.props.history.push(`/coupon-management/coupon-details?id=${id}`)
  }

  render () {
    const columns = [
      {
        title: '领券人昵称',
        dataIndex: 'nick',
        align: 'center'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        align: 'center'
      },
      {
        title: '领取时间',
        dataIndex: 'getTime',
        align: 'center'
      },
      {
        title: '券状态',
        dataIndex: 'status',
        align: 'center',
        render: (text: number) => (<span>{(text === 1 && '未使用') || (text === 2 && '已使用') || (text === 3 && '已过期')}</span>)
      }
    ]
    const { searchParams } = this.state
    return (
      <div>
        <CouponDetailFormComponent searchParams={this.searchData} />
        <TableItem
          rowKey='id'
          columns={columns as any}
          URL={this.api.ApiccountList}
          rowSelection={false}
          bordered={true}
          scroll={{ x: 1320 }}
          searchParams={searchParams}
        />
      </div>
    )
  }
}
