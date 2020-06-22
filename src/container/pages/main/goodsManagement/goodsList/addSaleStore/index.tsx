/*
 * @description: 商品详情查看页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-30 13:54:46
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Row, Col, Button, Select, Input, Divider, Icon } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import { SearchHeader } from 'components/index'
import HttpUtil from 'utils/HttpUtil'
import TableComponent from './tableComponent'
import _ from 'lodash'
import './index.less'

import { hot } from 'react-hot-loader'

const { Option } = Select
const { Item } = Form

interface FormProps extends BaseProps, FormComponentProps{}
interface ComponentFormProps extends FormComponentProps {
  onChangeParams: Function,
  parentState: any,
  goodsName: any
}

const STORE_TYPE = [
  {
    value: 0,
    title: '直营'
  },
  {
    value: 1,
    title: '加盟'
  },
  {
    value: 2,
    title: '合作'
  }
]

class SearchComponent extends RootComponent<ComponentFormProps> {
  componentDidMount () {
  }

  /** 页面事件 */
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
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }
    const { parentState, goodsName } = this.props

    return (
      <div className='sales-store'>
        <Form onSubmit={this.onSearch}>
          <div className='search-cont'>
            <Row>
              <Col span={6}>
                <Item label='商品名称' {...formLayout}>
                  <div>{goodsName}</div>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label='按照门店类型筛选' {...formLayout}>
                  {getFieldDecorator('type', {
                    initialValue: parentState.type
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {
                        STORE_TYPE.map(item => {
                          return <Option key={item.value} value={item.value}>{item.title}</Option>
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='搜索门店' {...formLayout}>
                  {getFieldDecorator('shopName', {
                    initialValue: parentState.shopName
                  })(
                    <Input placeholder='输入搜索门店' />
                  )}
                </Item>
              </Col>
              <Col span={2}>
                <Button type='primary' htmlType='submit' style={{ width: '80px' }}>查找</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}

const FormSearchCom = Form.create<ComponentFormProps>()(SearchComponent)

const CONDITIONS = {
  type: '',
  shopName: undefined
}
@hot(module)
class AddSaleStore extends RootComponent<FormProps> {
  state = {
    condition: {
      ...CONDITIONS
    },
    selectRow: [],
    currentStores: []
  }

  componentDidMount () {
  }

  /** 页面方法 */

  getSeletedRow = (selectedRowKeys: any, selectRow: any) => {
    this.setState({
      selectRow: selectRow
    })
  }

  /** 页面事件 */
  onAddStore = (item: any) => {
    const tempStores: any[] = _.clone(this.state.currentStores)
    tempStores.push(item)
    const newStores = _.uniqBy(tempStores, 'shopId')
    this.setState({
      currentStores: newStores
    })
  }

  onAddSelected = () => {
    const { selectRow, currentStores } = this.state
    const tempArr = _.cloneDeep(currentStores).concat(_.cloneDeep(selectRow))
    const newArray = _.uniqBy(tempArr, 'shopId')
    this.setState({
      currentStores: newArray
    })
  }

  onDeleteChoosen = (shopId: any) => {
    const previusStores = _.cloneDeep(this.state.currentStores)
    const deletArr = _.remove(previusStores, (n: any) => {
      return n.shopId == shopId
    })
    this.setState({
      currentStores: previusStores
    })
  }

  handleSubmitStores = () => {
    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const previousStores = _.cloneDeep(this.state.currentStores)
    if (previousStores.length === 0) {
      this.$message.info('请添加门店')
      return
    }
    const shopIds = previousStores.map((item: any) => {
      return item.shopId
    })
    const payload = {
      goodsId: id,
      shopIdList: shopIds
    }
    this.axios.request(this.api.insertShopGoods, payload, false).then(({ code }) => {
      if (code && code === 200) {
        this.props.history.push('/goods-management/index')
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
    const { condition, currentStores } = this.state
    const { id, name } = HttpUtil.parseUrl(this.props.location.search)
    const params = {
      ...condition,
      goodsId: id,
      type: (condition as any).type === '' ? undefined : (condition as any).type
    }

    return (
      <SearchHeader title='新增销售门店' className='add-sale-store'>
        <FormSearchCom
          onChangeParams={this.childChangeCondition}
          parentState={condition}
          goodsName={name}
        />
        <div className='table-container'>
          <TableComponent getSeletedRow={this.getSeletedRow} params={params} onAddStore={this.onAddStore} />
          <Button className='add-button' onClick={this.onAddSelected}>添加</Button>
        </div>
        <div className='bottom'>
          <Divider className='store-divider' />
          <div>
            <Row>
              已选择门店：
            </Row>
            <Row className='stores-container'>
              {
                currentStores.length > 0 && currentStores.map((item: any) => {
                  return (
                    <div className='store-items' key={item.shopId}>
                      <span>{item.shopName}</span>
                      <Icon type="close" className='close-icon' onClick={() => this.onDeleteChoosen(item.shopId)} />
                    </div>
                  )
                })
              }
            </Row>
            <Row className='submit-button'>
              <Button type='primary' style={{ width: '80px' }} onClick={this.handleSubmitStores}>提交</Button>
            </Row>
          </div>
        </div>
      </SearchHeader>
    )
  }
}

export default Form.create<FormProps>()(AddSaleStore)
