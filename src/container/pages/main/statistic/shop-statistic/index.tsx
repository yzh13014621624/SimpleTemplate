/*
 * @description: 门店统计
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-15 16:04:38
 * @LastEditTime: 2020-06-04 11:06:54
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal, BaseDowload } from 'components'
import ReactEcharts from 'echarts-for-react'
import { Row, Col, Card, Radio, Form, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { BaseProps } from 'typings/global'
import { moneyOptions, orderOptions } from 'pages/main/home/system/Echarts'
import moment from 'moment'
import './index.styl'

const { Group, Button } = Radio
const { Item } = Form
const { RangePicker } = DatePicker

const shopOptions = {
  color: ['#FACC14', '#E9E9E9'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}: {b} {c}'
  },
  series: [{
    name: '门店',
    type: 'pie',
    radius: ['50%', '80%'],
    avoidLabelOverlap: true,
    hoverOffset: 8,
    label: {
      show: false
    },
    data: [
      {
        value: 500,
        name: '在线门店',
        emphasis: {
          itemStyle: {
            color: '#FACC14'
          }
        }
      },
      {
        value: 100,
        name: '离线门店',
        emphasis: {
          itemStyle: {
            color: '#E9E9E9'
          }
        }
      }
    ]
  }]
}

interface FormProps extends BaseProps, FormComponentProps{}

interface ShopStatisticState{
  control: number
  statisticData: any
  shopPriceList: Array<[]>,
  packData: Array<[]>,
  tangData: Array<[]>,
  monthData: Array<[]>,
  rankingExportParam: any, // 门店销售额导出参数
  // trendExportParam: any // 门店销售额趋势导出参数
  turnoverTotalParam: any, // 营业额总计导出参数
}

class Account extends RootComponent<FormProps, ShopStatisticState> {
  modalRef: any = React.createRef<BasicModal>()
  echartsMoneyRef: any = null
  echartsOrderRef: any = null
  filterType: number = 0
  customTime: moment.Moment[] = []
  constructor (props: FormProps) {
    super(props)
    this.state = {
      control: 0, // 确定打开模态框的按钮，0为销售额趋势一行的自定义，1为营业额总计的自定义
      statisticData: {
        businessLimit: {
          businessReceipt: 0,
          realReceipt: 0,
          returnReceipt: 0
        },
        orderWebNum: {
          totalNum: 0,
          activeNum: 0,
          cancelNum: 0
        }
      },
      shopPriceList: [], // 门店销售额排名列表
      packData: [], // 外带列表
      tangData: [], // 堂食列表
      monthData: [],
      rankingExportParam: {
        latelyDay: 'today'
      },
      turnoverTotalParam: {
        latelyDay: 'today'
      }
    }
  }

  componentDidMount = () => {
    this.requestTurnover()
    this.saleEcharts(undefined)
  }

  // 销售额趋势近期搜索
  turnoverTitleBtnValue = (value: any) => {
    this.saleEcharts(value)
  }

  // 销售额图表数据请求
  saleEcharts = (latelyDay: any = 'today') => {
    if (typeof latelyDay === 'object') {
      latelyDay = { ...latelyDay }
    } else if (typeof latelyDay === 'string') {
      latelyDay = { latelyDay }
    }
    this.axios.request(this.api.getGoodsStatisList, latelyDay).then(({ code, data }) => {
      let monthData: any[] = []
      const packData: any[] = []
      const tangData: any[] = []
      if (code === 200) {
        data.pack.map((item: any) => {
          packData.push(item.price)
          monthData.push(item.month)
        })
        data.tang.map((item: any) => {
          tangData.push(item.price)
          monthData.push(item.month)
        })
        monthData = Array.from(new Set(monthData))
        this.setState({
          shopPriceList: data.shopPrice,
          packData,
          tangData,
          monthData,
          rankingExportParam: latelyDay
        })
      }
    })
  }

  // 销售额趋势自定义按钮
  trendCustomBtn = () => {
    this.modalRef.current!.handleOk()
    this.setState({ control: 0 })
  }

  // 营业额总计近期搜索
  trendTitleBtnValue = (value: any) => {
    this.requestTurnover(value)
    this.setState({
      turnoverTotalParam: {
        latelyDay: value
      }
    })
  }

  // 营业额数据请求
  requestTurnover = (latelyDay?: number) => {
    const {
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
    this.axios.request(this.api.shopStatisticPostBusinessReceipt, params).then(({ data }) => {
      const { businessLimit, orderWebNum } = data
      const { realReceipt, returnReceipt } = businessLimit
      const { activeNum, cancelNum } = orderWebNum
      moneyOptions.series[0].data[0].value = realReceipt
      moneyOptions.series[0].data[1].value = returnReceipt
      orderOptions.series[0].data[0].value = activeNum
      orderOptions.series[0].data[1].value = cancelNum
      this.echartsMoneyRef && this.echartsMoneyRef.getEchartsInstance().setOption(moneyOptions)
      this.echartsOrderRef && this.echartsOrderRef.getEchartsInstance().setOption(orderOptions)
      this.setState({ statisticData: data })
    })
  }

  // 营业额总计自定义按钮
  totalCustomBtn = (t: number) => {
    this.modalRef.current!.handleOk()
    this.filterType = t
    this.setState({
      control: 1
    })
  }

  // 自定义事件确定按钮
  handleOk = () => {
    const { authTime1 } = this.props.form.getFieldsValue()
    const { control } = this.state
    this.customTime = authTime1
    const startTime = moment(authTime1[0]).format('YYYY-MM-DD')
    const endTime = moment(authTime1[1]).format('YYYY-MM-DD')
    if (control === 0) {
      this.saleEcharts({ startTime, endTime })
    } else if (control === 1) {
      this.requestTurnover()
      this.setState({
        turnoverTotalParam:{
          startTime,
          endTime
        }
      })
    }
    this.modalRef.current!.handleCancel()
  }

  // 自定义事件取消按钮
  handleCancel = () => {
    this.modalRef.current!.handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { businessLimit, orderWebNum } = this.state.statisticData
    const { shopPriceList, packData, tangData, monthData, rankingExportParam, turnoverTotalParam } = this.state
    const setOption: any = {
      legend: {},
      tooltip: {},
      xAxis: {
        type: 'category',
        data: monthData
      },
      yAxis: {},
      series: [
        {
          name: '外带',
          type: 'bar',
          barWidth: '20px',
          itemStyle: {
            normal: {
              color: '#3BA1FF' // 图标颜色
            }
          },
          data: packData
        },
        {
          name: '堂食',
          type: 'bar',
          barWidth: '20px',
          itemStyle: {
            normal: {
              color: '#FF7D27' // 图标颜色
            }
          },
          data: tangData
        }
      ]
    }
    return (
      <div id = "shop-statistic">
        <Row>
          <Row className="trend-turnover">
            <Row className="trend-turnover-title" type="flex" align="middle" justify="space-between">
              <Col>销售额总计</Col>
            </Row>
            <Row className="trend-turnover-list-title" type="flex" align="middle" justify="space-between">
              <Col className="trend-turnover-list-sale">销售额趋势</Col>
              <Col>
                <Group buttonStyle="solid" defaultValue={0}>
                  <Button value={0} onClick = {() => this.turnoverTitleBtnValue('today')}>今日</Button>
                  <Button value={7} onClick = {() => this.turnoverTitleBtnValue('one_week')}>近7天</Button>
                  <Button value={30} onClick = {() => this.turnoverTitleBtnValue('one_month')}>近30天</Button>
                  <Button value={90} onClick = {() => this.turnoverTitleBtnValue('three_month')}>近90天</Button>
                  <Button value={365} onClick = {() => this.turnoverTitleBtnValue('one_year')}>近1年</Button>
                  <Button value='5' onClick = {this.trendCustomBtn}>自定义</Button>
                </Group>
              </Col>
            </Row>
            <Row type='flex' justify="space-between" className='salestatistic'>
              <Col span={18}>
                <ReactEcharts option={setOption} />
                <span className='trendExportstyle'>
                  <BaseDowload
                    title='导出报表'
                    exportData
                    action={this.api.postExportVolumeTrend}
                    params={rankingExportParam}
                    fileName={'销售额排名数据'}
                    // handleHide={this.handleHide}
                  />
                </span>
              </Col>
              <Col span={6}>
                <Row>
                  <Col className='title' span={18}>门店销售额排名</Col>
                  <Col span={6} style={{ paddingTop: '10px' }}>
                    <BaseDowload
                      title='导出报表'
                      exportData
                      action={this.api.postExportSalesVolume}
                      params={rankingExportParam}
                      fileName={'营销额趋势数据'}
                    />
                  </Col>
                </Row>
                {
                  shopPriceList.map((item: any, index: number) => (
                    <Row className='line'><Col className={index <= 3 ? 'circlewhite' : 'circlebrack'} span={2}>{index + 1}</Col><Col span={6} className='setfontsize'>{item.shopName}</Col><Col span={5} className='setfontsize'>{item.price}</Col></Row>
                  ))
                }
              </Col>
            </Row>
          </Row>
          <Row className="total-turnover">
            <Row className="total-turnover-title" type="flex" align="middle" justify="space-between">
              <Col>营业额总计</Col>
              <Col>
                <Group buttonStyle="solid" defaultValue={0}>
                  <Button value={0} onClick = {() => this.trendTitleBtnValue('today')}>今日</Button>
                  <Button value={7} onClick = {() => this.trendTitleBtnValue('one_week')}>近7天</Button>
                  <Button value={30} onClick = {() => this.trendTitleBtnValue('one_month')}>近30天</Button>
                  <Button value={90} onClick = {() => this.trendTitleBtnValue('three_month')}>近90天</Button>
                  <Button value={365} onClick = {() => this.trendTitleBtnValue('one_year')}>近1年</Button>
                  <Button value='5' onClick = {() => this.totalCustomBtn(-1)}>自定义</Button>
                </Group>
                <BaseDowload
                  className='turnoverBaseDowloadBtn'
                  title='导出列表'
                  exportData
                  action={this.api.postExportBusinessReceipt}
                  params={turnoverTotalParam}
                  fileName={'营业总额数据'}
                />
              </Col>
            </Row>
            <Row className="card_item" type="flex" justify="space-between">
              <Col>
                <Card>
                  <Row>
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">营业总额</Col>
                        <Col className="statistic_num">{businessLimit.businessReceipt}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" className="detail">
                        <Col><span className="circle blue"></span> 实收金额</Col>
                        <Col>{businessLimit.realReceipt}</Col>
                      </Row>
                      <Row type="flex" justify="space-between">
                        <Col><span className="circle gray"></span> 退单金额</Col>
                        <Col>{businessLimit.returnReceipt}</Col>
                      </Row>
                    </Col>
                    <Col span={14} className="echarts_wrapper" >
                      <ReactEcharts
                        ref={(e: any) => { this.echartsMoneyRef = e }}
                        style={{ width: 200, height: '100%' }}
                        option={moneyOptions} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Row>
                    <Col span={10}>
                      <Row className="desc">
                        <Col className="category_name">订单</Col>
                        <Col className="statistic_num">{orderWebNum.totalNum}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" className="detail">
                        <Col><span className="circle blue"></span> 有效订单</Col>
                        <Col>{orderWebNum.activeNum}</Col>
                      </Row>
                      <Row type="flex" justify="space-between">
                        <Col><span className="circle gray"></span> 取消订单</Col>
                        <Col>{orderWebNum.cancelNum}</Col>
                      </Row>
                    </Col>
                    <Col span={14} className="echarts_wrapper" >
                      <ReactEcharts
                        ref={(e: any) => { this.echartsOrderRef = e }}
                        style={{ width: 200, height: '100%' }}
                        option={orderOptions} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Row>
        </Row>
        <BasicModal
          ref={this.modalRef}
          title='自定义日期筛选'
          width={'30%'}
          publicmodalstyl={'modal'}
          destroyOnClose={true}>
          <Row>
            <Col span={24}>
              <Item
                label="选择日期"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}>
                {getFieldDecorator('authTime1')(<RangePicker allowClear/>)}
              </Item>
            </Col>
          </Row>
          <Row className='modalbtn'>
            <Col>
              <Button onClick={this.handleOk} className='handleOk btn'>确定</Button>
              <Button onClick={this.handleCancel} className='handleCancel btn'>取消</Button>
            </Col>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create()(Account)
