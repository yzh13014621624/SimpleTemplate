/*
 * @description: 优惠券管理新增
 * @author: song liu biao
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-15 17:27:17
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Radio, Col, Input, Row, DatePicker, Button, Switch } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { HttpUtil, FormatInputValue } from 'utils'
import { FormComponentProps } from 'antd/es/form'
import moment from 'moment'
import './index.less'
import { hot } from 'react-hot-loader'
const Item = Form.Item
const { RangePicker } = DatePicker
interface CouponState {
  deadlineType: number
  cillPrice: number
  id: string
  couponInfo: any
}
interface CouponFormProps extends FormComponentProps, BaseProps {
}
@hot(module)
class CouponAdd extends RootComponent<CouponFormProps, CouponState> {
  constructor (props: CouponFormProps) {
    super(props)
    this.state = {
      deadlineType: 1,
      cillPrice: 0,
      id: '',
      couponInfo: {}
    }
  }

  componentDidMount = () => {
    const { id } = HttpUtil.parseUrl(window.location.href)
    this.setState({ id })
    id && this.ApicouponDetail(id)
  }

  // 获取优惠券详情
  ApicouponDetail = (id: string) => {
    this.axios.request(this.api.ApicouponDetail, { id }).then(({ data }) => {
      const { deadlineType, cillPrice } = data
      if (cillPrice !== '0.00') {
        data.cillPriceNumber = cillPrice
        this.setState({
          couponInfo: data,
          deadlineType,
          cillPrice: 1
        })
      } else {
        data.cillPriceNumber = ''
        this.setState({
          couponInfo: data,
          deadlineType,
          cillPrice: 0
        })
      }
    })
  }

  // 使用门槛
  handleOnchangeCillPrice = (e: any) => {
    this.setState({
      cillPrice: e.target.value
    })
  }

  // 使用期限
  handleOnchangeTime = (e: any) => {
    this.setState({
      deadlineType: e.target.value
    })
  }

  disabledDate = (current: any) => {
    return current && current < moment().subtract(1, 'days')
  }

  // 输入小数校验
  inputChange = (value: any, num1: number, num2: number) => {
    return FormatInputValue.toFixed(value, num1, num2)
  }

  // 提交表单
  handleSubmit = (e: any) => {
    e.preventDefault()
    const { validateFields } = this.props.form
    const { id } = this.state
    validateFields((err: any, data: any) => {
      if (!err) {
        const { name, cillPrice, price, deadlineType, time, cillPriceNumber, afterDay, validDay } = data
        if (price <= 0 || price >= 100000) {
          this.$message.warning('优惠券金额不能小于0,大于100000')
          return
        }
        if (cillPrice === 1 && cillPriceNumber <= price) {
          this.$message.warning('使用门槛金额不能小于优惠金额')
          return
        }
        if (deadlineType === 1 && time.length < 2) {
          this.$message.warning('请选择使用期限')
          return
        }
        const params = {
          name,
          cillPrice: cillPriceNumber || 0,
          price,
          deadlineType,
          startAt: deadlineType === 1 ? moment(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endAt: deadlineType === 1 ? moment(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          afterDay: deadlineType === 2 ? afterDay : 0,
          validDay: deadlineType === 2 ? validDay : 0,
          id
        }
        this.axios.request(this.api.ApicouponaddOrEdit, params).then(({ data }) => {
          this.$message.success(id ? '编辑成功' : '新增成功')
          this.props.history.push('/coupon-management/coupon')
        })
      } else {
        this.$message.warning('请把数据填写完整')
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { deadlineType, cillPrice, id, couponInfo } = this.state
    const formLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }
    const { name, price, cillPriceNumber, startAt, endAt, afterDay, validDay } = couponInfo
    return (
      <div className='coupon_add'>
        <SearchHeader title={id ? '编辑优惠券' : '添加优惠券'} cancelBlock={true} >
          <Form onSubmit={this.handleSubmit}>
            <Item {...formLayout} label='优惠券名称'>
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券名称',
                    max: 16
                  }
                ]
              })(
                <Input placeholder='请输入优惠券名称' />
              )}
            </Item>
            <Item {...formLayout} label='使用门槛'>
              {getFieldDecorator('cillPrice', {
                initialValue: cillPrice,
                rules: [
                  {
                    required: true,
                    message: '请选择使用门槛'
                  }
                ]
              })(
                <Radio.Group onChange={this.handleOnchangeCillPrice}>
                  <Radio value={0}>无使用门槛</Radio>
                  <Radio value={1}>
                    订单满&nbsp;&nbsp;
                    {cillPrice === 0 &&
                      getFieldDecorator('cillPriceNumber', {
                        initialValue: ''
                      })(
                        <Input type='number' placeholder='请输入金额' disabled />
                      )
                    }
                    {cillPrice === 1 &&
                      getFieldDecorator('cillPriceNumber', {
                        initialValue: cillPriceNumber,
                        rules: [{
                          required: true,
                          message: '请输入优惠金额'
                        }],
                        getValueFromEvent: (e: any) => {
                          e.persist()
                          return this.inputChange(e.target.value, 2, 10)
                        }
                      })(
                        <Input type='number' placeholder='请输入金额' />
                      )
                    }

                  </Radio>
                </Radio.Group>)
              }
            </Item>
            <Item {...formLayout} label='优惠金额'>
              {getFieldDecorator('price', {
                initialValue: price,
                rules: [
                  {
                    required: true,
                    message: '请输入优惠金额'
                  }
                ],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return this.inputChange(e.target.value, 2, 10)
                }
              })(
                <Input type='number' placeholder='请输入金额' />
              )}&nbsp;&nbsp;元
            </Item>
            <Item {...formLayout} label='使用期限'>
              {getFieldDecorator('deadlineType', {
                initialValue: deadlineType,
                rules: [
                  {
                    required: true,
                    message: '请选择使用期限'
                  }
                ]
              })(
                <Radio.Group onChange={this.handleOnchangeTime}>
                  <Radio value={1}>
                    {deadlineType === 1 ? getFieldDecorator('time', {
                      initialValue: startAt ? [moment(startAt), moment(endAt)] : []
                    })(<RangePicker disabledDate={this.disabledDate} />) : getFieldDecorator('time', {
                      initialValue: []
                    })(<RangePicker disabled />)
                    }
                  </Radio>
                  {deadlineType === 1 &&
                    <Radio value={2}>
                      领券后&nbsp;&nbsp;
                      {getFieldDecorator('afterDay', {
                        initialValue: ''
                      })(
                        <Input className='input-50' disabled />
                      )}
                          &nbsp;&nbsp;天生效，有效天数&nbsp;&nbsp;
                      {getFieldDecorator('validDay', {
                        initialValue: ''
                      })(
                        <Input className='input-50' disabled />
                      )}&nbsp;&nbsp;天
                    </Radio>
                  }
                  {deadlineType === 2 &&
                    <Radio value={2}>
                      领券后&nbsp;&nbsp;
                      {getFieldDecorator('afterDay', {
                        initialValue: afterDay,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(
                        <Input className='input-50' />
                      )}
                        &nbsp;&nbsp;天生效，有效天数&nbsp;&nbsp;
                      {getFieldDecorator('validDay', {
                        initialValue: validDay,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(
                        <Input className='input-50' />
                      )}&nbsp;&nbsp;天
                    </Radio>

                  }
                </Radio.Group>)
              }
            </Item>
            <Row type='flex' justify='center' style={{ margin: '100px 0' }}>
              <Button type='primary' htmlType='submit'>提交</Button>
            </Row>
          </Form>
        </SearchHeader>
      </div>
    )
  }
}
export default Form.create<CouponFormProps>()(CouponAdd)
