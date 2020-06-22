/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-07 18:31:55
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Divider, Col, Input, Row, Select, Button, Table } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import _ from 'lodash'
import './index.less'

import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps, FormComponentProps { }
interface ComponentFormProps extends FormComponentProps {
  onChangeParams: Function,
  parentState: any
}
interface ProductsState {
  condition: any,
  pageData: any[],
  pager: object
}

const Item = Form.Item
const { Option } = Select
const CONDITIONS = {
  goodsTitle: undefined,
  goodsId: undefined,
  goodsTypeId: '',
  shopName: undefined,
  approveStatus: ''
}

const PAGER = {
  current: 1,
  pageSize: 10,
  total: 0
}

const GOODS_APPROVE_STATUS = [
  {
    name: '已下架',
    status: 1
  },
  {
    name: '已上架',
    status: 2
  },
  {
    name: '已售完',
    status: 3
  }
]

class SearchComponent extends RootComponent<ComponentFormProps, any> {
  constructor (props: ComponentFormProps) {
    super(props)
    this.state = {
      goodsTypeList: []
    }
  }

  componentDidMount () {
    this.axios.request(this.api.getGoodsType, { pageSize: 999 }, false).then(({ data }) => {
      this.setState({
        goodsTypeList: data
      })
    })
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
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }
    const { parentState } = this.props
    const { goodsTypeList } = this.state

    return (
      <React.Fragment>
        <Form onSubmit={this.onSearch}>
          <SearchHeader title='筛选条件' cancelBlock={true} extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row>
              <Col span={6}>
                <Item label='门店商品ID' {...formLayout}>
                  {getFieldDecorator('goodsId', {
                    initialValue: parentState.goodsId
                  })(
                    <Input placeholder='输入门店商品ID' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='商品名称' {...formLayout}>
                  {getFieldDecorator('goodsTitle', {
                    initialValue: parentState.goodsTitle
                  })(
                    <Input placeholder='输入商品名称' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='门店名称' {...formLayout}>
                  {getFieldDecorator('shopName', {
                    initialValue: parentState.shopName
                  })(
                    <Input placeholder='输入门店名称' />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label='门店商品状态' {...formLayout}>
                  {getFieldDecorator('approveStatus', {
                    initialValue: parentState.approveStatus
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {GOODS_APPROVE_STATUS.map(item => {
                        return (
                          <Option value={item.status} key={item.status}>{item.name}</Option>
                        )
                      })}
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='商品类型' {...formLayout}>
                  {getFieldDecorator('goodsTypeId', {
                    initialValue: parentState.goodsTypeId
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {goodsTypeList.length > 0 && goodsTypeList.map((item: any) => {
                        return (
                          <Option value={item.id} key={item.id}>{item.title}</Option>
                        )
                      })}
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
class StoreProducts extends RootComponent<FormProps, ProductsState> {
  priceInput: any = React.createRef()

  constructor (props: any) {
    super(props)
    this.state = {
      condition: {
        ...CONDITIONS
      },
      pageData: [],
      pager: {
        ...PAGER
      }
    }
  }

  componentDidMount () {
    this.getPageData()
  }

  /** 获取页面数据 */
  getPageData = (params: any = {}) => {
    const { condition, pager } = this.state
    const payload = {
      ...pager,
      ...condition,
      ...params,
      page: (pager as any).current
    }
    this.axios.request(this.api.getShopGoods, payload, false).then(({ code, data }) => {
      if (code && code === 200) {
        const tempArr = data.data
        tempArr.forEach((element: any, index: any) => {
          element.index = index
          element.priceEdit = false
          element.purchasePriceEdit = false
        })
        this.setState({
          pageData: tempArr,
          pager: {
            ...this.state.pager,
            total: data.totalNum
          }
        })
      }
    })
  }

  /** 页面事件 */
  onObtain = (item: any, status: any) => {
    const newStatus = status == '1' ? 2 : 1
    const tips = status == '1' ? '上架' : '下架'
    const params = {
      goodsId: item.goodsId,
      shopId: item.shopId,
      status: newStatus
    }
    this.axios.request(this.api.updateShopGoodsStatus, params, false).then(({ code }) => {
      if (code && code === 200) {
        this.$message.success(`${tips}商品成功`)
        this.getPageData()
      }
    })
  }

  handleChangePage = (value: any) => {
    this.setState({
      pager: {
        ...this.state.pager,
        current: value
      }
    }, () => {
      this.getPageData()
    })
  }

  onEditItemPirce = (index: any, type: string, inputVisible: boolean) => {
    const nextData = _.cloneDeep(this.state.pageData)
    let price = ''
    let changeType = 1
    if (type === 'price') {
      nextData[index].priceEdit = inputVisible
      price = nextData[index].price
    } else {
      nextData[index].purchasePriceEdit = inputVisible
      price = nextData[index].purchasePrice
      changeType = 2
    }
    this.setState({
      pageData: nextData
    }, () => {
      if (this.priceInput.current) {
        this.priceInput.current.focus()
      }
    })
    if (!inputVisible) {
      const payload = {
        goodsId: nextData[index].goodsId,
        shopId: nextData[index].shopId,
        price: price,
        type: changeType
      }
      this.axios.request(this.api.updateShopGoodsPrice, payload, false).then(({ code }) => {
        if (code && code === 200) {
          this.$message.success('修改价格成功')
          this.getPageData()
        }
      })
    }
  }

  handleChangePrice = (e: any, index: any, type: any) => {
    const reg = /^-?(0|[1-9][0-9]*)(\.([0-9]{0,2}))?$/
    const value = e.target.value
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      const nextData = _.cloneDeep(this.state.pageData)
      if (type === 'price') {
        nextData[index].price = value
      } else {
        nextData[index].purchasePrice = value
      }
      this.setState({
        pageData: nextData
      })
    }
  }

  /** 子组件事件 */
  childChangeCondition = (condi: object) => {
    this.setState({
      condition: condi,
      pager: {
        ...this.state.pager,
        current: 1
      }
    }, () => {
      this.getPageData()
    })
  }

  handleDownloadImg = (e: any, item: any) => {
    const { qrImage, shopName } = item
    const image = new Image()
    // 解决跨域 canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
      const canvas: any = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      // 得到图片的base64编码数据
      const url = canvas.toDataURL('image/png')
      // 生成一个 a 标签
      const a = document.createElement('a')
      // 创建一个点击事件
      const event = new MouseEvent('click')
      // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
      a.download = `${shopName}二维码`
      // 将生成的 URL 设置为 a.href 属性
      a.href = url
      // 触发 a 的点击事件
      a.dispatchEvent(event)
      // return a;
    }

    image.src = qrImage
  }

  render () {
    const {
      state: {
        condition, pageData, pager
      },
      props: {
        mobxGlobal: { authorityList: { goodsmanagement }, hasAuthority }
      }
    } = this
    const [, , , , , pShelf, pObtain, pEditPrice, pEditPurchasePrice, pDetail]: any = hasAuthority(goodsmanagement)

    const columns = [
      {
        title: '门店商品ID',
        dataIndex: 'goodsId'
      },
      {
        title: '商品图片',
        dataIndex: 'goodsImg',
        render: (value: any) => {
          return (
            <img className='table-goodsimg' src={value} alt='' />
          )
        }
      },
      {
        title: '商品名称',
        dataIndex: 'goodsTitle'
      },
      {
        title: '商品类型',
        dataIndex: 'goodsType'
      },
      {
        title: '门店名称',
        dataIndex: 'shopName'
      },
      {
        title: '门店商品售价',
        dataIndex: 'price',
        render: (value: any, item: any, index: any) => {
          return (
            <div>
              {
                item.priceEdit
                  ? <Input
                    className='price-input'
                    value={item.price}
                    onChange={(e) => this.handleChangePrice(e, index, 'price')}
                    onBlur={() => this.onEditItemPirce(index, 'price', false)}
                    ref={this.priceInput}
                  />
                  : <>
                    <span style={{ marginRight: '8px' }}>￥{value}</span>
                    {
                      item.goodsApproveStatus !== '2' && pEditPrice &&
                      <a href='javacript:void(0);' onClick={() => this.onEditItemPirce(index, 'price', true)}>修改</a>
                    }
                  </>
              }
            </div>
          )
        }
      },
      {
        title: '门店商品采购价',
        dataIndex: 'purchasePrice',
        render: (value: any, item: any, index: any) => {
          return (
            <div>
              {
                item.purchasePriceEdit
                  ? <Input
                    className='price-input'
                    value={item.purchasePrice}
                    onChange={(e) => this.handleChangePrice(e, index, 'purchase')}
                    onBlur={() => this.onEditItemPirce(index, 'purchase', false)}
                    ref={this.priceInput}
                  />
                  : <>
                    <span style={{ marginRight: '8px' }}>￥{value}</span>
                    {
                      item.goodsApproveStatus !== '2' && pEditPurchasePrice &&
                      <a href='javacript:void(0);' onClick={() => this.onEditItemPirce(index, 'purchase', true)}>修改</a>
                    }
                  </>
              }
            </div>
          )
        }
      },
      {
        title: '门店商品库存',
        dataIndex: 'goodsStore',
        render: (value: any) => {
          return (
            <div className={Number(value) <= 10 ? 'warning-stock' : ''}>{value}</div>
          )
        }
      },
      {
        title: '门店商品销量',
        dataIndex: 'sale'
      },
      {
        title: '门店商品状态',
        dataIndex: 'goodsApproveStatus',
        render: (value: any) => {
          return <span>{value == '1' ? '已下架' : (value == '2' ? '已上架' : '已售完')}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pDetail &&
                <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/goods-management/store-products-detail/index?id=${item.goodsId}&&shopId=${item.shopId}`) }}>查看</a>
              }
              {
                item.goodsType === '标准商品' &&
                <>
                  <Divider type='vertical' />
                  {
                    item.goodsApproveStatus === '1'
                      ? pShelf && <a href='javacript:void(0);' onClick={() => this.onObtain(item, item.goodsApproveStatus)}>上架</a>
                      : pObtain && <a href='javacript:void(0);' onClick={() => this.onObtain(item, item.goodsApproveStatus)}>下架</a>
                  }
                </>
              }
               <Divider type='vertical' />
              <a href='javacript:void(0);' onClick={(e) => this.handleDownloadImg(e, item)}>下载二维码</a>
            </>
          )
        }
      }
    ]
    const paginationParam = {
      ...pager,
      size: 'small',
      current: (pager as any).current,
      showTotal: (total: any) => `总条数：${total}`,
      onChange: (value: any) => this.handleChangePage(value),
      itemRender: (current: number, type: string, originalElement: any) => {
        if (type === 'prev') {
          return <Button size="small" style={{ margin: '0 6px' }}>上一页</Button>
        } if (type === 'next') {
          return <Button size="small" style={{ margin: '0 6px' }}>下一页</Button>
        }
        return originalElement
      },
      showQuickJumper: true
    }

    return (
      <div className='store-products'>
        <FormSearchCom onChangeParams={this.childChangeCondition} parentState={condition} />
        <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true}>
          <Table
            rowKey={({ index }) => index}
            columns={columns as any}
            bordered={true}
            scroll={{ x: 1320 }}
            dataSource={pageData}
            pagination={paginationParam}
          />
        </SearchHeader>
      </div>
    )
  }
}

export default Form.create<FormProps>()(StoreProducts)
