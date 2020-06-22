/*
 * @description: 会员管理列表
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-08-26 10:23:58
 * @LastEditTime: 2019-09-12 17:32:38
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { hot } from 'react-hot-loader'
import { Form, DatePicker, Select, Input, Button, Row, Col, Table, Switch } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'
import './index.less'

const { Item } = Form
const { Option } = Select
const { RangePicker } = DatePicker
interface BaseMemberProps extends BaseProps, FormComponentProps {
}

interface MemberState {
  searchParams: any
  isRequestData: boolean
}

@hot(module)
class Member extends RootComponent<BaseMemberProps, MemberState> {
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: any) {
    super(props)
    this.state = {
      searchParams: {},
      isRequestData: true
    }
  }

  // 查询结果事件
  searchData = () => {
    const getFieldsValue = this.props.form.getFieldsValue()
    const { authTime } = getFieldsValue
    const startTime = authTime && authTime.length > 0 ? moment(authTime[0]).format('YYYY-MM-DD') : undefined
    const endTime = authTime && authTime.length > 0 ? moment(authTime[1]).format('YYYY-MM-DD') : undefined
    // if (startTime === endTime) {
    //   startTime = `${startTime} 00:00:00`
    //   endTime = `${endTime} 23:59:59`
    // }
    setTimeout(() => {
      this.setState({
        isRequestData: true,
        searchParams: Object.assign(getFieldsValue, { authTime: undefined, startTime, endTime })
      })
    }, 500)
  }

  goDetail = (userId: any, e: any) => {
    e.preventDefault()
    this.props.history.push(`/vip-management/detail?userId=${userId}`)
  }

  // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
  }

  render () {
    const {
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { member }, hasAuthority }
      },
      tableRef
    } = this
    const [viewMember]:any = hasAuthority(member)
    const { searchParams, isRequestData } = this.state
    const columns = [
      {
        title: '会员ID',
        dataIndex: 'userId',
        className: 'col_all'
      },
      {
        title: '会员手机号',
        dataIndex: 'memberPhone',
        className: 'col_all'
      },
      {
        title: '会员昵称',
        dataIndex: 'nickName',
        className: 'col_all'
      },
      {
        title: '会员类型',
        dataIndex: 'memberType',
        className: 'col_all'
      },
      {
        title: '授权/注册时间',
        dataIndex: 'authTime',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      },
      {
        title: '消费金额',
        dataIndex: 'orderTotalPrice',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>{text && `￥${text}`}</span>
        }
      },
      {
        title: '订单数量',
        dataIndex: 'orderTotalAmount',
        className: 'col_all'
      },
      // {
      //   title: '账户启用状态',
      //   dataIndex: 'enabled',
      //   className: 'col_all',
      //   render: (text: any) => {
      //     return <Switch defaultChecked={text} onChange={this.onSwitchChange} />
      //   }
      // },
      {
        title: '操作',
        dataIndex: 'address',
        className: 'col_all',
        render: (text: any, recond: any) => {
          return <span>
            {viewMember && <a href='javascript;;' onClick={(e) => this.goDetail(recond.userId, e)}>查看</a>}
          </span>
        }
      }
    ]
    return (
      <div className='member'>
        <Form className='search'>
          <div className='headertag'>
            <div className='left'>筛选查询</div>
            <div className='right'>
              <Button className='actionbtn' onClick={this.searchData}>查询结果</Button>
            </div>
          </div>
          <div className='searchparams'>
            <Row type='flex' justify='space-between'>
              <Col span={5}>
                <Item
                  label="输入搜索"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('key')(
                    <Input allowClear placeholder='会员ID/手机号' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="会员昵称"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('nickName')(
                    <Input allowClear placeholder='会员昵称' className='input-220' onChange={this.isRequestData} />
                  )}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="注册时间"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('authTime')(
                    <RangePicker
                      // suffixIcon={(<img src={date} />)}
                      allowClear
                      onChange={this.isRequestData}
                    />
                  )}
                </Item>
              </Col>
              <Col span={5}>
                <Item
                  label="会员类型"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  {getFieldDecorator('memberType')(
                    <Select
                      className='input-220'
                      placeholder='请选择会员类型'
                      allowClear
                      onChange={this.isRequestData}
                    >
                      <Option value='be_member'>注册会员</Option>
                      <Option value='not_member'>未注册会员</Option>
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
          </div>
        </Form>
        <div className='tableheader'>
          <div>数据列表</div>
        </div>
        <TableItem
          ref={tableRef}
          rowSelectionFixed
          filterKey="index"
          bordered
          rowSelection={false}
          isRequestData={isRequestData}
          rowKey={({ index }) => index}
          URL={this.api.getMemberList}
          searchParams={searchParams}
          columns={columns as any}
        />
      </div>
    )
  }
}

export default Form.create<BaseMemberProps>()(Member)
