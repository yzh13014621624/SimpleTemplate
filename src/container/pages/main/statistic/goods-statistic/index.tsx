/*
 * @description: 报表中心-商品统计
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-04 14:17:44
 * @LastEditTime: 2019-09-19 16:27:49
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem, BasicModal, BaseDowload } from 'components'
import { Row, Col, Card, Radio, DatePicker, Form } from 'antd'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/es/form'
import './index.less'
import moment from 'moment'
import { BaseProps } from 'typings/global'

const { Group, Button } = Radio
const { RangePicker } = DatePicker
const { Item } = Form

interface FormProps extends BaseProps,FormComponentProps{}

interface GoodsStatisticState{
  searchParams: any
}

@hot(module)
class GoodsStatistic extends RootComponent<FormProps, GoodsStatisticState> {
  modalRef: any = React.createRef<BasicModal>()
  columns: any = [
    {
      title: '商品ID',
      dataIndex: 'goodsId',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '商品图片',
      align: 'center',
      dataIndex: 'imagePath',
      render:(text: any,records: any) => {
        return <img src={records.imagePath} style={{width:'70px', height:'70px'}}/>
      }
    },
    {
      title: '下单人数',
      dataIndex: 'placOrderNum',
      align: 'center',
    },
    {
      title: '销售数量',
      dataIndex: 'saleNum',
      align: 'center',
    },
     {
      title: '销售金额',
      dataIndex: 'price',
      align: 'center',
      render:(text: any, records: any) => {
        return(
          <div className="edit-btn-link">￥{records.price}</div>
        )
      }
     },
  ]
  constructor(props: FormProps){
    super(props)
    this.state = {
      searchParams: {
        latelyDay: 'today'
      }
    }
  }

  // 头部天数按钮
  titleBtnValue = (day: string) => {
    this.setState({
      searchParams: {
        latelyDay: day
      }
    })
  }

  // 自定义按钮
  customBtn = () => {
    this.modalRef.current!.handleOk()
  }

  // 模态框确定按钮
  handleOk = () => {
    const { authTime1 } = this.props.form.getFieldsValue()
    console.log(authTime1)
    this.setState({
      searchParams: {
        startTime: moment(authTime1[0]).format('YYYY-MM-DD'),
        endTime: moment(authTime1[1]).format('YYYY-MM-DD'),
      }
    })
    this.modalRef.current!.handleCancel()
  }

  // 模态框取消按钮
  handleCancel = () => {
    this.modalRef.current!.handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { searchParams } = this.state
    return (
      <div id="goods-statistic">
        <Row className="filter_wrapper" type="flex" align="middle" justify="space-between">
          <Col>
            <span>销售商品TOP5</span>
          </Col>
          <Col>
            <Group buttonStyle="solid" defaultValue={0}>
              <Button value={0} onClick = {() => this.titleBtnValue('today')}>今天</Button>
              <Button value={7} onClick = {() => this.titleBtnValue('one_week')}>近7天</Button>
              <Button value={30} onClick = {() => this.titleBtnValue('one_month')}>近30天</Button>
              <Button value={90} onClick = {() => this.titleBtnValue('three_month')}>近90天</Button>
              <Button value={365} onClick = {() => this.titleBtnValue('one_year')}>近一年</Button>
              <Button value='5' onClick = {this.customBtn}>自定义</Button>
            </Group>
            <BaseDowload
              title='导出报表'
              exportData
              className='baseDowloadBtn'
              action={this.api.postExportGoodsStatistics}
              params={searchParams}
            >
            </BaseDowload>
          </Col>
        </Row>
        <Row className='goods-table'>
          <TableItem
            // ref={tabRef}
            rowSelectionFixed
            filterKey="id"
            rowKey={({ id }) => id}
            searchParams = {searchParams}
            URL={this.api.goodsStatisticsPostList}
            columns={this.columns}
            bordered={true}
            isPagination={false}
            rowSelection={false}
          />
        </Row>
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
export default Form.create()(GoodsStatistic)
