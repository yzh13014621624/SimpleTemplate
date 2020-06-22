/*
 * @description: 添加采购单-选择采购门店
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-08-27 11:15:40
 * @LastEditTime: 2019-09-19 17:14:26
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import './index.styl'
import { RootComponent, TableItem, BaseUpload } from 'components'
import { BaseCommonModal } from 'shared/Modal/Modal'
import { hot } from 'react-hot-loader'
import { BaseProps } from 'typings/global'
import { Form, Input, Select, Row, Col, Steps, Button, Table } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { HttpUtil } from 'utils'
const { Step } = Steps
const { Option } = Select
let yetGoodsList: any = []
let goodsTypeList: any = []
const columns = [
  {
    title: '门店商品ID',
    dataIndex: 'goodsId',
    align: 'center'
  },
  {
    title: '商品图片',
    dataIndex: 'goodsImg',
    align: 'center',
    render: (text: string) => (
      <img style={{ width: '50px', height: '50px' }} src={text} />
    )
  },
  {
    title: '商品名称',
    dataIndex: 'goodsTitle',
    align: 'center'
  },
  {
    title: '商品类型',
    dataIndex: 'goodsType',
    align: 'center'
  },
  {
    title: '门店商品售价',
    dataIndex: 'price',
    align: 'center',
    render: (text: string) => (
      <span>￥{text}</span>
    )
  },
  {
    title: '门店商品采购价',
    dataIndex: 'purchasePrice',
    align: 'center',
    render: (text: string) => (
      <span>￥{text}</span>
    )
  },
  {
    title: '门店商品库存',
    dataIndex: 'goodsStore',
    align: 'center'
  }
]
const priceColumns = [
  {
    title: '商品数量',
    dataIndex: 'goodsTotalNumber',
    align: 'center'
  },
  {
    title: '合计金额',
    dataIndex: 'goodsTotalPrice',
    align: 'center',
    render: (text: any) => (
      <span>￥{text}</span>
    )
  }
]
// 搜索组件
interface GoodsSerachProps extends FormComponentProps {
  searchParams: any
}
interface GoodsSerachState {
  goodsTypeList: any
}

class GoodsSerach extends RootComponent<GoodsSerachProps, GoodsSerachState> {
  constructor (props: GoodsSerachProps) {
    super(props)
    this.state = {
      goodsTypeList: []
    }
  }

  componentDidMount = () => {
    this.axios.request(this.api.ApiGetGoodsType, {}).then(({ data }) => {
      data.unshift({ name: '全部', id: '' })
      goodsTypeList = data
      this.setState({
        goodsTypeList
      })
    })
  }

  // 搜索商品
  handleSearch = () => {
    const { goodsTitle, goodsTypeId } = this.props.form.getFieldsValue()
    const searchParams = {
      goodsTitle,
      goodsTypeId
    }
    this.props.searchParams(searchParams)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { goodsTypeList } = this.state
    return (
      <Row>
        <Col style={{ lineHeight: '32px' }} span={10}>输入搜索：
          {getFieldDecorator('goodsTitle')(<Input placeholder='输入商品名称' />)}
        </Col>
        <Col style={{ lineHeight: '32px' }} span={10}>商品类型：
          {getFieldDecorator('goodsTypeId')(
            <Select placeholder="选择商品类型">
              {goodsTypeList.map((item: any, index: number) => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
              )}
            </Select>
          )}
        </Col>
        <Col span={4}>
          <Button type='primary' onClick={this.handleSearch}>搜索</Button>
        </Col>
      </Row>
    )
  }
}
const GoodsSerachComponent = Form.create<GoodsSerachProps>()(GoodsSerach)
// 已选择商品组件
interface YetGoodsListProps extends FormComponentProps {
  goodsList: any
  priceList?: any
  history: any
  shopId: number
  shopName: string
}
interface YetGoodsListState {
  priceList: any
  yetGoodsList: any
}
class YetGoodsList extends RootComponent<YetGoodsListProps, YetGoodsListState> {
  constructor (props: YetGoodsListProps) {
    super(props)
    this.state = {
      yetGoodsList: [],
      priceList: this.props.priceList || [{ index: 1, goodsTotalNumber: 0, goodsTotalPrice: 0.00 }]
    }
  }

  componentDidMount = () => {
    this.axios.request(this.api.ApiGetGoodsType, {}).then(({ data }) => {
      goodsTypeList = data
    })
  }

  // 添加/修改商品数量
  handleAddGoodsNumbers = (e: any, item: any, type?: string) => {
    yetGoodsList.map((item: any) => {
      item.isIput = false
    })
    if (type) {
      item.isIput = true
    } else {
      const goodsNum = this.props.form.getFieldsValue(['goodsNum'])
      item.goodsNum = goodsNum.goodsNum
      let goodsTotalNumber = 0
      let goodsTotalPrice = 0

      for (let i = 0; i < yetGoodsList.length; i++) {
        if (yetGoodsList[i].goodsNum > 0) {
          goodsTotalNumber += Number(yetGoodsList[i].goodsNum)
          goodsTotalPrice += Number(yetGoodsList[i].purchasePrice) * yetGoodsList[i].goodsNum
        }
      }
      this.setState({
        priceList: [{ index: 1, goodsTotalNumber, goodsTotalPrice }]
      })
    }

    this.setState({
      yetGoodsList
    })
  }

  // 删除已选择商品
  handleDeleteGoodsNumbers = (e: any, item: any) => {
    yetGoodsList.splice(yetGoodsList.findIndex((i: any) => i === item), 1)
    const goodsNum = this.props.form.getFieldsValue(['goodsNum'])
    item.goodsNum = goodsNum.goodsNum
    let goodsTotalNumber = 0
    let goodsTotalPrice = 0

    for (let i = 0; i < yetGoodsList.length; i++) {
      if (yetGoodsList[i].goodsNum > 0) {
        goodsTotalNumber += Number(yetGoodsList[i].goodsNum)
        goodsTotalPrice += Number(yetGoodsList[i].purchasePrice) * yetGoodsList[i].goodsNum
      }
    }
    this.setState({
      priceList: [{ index: 1, goodsTotalNumber, goodsTotalPrice }],
      yetGoodsList
    })
  }

  // 添加采购订单
  handleAddPurchaseOrder = () => {
    const { shopId } = this.props
    let flag = false
    const orderGoods = yetGoodsList.map((item: any, index: number) => {
      if (item.goodsNum <= 0) {
        flag = true
      }
      const obj = goodsTypeList.find((i: any) => i.name === item.goodsType)
      return {
        goodsId: item.goodsId,
        goodsTitle: item.goodsTitle,
        goodsNum: item.goodsNum,
        goodsType: obj.id,
        purchasePrice: item.purchasePrice
      }
    })
    if (flag) {
      this.$message.warning('商品数量不能为0')
      return
    }
    const data = {
      orderGoods,
      shopId: shopId || HttpUtil.parseUrl(window.location.href).shopId
    }
    this.axios.request(this.api.ApiAddPurchaseOrder, data).then(({ data }) => {
      yetGoodsList = []
      this.$message.success('操作成功')
      this.props.history.push('/purchase-management/purchaseList')
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { goodsList, shopName } = this.props
    const { priceList } = this.state
    const goodscolumns = [
      {
        title: '商品ID',
        dataIndex: 'goodsId',
        align: 'center'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsTitle',
        align: 'center'
      },
      {
        title: '商品类型',
        dataIndex: 'goodsType',
        align: 'center'
      },
      {
        title: '商品采购价',
        dataIndex: 'purchasePrice',
        align: 'center',
        render: (text: string) => (
          <span>￥{text}</span>
        )
      },
      {
        title: '采购数量',
        dataIndex: 'goodsNum',
        align: 'center',
        render: (text: string, record: any, index: number) => {
          return (
            <span>
              {!record.isIput &&
                <span>
                  {text}
                  <Button type='link' onClick={(e) => this.handleAddGoodsNumbers(e, record, 'add')}>添加</Button>
                  <Button type='link' onClick={(e) => this.handleDeleteGoodsNumbers(e, record)}>删除</Button>
                  {/* {getFieldDecorator(`goodsNumbers${index}`, {
              initialValue: text || ''
            })(<Input />)} */}
                </span>
              }
              {record.isIput &&
                <span>
                  {getFieldDecorator('goodsNum', {
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/\D/g, '')
                    },
                    initialValue: text || ''
                  })(<Input />)}
                  <Button type='link' onClick={(e) => this.handleAddGoodsNumbers(e, record)}>完成</Button>
                </span>
              }
            </span>
          )
        }
      }
    ]
    return (
      <div>
        {shopName &&
          <div>
            <Col className='selectGoods-left' span={3}>
              <div className='title'>采购门店</div>
            </Col>
            <Col span={20} className='selectGoods-right'>
              <Row className='selectGoods-right-content' style={{ padding: '0px 0 80px 30px' }}>
                <Row className='selectGoods-right-content-table' style={{ fontSize: '20px', fontWeight: 700, marginTop: '40px' }}>
                  {shopName}
                </Row>
              </Row>

            </Col>
          </div>
        }
        <Col className='selectGoods-left' span={3}>
          <div className='title'>已选择采购商品</div>
        </Col>
        <Col span={20} className='selectGoods-right'>
          <Row className='selectGoods-right-content'>

            <Row className='selectGoods-right-content-table'>
              <Table
                dataSource={yetGoodsList}
                columns={goodscolumns as any}
                bordered
                rowKey={({ index }: any) => index}
                pagination={false}
              />
            </Row>

          </Row>

        </Col>
        <Col className='selectGoods-left' span={3}>
          <div className='title'>费用合计</div>
        </Col>
        <Col span={20} className='selectGoods-right'>
          <Row className='selectGoods-right-content'>

            <Row className='selectGoods-right-content-table'>
              <Table
                dataSource={priceList}
                columns={priceColumns as any}
                bordered
                rowKey={({ index }: any) => index}
                pagination={false}
              />
            </Row>
            <Row className='selectGoods-right-footer'>
              <Button type='primary' onClick={this.handleAddPurchaseOrder} disabled={ yetGoodsList.length <= 0 }>提交</Button>
            </Row>
          </Row>

        </Col>
      </div>
    )
  }
}
const YetGoodsListComponent = Form.create<YetGoodsListProps>()(YetGoodsList)
interface PurchaseAddState {
  current: number
  yetGoodsList: any
  priceList: any
  searchParams: any
  shopList: any
  nowShopId: number
  nowShopName: string
  shopName: string
  isImport: boolean
  errMessage: string

}
// 父组件
@hot(module)
export default class PurchaseAdd extends RootComponent<BaseProps, PurchaseAddState> {
  basiModalRef = React.createRef<BaseCommonModal>()
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: BaseProps) {
    super(props)
    this.state = {
      current: 0, // 0->选择采购门店  1->选择采购商品
      yetGoodsList: [], //  已选择商品
      priceList: [], //  费用合计
      searchParams: {}, // 搜索条件
      shopList: [], // 门店列表
      nowShopId: 0, // 当前门店ID
      shopName: '', // 当前门店名称
      nowShopName: '', // 当前门店名称
      isImport: false, // 是否是導入
      errMessage: '' // 导入错误提示
    }
  }

  componentDidMount = () => {
    yetGoodsList = []
    const { shopId, purchOrderId, type } = HttpUtil.parseUrl(window.location.href) || ''
    if (type === '1') {
      this.axios.request(this.api.ApifindPurchaseOrderInfo, { shopId, purchOrderId }).then(({ data }) => {
        data.goodsList.map((item: any, index: number) => {
          item.index = index + 1
        })
        yetGoodsList = data.goodsList
        this.setState({
          yetGoodsList,
          current: 1,
          shopName: data.shopName,
          priceList: [{ index: 1, goodsTotalNumber: data.goodsTotalNumber, goodsTotalPrice: data.goodsTotalPrice }]
        })
      })
    } else {
      this.ApiGetShopList()
    }
  }

  // 获取门店列表
  ApiGetShopList = () => {
    this.axios.request(this.api.ApiSelectShopPc, { name: '' }).then(({ data }) => {
      this.setState({
        shopList: data
      })
    })
  }

  // 选择门店
  handleSelectShop = (value: any) => {
    const { shopList } = this.state
    const item = shopList.find((t: any) => t.id === value)
    this.setState({
      nowShopId: value,
      nowShopName: item.name
    })
  }

  // 導入文件
  handleUpload = (result: any) => {
    const { code, data, errMessage } = result.data
    if (code === 200) {
      yetGoodsList = data.orderGoodsList
      this.setState({
        current: 1,
        isImport: true,
        shopName: data.shopName,
        priceList: [{ index: 1, goodsTotalNumber: data.goodsTotalNumber, goodsTotalPrice: data.goodsTotalPrice }],
        nowShopId: data.shopId
      })
    } else if (code === 401) {
      this.basiModalRef.current!.show()
      yetGoodsList = data.orderGoodsList
      this.setState({
        current: 0,
        isImport: true,
        errMessage,
        shopName: data.shopName,
        priceList: [{ index: 1, goodsTotalNumber: data.goodsTotalNumber, goodsTotalPrice: data.goodsTotalPrice }],
        nowShopId: data.shopId
      })
    }
  }

  // 确认导出
  handleConfirm = () => {
    this.setState({
      current: 1
    })
  }

  // 下一步，选择商品
  handleSelectGoods = () => {
    const { nowShopId } = this.state
    this.axios.request(this.api.ApiGetShopGoods, { shopId: nowShopId }).then(({ data }) => {

    })
    this.setState({
      current: 1
    })
  }

  // 搜索商品
  searchParams = (data: any) => {
    this.setState({
      searchParams: data
    })
  }

  // 选择商品
  handleSelectedRow = (keys: any, item: any) => {
    yetGoodsList = yetGoodsList.concat(item)
    const obj:any = {}
    yetGoodsList = yetGoodsList.reduce((cur: any, next: any) => {
      if (obj[next.goodsId]) {
        obj[next.goodsId] = ''
      } else {
        obj[next.goodsId] = obj[next.goodsId] = true && cur.push(next)
      }
      // obj[next.shopId] ? "" : obj[next.shopId] = true && cur.push(next)
      return cur
    }, [])

    yetGoodsList.map((item: any, index: number) => {
      item.goodsNum = 0
      item.index = index + 1
      item.isIput = false
      return item
    })
  }

  // 确定选择的商品
  handleConfrimGoods = () => {
    yetGoodsList = Array.from(new Set(yetGoodsList))
    this.setState({ yetGoodsList })
    setTimeout(() => {
      this.tableRef.current!.clearRowSelect()
    }, 200)
  }

  render () {
    const { type } = HttpUtil.parseUrl(window.location.href) || ''
    const { current, searchParams, shopList, nowShopId, nowShopName, priceList, shopName, isImport, errMessage } = this.state
    const params = { shopId: nowShopId, ...searchParams }
    return (
      <div id='PurchaseAdd'>
        {!(type === '1' || isImport) &&
          <div className='PurchaseAdd-head'>
            <Steps progressDot current={current}>
              <Step title="选择采购门店" />
              <Step title="选择采购商品" />
            </Steps>
          </div>
        }
        <div className='PurchaseAdd-content'>
          {current === 0 &&
            <Row className='selectShop'>
              <Col className='selectShop-left' span={3}>
                <div className='title'>选择采购门店</div>
              </Col>
              <Col span={20} className='selectShop-right'>
                <Row className='selectShop-right-content' type='flex' justify='space-between'>
                  <Col span={20}>
                    <Row>
                      <Col style={{ lineHeight: '32px' }} span={2}>请选择门店：</Col>
                      <Col span={5}>
                        <Select placeholder="选择门店" onSelect={this.handleSelectShop}>
                          {shopList.map((item: any) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                    <Row className='desc'>
                      您当前选择的门店是：<span>{nowShopName}</span>
                    </Row>

                  </Col>
                  <Col>
                    <BaseUpload action={this.api.ApiImportData} successChange={this.handleUpload}>
                      <Button type='primary'>导入采购订单</Button>
                    </BaseUpload>
                    <BaseCommonModal
                      {...this.props}
                      ref={this.basiModalRef}
                      confirm={this.handleConfirm}
                      intercept
                      text={errMessage}
                    />
                  </Col>
                </Row>
                <Row className='selectShop-right-footer'>
                  <Button type='primary' disabled={nowShopName === '' ? true : false} onClick={this.handleSelectGoods}>下一步,选择采购商品</Button>
                </Row>
              </Col>
            </Row>
          }
          {current === 1 &&
            <Row className='selectGoods'>
              {!(type === '1' || isImport) &&
                <div>
                  <Col className='selectGoods-left' span={3}>
                    <div className='title'>选择采购商品</div>
                  </Col>
                  <Col span={20} className='selectGoods-right'>
                    <Row className='selectGoods-right-content'>
                      <GoodsSerachComponent searchParams={this.searchParams} />
                      <Row className='selectGoods-right-content-table'>
                        <TableItem
                          ref={this.tableRef}
                          rowSelectionFixed
                          filterKey="goodsId"
                          bordered
                          rowKey={({ goodsId }) => goodsId}
                          URL={this.api.ApiGetShopGoods}
                          getSelectedRow={this.handleSelectedRow}
                          searchParams={params}
                          columns={columns as any}
                        />
                        <Button className='btn' onClick={this.handleConfrimGoods}>确定</Button>
                      </Row>
                    </Row>
                  </Col>
                </div>
              }
              <YetGoodsListComponent goodsList={yetGoodsList} history={this.props.history} shopId={nowShopId} shopName={type === '1' || isImport ? shopName : ''} priceList={type === '1' || isImport ? priceList : ''} />
            </Row>
          }
        </div>
      </div>
    )
  }
}
