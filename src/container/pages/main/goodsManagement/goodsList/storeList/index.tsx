/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-03-18 18:09:34
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Col, Input, Row, Select, Button } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import HttpUtil from 'utils/HttpUtil'
import './index.less'

import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps,FormComponentProps{}
interface ComponentFormProps extends FormComponentProps {
  onChangeParams: Function,
  parentState: any
}
interface ProductsState {
  condition: any
}

const Item = Form.Item
const { Option } = Select
const CONDITIONS = {
  shopId: undefined,
  shopName: undefined,
  shopType: ''
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
  
  componentDidMount() {
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

    return (
      <React.Fragment>
        <Form onSubmit={this.onSearch}>
          <SearchHeader title='筛选查询' extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row>
              <Col span={6}>
                <Item label='门店ID' {...formLayout}>
                  {getFieldDecorator('shopId', {
                    initialValue: parentState.shopId
                  })(
                    <Input placeholder='输入门店ID' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='门店名称' {...formLayout}>
                  {getFieldDecorator('shopName', {
                    initialValue: parentState.shopName
                  })(
                    <Input placeholder='请输入门店名称' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='门店类型' {...formLayout}>
                  {getFieldDecorator('shopType', {
                    initialValue: parentState.shopType
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
            </Row>
          </SearchHeader>
        </Form>
      </React.Fragment>
    )
  }
}

const FormSearchCom = Form.create<ComponentFormProps>()(SearchComponent)

@hot(module)
class StoreList extends RootComponent<FormProps, ProductsState> {
  constructor(props: any){
    super(props)
    this.state = {
      condition: {
        ...CONDITIONS
      }
    }
  }

  componentDidMount() {
  }

  /**页面事件 */

  onUnlink = (shopId: any) => {
    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const params = {
      goodsId: id,
      shopId: shopId
    }
    const { condition } = this.state
    this.axios.request(this.api.cancelShopGoodsRelation, params, false).then(({code}) => {
      if(code && code == 200) {
        this.$message.success('取消关联成功')
        this.setState({
          condition: condition
        })
      }
    })
  }

  /**子组件事件 */
  childChangeCondition = (condi: object) => {
    this.setState({
      condition: condi
    })
  }

  render () {
    const {
      props: {
        mobxGlobal: { authorityList: { goodsmanagement }, hasAuthority }
      },
      state: {
        condition
      }
    } = this
    const [pAddGoods, pEditGoods, pDetail, pAddStore, pCancelStore, ...rest]:any = hasAuthority(goodsmanagement)
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'goodsTitle',
        align: 'center',
      },
      {
        title: '商品类型',
        dataIndex: 'goodsType',
        align: 'center',
      },
      {
        title: '门店ID',
        dataIndex: 'shopId',
        align: 'center',
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        align: 'center',
      },
      {
        title: '门店logo',
        dataIndex: 'shopLogo',
        align: 'center',
        render: (value: any, item: any) => {
          return <img src={value} className='table-goodsimg' alt='' />
        }
      },
      {
        title: '门店类型',
        dataIndex: 'shopType',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pCancelStore ?
                <a href='javacript:void(0);' onClick={() => this.onUnlink(item.shopId)}>取消关联</a>
                :
                <span>无法进行更多操作</span>
              }
            </>
          )
        }
      }
    ]

    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const params = {
      ...condition,
      goodsId: id
    }
    
    return (
      <React.Fragment>
        <FormSearchCom onChangeParams={this.childChangeCondition} parentState={condition}/>
        {/* <SearchHeader title='数据列表' cancelPadding={true} extraButton={<Button type='primary' onClick={this.onSearch}>添加商品</Button>}> // 第一期不做添加商品功能 */}
        <SearchHeader title='销售门店列表' cancelPadding={true}>
          <TableItem
            rowKey='shopId'
            columns={columns as any}
            URL={{path: '/dubrovnik2/goods/v1/getShopGoodsList'}}
            rowSelection={false}
            bordered={true}
            scroll={{x: 1320}}
            searchParams={params}
          />
        </SearchHeader>
      </React.Fragment>
    )
  }
}

export default Form.create<FormProps>()(StoreList)