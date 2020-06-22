/*
 * @description: 系统首页
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:09:19
 * @LastEditTime: 2020-03-20 10:55:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from 'components'
import ReactEcharts from 'echarts-for-react'
import 'echarts-liquidfill/src/liquidFill.js'
import { Row, Col, Card, Radio, DatePicker, Form } from 'antd'
import { hot } from 'react-hot-loader'

import moment from 'moment'

import './index.styl'
import clock from 'assets/images/system/clock.png'
import goods from 'assets/images/system/goods.png'
import order from 'assets/images/system/order.png'
import vip from 'assets/images/system/vip.png'
import shop from 'assets/images/system/shop.png'
import purchase from 'assets/images/system/purchase.png'
import ad from 'assets/images/system/ad.png'
import empty from 'assets/images/empty.png'

import { shopOptions, moneyOptions, orderOptions, salesOptions1, salesOptions2, goodsOptions, vipOptions } from './Echarts'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
interface HomeProps extends BaseProps, FormComponentProps {}
interface HomeState {
  statisticData: {
    shopNum: KeyValue
    businessLimit: KeyValue
    orderWebNum: KeyValue
    consumeForm: KeyValue
    goodsTopWList: KeyValue[]
    nickMember: KeyValue
  }
}

const { Group, Button } = Radio
const { RangePicker } = DatePicker
const { Item, create } = Form

const date = moment(new Date()).format('YYYY-MM-DD')
let week = ''
;(() => {
  const d = moment().get('day')
  switch (d) {
    case 0:
      week = '星期日'
      break
    case 1:
      week = '星期一'
      break
    case 2:
      week = '星期二'
      break
    case 3:
      week = '星期三'
      break
    case 4:
      week = '星期四'
      break
    case 5:
      week = '星期五'
      break
    default: week = '星期六'
      break
  }
})()

const EmptyTable = (props: any) => {
  return (
    <div className="placeholder" style={{ padding: '0.5rem 0' }}>
      <img src={empty}></img>
      <p>{props.tips || '暂无数据'}</p>
    </div>
  )
}

@hot(module)
class Home extends RootComponent<HomeProps, HomeState> {
  modalRef = React.createRef<BasicModal>()
  echartsShopRef: any = null
  echartsMoneyRef: any = null
  echartsOrderRef: any = null
  echartsSales1Ref: any = null
  echartsSales2Ref: any = null
  echartsGoodsRef: any = null
  echartsVipRef: any = null
  customTime: moment.Moment[] = []
  filterType: number = 0

  constructor (props: HomeProps) {
    super(props)
    this.state = {
      statisticData: {
        shopNum: {},
        businessLimit: {},
        orderWebNum: {},
        consumeForm: {},
        goodsTopWList: [],
        nickMember: {}
      }
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.getSystemData('today')
    }, 1000)
  }

  getSystemData = (latelyDay: string) => {
    const {
      axios: { request },
      api: { homeGetSystemHomeInfo },
      filterType,
      customTime
    } = this
    const params = {
      latelyDay,
      startTime: '',
      endTime: ''
    }
    if (filterType < 0 && customTime.length) {
      params.startTime = moment(customTime[0]).format('YYYY-MM-DD')
      params.endTime = moment(customTime[1]).format('YYYY-MM-DD')
    } else {
      delete params.startTime
      delete params.endTime
    }
    request(homeGetSystemHomeInfo, params).then(({ data }) => {
      const {
        shopNum: { allShop, offLineShop, onLineShop },
        businessLimit: { businessReceipt, realReceipt, returnReceipt },
        orderWebNum: { activeNum, cancelNum },
        consumeForm: { totalReceipt, hereReceipt, outerReceipt, totalNum, hereNum, outerNum },
        goodsTopWList,
        nickMember: { totalMembers, newMembers }
      } = data
      const { legendData, listData, color } = this.setGoodsEchartsOptions(goodsTopWList)
      shopOptions.series[0].data[0].value = onLineShop
      shopOptions.series[0].data[1].value = offLineShop
      moneyOptions.series[0].data[0].value = realReceipt
      moneyOptions.series[0].data[1].value = returnReceipt
      orderOptions.series[0].data[0].value = activeNum
      orderOptions.series[0].data[1].value = cancelNum
      salesOptions1.series[0].data[0].value = hereReceipt
      salesOptions1.series[0].data[0].totalNum = totalReceipt
      salesOptions1.series[0].data[1].value = outerReceipt
      salesOptions2.series[0].data[0].value = hereNum
      salesOptions2.series[0].data[0].totalNum = totalNum
      salesOptions2.series[0].data[1].value = outerNum
      goodsOptions.color = color
      goodsOptions.legend.data = legendData
      goodsOptions.series[0].data = listData
      vipOptions.series[0].data[0].value = totalMembers
      vipOptions.series[0].data[1].value = newMembers
      this.echartsShopRef && this.echartsShopRef.getEchartsInstance().setOption(shopOptions)
      this.echartsMoneyRef && this.echartsMoneyRef.getEchartsInstance().setOption(moneyOptions)
      this.echartsOrderRef && this.echartsOrderRef.getEchartsInstance().setOption(orderOptions)
      this.echartsSales1Ref && this.echartsSales1Ref.getEchartsInstance().setOption(salesOptions1)
      this.echartsSales2Ref && this.echartsSales2Ref.getEchartsInstance().setOption(salesOptions2)
      this.echartsGoodsRef && this.echartsGoodsRef.getEchartsInstance().setOption(goodsOptions)
      this.echartsVipRef && this.echartsVipRef.getEchartsInstance().setOption(vipOptions)
      this.setState({ statisticData: data })
    })
  }

  transformRequestParams = (t: number) => {
    this.filterType = t
    if (t < 0) {
      this.showModal()
      return
    }
    // 今日today/昨天yesterday/近7天one_week/近30天one_month/近90天three_month/近一年one_year
    let latelyDay: string = ''
    switch (t) {
      case 0:
        latelyDay = 'today'
        break
      case 1:
        latelyDay = 'yesterday'
        break
      case 7:
        latelyDay = 'one_week'
        break
      case 30:
        latelyDay = 'one_month'
        break
      case 90:
        latelyDay = 'three_month'
        break
      case 365:
        latelyDay = 'one_year'
        break
      default: latelyDay = ''
        break
    }
    this.getSystemData(latelyDay)
  }

  setGoodsEchartsOptions (list: any[]) {
    const legendData: any[] = []
    const listData: any[] = []
    const colorList = ['#45B5E5', '#FBD436', '#4ECB73', '#975FE5', '#36CBCB']
    const color: string[] = []
    list.forEach(({ goodsAmount, goodsName }, i) => {
      const c = colorList[i]
      color.push(c)
      legendData.push({ name: goodsName })
      listData.push(
        {
          value: goodsAmount,
          name: goodsName,
          emphasis: {
            itemStyle: {
              color: c
            }
          }
        }
      )
    })
    return { legendData, listData, color }
  }

  handleOk = () => {
    const { customTime } = this.props.form.getFieldsValue()
    this.customTime = customTime
    this.getSystemData('')
    this.closeModal()
  }

  goCustomModule = (path: string) => this.props.history.push(path)

  showModal = () => this.modalRef.current!.handleOk()

  closeModal = () => this.modalRef.current!.handleCancel()

  render () {
    const {
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { home }, hasAuthority }
      },
      state: {
        statisticData: { shopNum, businessLimit, orderWebNum, consumeForm, goodsTopWList, nickMember }
      },
      transformRequestParams,
      handleOk,
      closeModal,
      goCustomModule
    } = this
    const { allShop = 0, offLineShop = 0, onLineShop = 0 } = shopNum
    const { businessReceipt = 0, realReceipt = 0, returnReceipt = 0 } = businessLimit
    const { activeNum = 0, cancelNum = 0 } = orderWebNum
    const { hereReceipt = 0, outerReceipt = 0, hereNum = 0, outerNum = 0 } = consumeForm
    const { totalMembers = 0, newMembers = 0 } = nickMember
    const hasShopData = shopNum.dataNull > 1
    const hasMoneyData = businessLimit.dataNull > 1
    const hasOrderData = orderWebNum.dataNull > 1
    const hasSalesData = consumeForm.dataNull > 1
    const hasGoodsData = goodsTopWList.length > 0
    const hasVipData = nickMember.dataNull > 1
    const [sOrder, sVip, sShop, sPur, sAd]: any = hasAuthority(home)
    return (
      <div id="system_container">
        <Row className="filter_wrapper" type="flex" align="middle" justify="space-between">
          <Col className="time">
            <img src={clock} alt=""/>&nbsp;&nbsp;{date} {week}
          </Col>
          <Col>
            <Group buttonStyle="solid" defaultValue={0} onChange={e => transformRequestParams(e.target.value)}>
              <Button value={0}>今天</Button>
              <Button value={1}>昨天</Button>
              <Button value={7}>近7天</Button>
              <Button value={30}>近30天</Button>
              <Button value={90}>近90天</Button>
              <Button value={365}>近一年</Button>
              <Button value={-1}>自定义</Button>
            </Group>
          </Col>
        </Row>
        <Row className="statistic_wrapper">
          <Row className="card_item" type="flex" justify="space-between">
            <Col>
              <Card>
                {
                  !hasShopData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasShopData &&
                  <Row type="flex" justify="space-between">
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">门店</Col>
                        <Col className="statistic_num">{allShop}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" className="detail">
                        <Col><span className="circle yellow"></span> 在线</Col>
                        <Col>{onLineShop}家</Col>
                      </Row>
                      <Row type="flex" justify="space-between">
                        <Col><span className="circle gray"></span> 离线</Col>
                        <Col>{offLineShop}家</Col>
                      </Row>
                    </Col>
                    <Col span={12} className="echarts_wrapper" >
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsShopRef = e}
                        style={{ width: 200, height: '100%' }}
                        option={shopOptions} />
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
            <Col>
              <Card>
                {
                  !hasMoneyData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasMoneyData &&
                  <Row type="flex" justify="space-between">
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">营业总额</Col>
                        <Col className="statistic_num">{businessReceipt}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" className="detail">
                        <Col><span className="circle blue"></span> 实收金额</Col>
                        <Col>{realReceipt}</Col>
                      </Row>
                      <Row type="flex" justify="space-between">
                        <Col><span className="circle gray"></span> 退单金额</Col>
                        <Col>{returnReceipt}</Col>
                      </Row>
                    </Col>
                    <Col span={12} className="echarts_wrapper" >
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsMoneyRef = e}
                        style={{ width: 200, height: '100%' }}
                        option={moneyOptions} />
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
          </Row>
          <Row className="card_item" type="flex" justify="space-between">
            <Col>
              <Card>
                {
                  !hasOrderData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasOrderData &&
                  <Row type="flex" justify="space-between">
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">订单</Col>
                        <Col className="statistic_num">{orderWebNum.totalNum}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" className="detail">
                        <Col><span className="circle green"></span> 有效订单</Col>
                        <Col>{activeNum}</Col>
                      </Row>
                      <Row type="flex" justify="space-between">
                        <Col><span className="circle gray"></span> 取消订单</Col>
                        <Col>{cancelNum}</Col>
                      </Row>
                    </Col>
                    <Col span={12} className="echarts_wrapper">
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsOrderRef = e}
                        style={{ width: 200, height: '100%' }}
                        option={orderOptions} />
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
            <Col>
              <Card className="sales_money_card">
                {
                  !hasSalesData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasSalesData &&
                  <Row className="sales_money">
                    <Col span={12} className="echarts_wrapper">
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsSales1Ref = e}
                        style={{ width: 140, height: '100%' }}
                        option={salesOptions1}
                      />
                      <Row className="sales_detail">
                        <Row type="flex" justify="center">
                          <Col><span className="circle red"></span> 堂食金额: {hereReceipt}</Col>
                        </Row>
                        <Row type="flex" justify="center">
                          <Col><span className="circle blue2"></span> 外带金额: {outerReceipt}</Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col span={12} className="echarts_wrapper">
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsSales2Ref = e}
                        style={{ width: 140, height: '100%' }}
                        option={salesOptions2}
                      />
                      <Row className="sales_detail">
                        <Row type="flex" justify="center">
                          <Col><span className="circle red"></span> 堂食订单: {hereNum}</Col>
                        </Row>
                        <Row type="flex" justify="center">
                          <Col><span className="circle blue2"></span> 外带订单: {outerNum}</Col>
                        </Row>
                      </Row>
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
          </Row>
          <Row className="card_item" type="flex" justify="space-between">
            <Col>
              <Card>
                {
                  !hasGoodsData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasGoodsData &&
                  <Row>
                    <Col className="goods_echarts">
                      <Row className="desc">
                        <Col className="category_name">销售商品TOP5</Col>
                      </Row>
                    </Col>
                    <Col className="echarts_wrapper sales_goods" >
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsGoodsRef = e}
                        style={{ width: '90%', height: '100%' }}
                        option={goodsOptions} />
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
            <Col>
              <Card>
                {
                  !hasVipData &&
                  <Row type="flex" justify="center">
                    <EmptyTable />
                  </Row>
                }
                {
                  hasVipData &&
                  <Row type="flex" justify="space-between">
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">总会员</Col>
                        <Col className="statistic_num">{totalMembers}</Col>
                      </Row>
                      <Row className="desc">
                        <Col className="category_name">新增会员</Col>
                        <Col className="statistic_num">{newMembers}</Col>
                      </Row>
                    </Col>
                    <Col span={12} className="echarts_wrapper" >
                      <ReactEcharts
                        // eslint-disable-next-line no-return-assign
                        ref={(e: any) => this.echartsVipRef = e}
                        style={{ width: 200, height: '100%' }}
                        option={vipOptions} />
                    </Col>
                  </Row>
                }
              </Card>
            </Col>
          </Row>
        </Row>
        <Row className="quick_entry_wrapper">
          <Card title="运营快捷入口">
            <ul>
              {/* <li className="entry_item">
                <img src={goods} alt=""/>
                <p>添加商品</p>
              </li> */}
              {
                sOrder &&
                <li className="entry_item" onClick={() => goCustomModule('/sale-management/list')}>
                  <img src={order} alt=""/>
                  <p>销售订单列表</p>
                </li>
              }
              {
                sVip &&
                <li className="entry_item" onClick={() => goCustomModule('/vip-management/list')}>
                  <img src={vip} alt=""/>
                  <p>会员管理</p>
                </li>
              }
              {
                sShop &&
                <li className="entry_item" onClick={() => goCustomModule('/shop-management/store')}>
                  <img src={shop} alt=""/>
                  <p>添加门店</p>
                </li>
              }
              {
                sPur &&
                <li className="entry_item" onClick={() => goCustomModule('/purchase-management/purchaseList')}>
                  <img src={purchase} alt=""/>
                  <p>采购订单列表</p>
                </li>
              }
              {
                sAd &&
                <li className="entry_item" onClick={() => goCustomModule('/operation-management/advertisement')}>
                  <img src={ad} alt=""/>
                  <p>广告管理</p>
                </li>
              }
            </ul>
          </Card>
        </Row>
        <BasicModal
          ref={this.modalRef}
          title='自定义日期筛选'
          width={'30%'}
          publicmodalstyl={'modal'} >
          <Row>
            <Col span={24}>
              <Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}>
                {getFieldDecorator('customTime')(<RangePicker allowClear />)}
              </Item>
            </Col>
          </Row>
          <Row className='modalbtn'>
            <Col>
              <Button onClick={handleOk} className='handleOk btn'>确定</Button>
              <Button onClick={closeModal} className='handleCancel btn'>取消</Button>
            </Col>
          </Row>
        </ BasicModal>
      </div>
    )
  }
}

export default create<HomeProps>()(Home)
