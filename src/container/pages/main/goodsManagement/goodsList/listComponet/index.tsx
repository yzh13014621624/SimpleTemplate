/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2019-09-17 17:32:18
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Button, Form, Col, Input, Row, Select } from 'antd'
import { SearchHeader } from 'components/index'
import { FormComponentProps } from 'antd/es/form'
// import './index.less'

import { hot } from 'react-hot-loader'

const Item = Form.Item
const { Option } = Select

interface FormProps extends FormComponentProps {
  onChangeParams: Function,
  parentState: any
}

@hot(module)
class ListComponent extends RootComponent<FormProps> {
  state = {
    customerList: [],
    supplierList: [],
    typeList: []
  }

  componentDidMount() {
    this.axios.request(this.api.storeCustomerList, {pageSize: 999}, false).then(({data}) => {
      const customerData = data.data
      this.setState({
        customerList: customerData
      })
    })
    this.axios.request(this.api.storeSupplierList, {pageSize: 999}, false).then(({ data }) => {
      const tempArray = data.data
      this.setState({
        supplierList: tempArray
      })
    })
    this.axios.request(this.api.getGoodsType, {pageSize: 999}, false).then(({ data }) => {
      this.setState({
        typeList: data
      })
    })
  }
  /**页面事件 */
  onSearch = (e: any) => {
    e.preventDefault()

    const { form, onChangeParams } = this.props
    form.validateFields((err, value) => {
      onChangeParams(value)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }
    const { parentState } = this.props
    const { customerList, supplierList, typeList } = this.state

    return (
      <React.Fragment>
        <Form onSubmit={this.onSearch}>
          <SearchHeader title='筛选条件' cancelBlock={true} extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row>
              <Col span={6}>
                <Item label='输入搜索' {...formLayout}>
                  {getFieldDecorator('goodsTitleOrId', {
                    initialValue: parentState.goodsTitleOrId
                  })(
                    <Input placeholder='输入商品ID/商品名称' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='所属客户' {...formLayout}>
                  {getFieldDecorator('customerId', {
                    initialValue: parentState.customerId
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {
                        customerList.length > 0 && customerList.map((item: any) => {
                          return <Option key={item.id} value={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='供应商' {...formLayout}>
                  {getFieldDecorator('supplierId', {
                    initialValue: parentState.supplierId
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {
                        supplierList.length > 0 && supplierList.map((item: any) => {
                          return <Option key={item.id} value={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label='商品类型' {...formLayout}>
                  {getFieldDecorator('goodsType', {
                    initialValue: parentState.goodsType
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {
                        typeList.length > 0 && typeList.map((item: any) => {
                          return (
                            <Option value={item.id} key={item.id}>{item.title}</Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
          </SearchHeader>
        </Form>
      </React.Fragment>
    )
  }
}

export default Form.create<FormProps>()(ListComponent)