/*
 * @description: 会员统计主页面
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-04 14:22:05
 * @LastEditTime: 2020-06-04 11:06:26
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal, BaseDowload } from 'components'
import { Row, Col, Card, Radio, DatePicker, Form, Input } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import './index.less'

const { Group, Button } = Radio
const { RangePicker } = DatePicker
const { Item } = Form

interface MemberStatisticProps extends BaseProps, FormComponentProps {
}

interface MemberStatisticState {
  isShowTime: boolean
  isRequestData: boolean
  searchParams: Object,
  xdata: Array<[]>,
  ynumber: Array<[]>,
  authTime: string,
  status: number
  // listExportParam: any,
  // trendExportParam: any
}

class MemberStatistic extends RootComponent<MemberStatisticProps, MemberStatisticState> {
  tableRef = React.createRef<TableItem<any>>()
  modalRef = React.createRef<BasicModal>()
  constructor (props: any) {
    super(props)
    this.state = {
      isShowTime: false,
      isRequestData: true,
      searchParams: {
        authTime: 'today'
      },
      xdata: [],
      ynumber: [],
      authTime: 'today',
      status: 0
      // listExportParam: {}, // 列表导出参数
      // trendExportParam: {} // 统计信息导出参数
    }
  }

  componentDidMount = () => {
    this.getData()
  }

  // 请求数据
  getData = () => {
    const { authTime, isRequestData } = this.state
    const xdata: any[] = []
    const ynumber: any[] = []
    // isRequestData && this.axios.request(this.api.getMemberStatisticsByTime, { authTime }).then(({ code, data }) => {
    this.axios.request(this.api.getMemberStatisticsByTime, { authTime }).then(({ code, data }) => {
      if (code === 200) {
        data.map((item: any) => {
          xdata.push(item.dayByDay)
          ynumber.push(item.memberNums)
        })
      }
      this.setState({
        xdata,
        ynumber
      })
    })
  }

  // 点击自定义弹出模态
  customTime = (status: number) => {
    this.setState({
      status,
      isRequestData: false
    })
    this.modalRef.current!.handleOk()
  }

  // modal确认
  handleOk = async () => {
    this.setState({ isRequestData: true })
    const { status } = this.state
    let { customTime } = this.props.form.getFieldsValue()
    customTime = `${moment(customTime[0]).format('YYYY-MM-DD')}_${moment(customTime[1]).format('YYYY-MM-DD')}`
    if (status === 1) {
      await this.setState({ authTime: customTime })
      this.getData()
    }
    status === 2 && this.setState({ searchParams: { authTime: customTime } })
    this.modalRef.current!.handleCancel()
    setTimeout(() => {
      this.setState({ isRequestData: false })
    }, 100)
  }

  // 关闭modal
  handleCancel = () => {
    this.modalRef.current!.handleCancel()
  }

  // 会员列表的搜索
  searchMemberData = async (authTime?: any) => {
    authTime = authTime.target.value
    console.log(authTime, 'authTime')
    await this.setState({
      searchParams: { authTime }
    })
    // setTimeout(() => {
    //   this.setState({ isRequestData: false })
    // }, 100)
  }

  // 会员增长情况的搜索
  searchChartData = async (authTime?: any) => {
    authTime = authTime.target.value
    await this.setState({ authTime })
    this.getData()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { isRequestData, searchParams, xdata, ynumber, authTime } = this.state
    const columns = [
      {
        title: '会员ID',
        dataIndex: 'userId',
        align: 'center'
      },
      {
        title: '会员手机号',
        dataIndex: 'memberPhone',
        align: 'center'
      },
      {
        title: '会员昵称',
        dataIndex: 'nickName',
        align: 'center'
      },
      {
        title: '会员类型',
        dataIndex: 'memberType',
        align: 'center'
      },
      {
        title: '授权/注册时间',
        dataIndex: 'authTime',
        align: 'center',
        render: (text: any) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'}</span>
        }
      },
      {
        title: '消费金额',
        dataIndex: 'orderTotalPrice',
        align: 'center'
      },
      {
        title: '订单数量',
        dataIndex: 'orderTotalAmount',
        align: 'center'
      }
    ]
    const optionUsers: any = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '10px',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false // 是否显示坐标轴刻度
          },
          // axisLabel: {
          //   show: true,
          //   interval: 0,
          //   rotate: 20, // 倾斜30度
          //   textStyle: {
          //     color: '#666',
          //     fontSize: 12,
          //     fontFamily: '微软雅黑'
          //   }
          // },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          data: xdata
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false // 是否显示坐标轴刻度
          },
          // splitNumber: 10, // 增加Y轴刻度变多
          axisLabel: {
            show: true,
            // formatter: '{value}%',
            textStyle: {
              color: '#666',
              fontSize: 12,
              fontFamily: '微软雅黑'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        }
      ],
      series: [
        {
          name: '新增会员数',
          type: 'line',
          stack: '总量',
          symbol: 'star', // 节点性状
          itemStyle: {
            normal: {
              color: '#19BC9C' // 图标颜色
            }
          },
          lineStyle: {
            normal: {
              width: 2, // 连线粗细
              color: '#278BDD' // 连线颜色
            }
          },
          smooth: true, // 折线图是趋缓的
          data: ynumber
        }
      ]
    }
    return (
      <div className='memberStatistic'>
        <div>
          <Row className='memberlist'>
            <Col span={2}>会员增长情况</Col>
            <Col span={6} offset={15}>
              {getFieldDecorator('chartauthTime', {
                initialValue: 'today'
              })(
                <Group buttonStyle="solid" onChange={this.searchChartData}>
                  <Button value='today'>今天</Button>
                  <Button value='one_week'>近7天</Button>
                  <Button value='one_month'>近30天</Button>
                  <Button value='three_month'>近90天</Button>
                  <Button value='one_year'>近一年</Button>
                  <Button onClick={() => this.customTime(1)}>自定义</Button>
                </Group>
              )}
            </Col>
            <Col span={1}>
              <BaseDowload
                title='导出报表'
                exportData
                action={this.api.getExportMemberStatistics}
                params={{ authTime }}
                fileName={'会员统计信息导出数据'}
              />
            </Col>
          </Row>
          <div className='memberchart'>
            <ReactEcharts option={optionUsers} />
            <p className='charttitle'>新增会员数</p>
          </div>
        </div>
        <Row className='memberlist'>
          <Col span={2}>会员列表</Col>
          <Col span={6} offset={15}>
            {getFieldDecorator('memberauthTime', {
              initialValue: 'today'
            })(
              <Group buttonStyle="solid" onChange={this.searchMemberData}>
                <Button value='today'>今天</Button>
                <Button value='one_week'>近7天</Button>
                <Button value='one_month'>近30天</Button>
                <Button value='three_month'>近90天</Button>
                <Button value='one_year'>近一年</Button>
                <Button onClick={() => this.customTime(2)}>自定义</Button>
              </Group>
            )}
          </Col>
          <Col span={1}>
            <BaseDowload
              title='导出报表'
              exportData
              action={this.api.getExportMemberList}
              params={searchParams}
              fileName={'会员列表导出数据'}
            />
          </Col>
        </Row>
        <div className='tabledata'>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="index"
            bordered
            // isRequestData={isRequestData}
            rowSelection={false}
            rowKey={({ index }) => index}
            URL={this.api.getMemberListByTime}
            searchParams={searchParams}
            columns={columns as any}
          />
        </div>
        <BasicModal
          ref={this.modalRef}
          title='自定义日期筛选'
          width={'30%'}
          publicmodalstyl={'modal'}
          destroyOnClose={true}
        >
          <Row>
            <Col span={24}>
              <Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label='选择日期'>
                {getFieldDecorator('customTime')(<RangePicker allowClear/>)}
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

export default Form.create<MemberStatisticProps>()(MemberStatistic)
