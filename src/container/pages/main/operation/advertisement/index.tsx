/*
 * @Description: 广告管理列表
 * @Author: qiuyang
 * @Date: 2019-08-16 15:44:53
 * @LastEditTime: 2019-09-19 09:26:08
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { Button, Form, Col, Row, Select, Input } from 'antd'
import './index.less'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import { FormComponentProps } from 'antd/es/form'

const { Item } = Form
const { Option } = Select

interface State {
  shopName: string
  dataSource: any[]
  searchParams: any
  isRequestData: boolean
}

interface FormProps extends BaseProps,FormComponentProps{}

class AdvertisementList extends RootComponent<FormProps, State> {
  tabRef = React.createRef<TableItem<any>>()
  constructor(props: FormProps){
    super(props)
    this.state = {
      shopName:'',
      searchParams:{},
      dataSource:[],
      isRequestData:true
    }
  }

  componentDidMount = () => {
    console.log(window.screen)
  }

  // 查看
  handlerInfo = (records: any) => {
    const { id } = records
    this.props.history.push(`/operation-management/advertisement/info?id=${id}`)
  }
  
  // 删除
  handlerDeleted = (records: any) => {
    const { id } = records
    this.axios.request(this.api.getAdvertisementDeleted, {id}).then((res) => {
      if(res.code === 200){
        this.tabRef.current!.loadingTableData()
        this.$message.success('删除成功！')
      }
    })
  }

  // 编辑
  hanlderEdit = (records: any) => {
    const { id } = records
    this.props.history.push(`/operation-management/advertisement/edit?id=${id}`)
  }

  // 启用、停用
  enableDiscontinue = (records: any, status: number) => {
    const { id } = records
    this.axios.request(this.api.getAdvertisementBannerStatus,{ id, status }).then((res) => {
      if(res.code === 200){
        this.tabRef.current!.loadingTableData()
        this.$message.success(status === 0?"启用成功！":"停用成功！")
      }
    })
  }

  // 添加广告按钮
  goodsHeadBtn = (e: any) => {
    const { value } = e.target
    this.props.history.push('/operation-management/advertisement/add')
  }

  // 查询结果
  formData = () => {
    const formData = this.props.form.getFieldsValue()
    this.setState({
      isRequestData: true,
      searchParams: formData
    })
  }

  // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
  }

  render(){
    const { tabRef } = this
    const { searchParams, isRequestData } = this.state
    const { getFieldDecorator } = this.props.form
    const { authorityList: { advertisement }, hasAuthority } = this.props.mobxGlobal
    const [ adtList, adtAdd, adtEdit, adtInfo, adtStop, adtStart, adtDel ]: any = hasAuthority(advertisement)
    const columns: any = [
      {
        title: '广告ID',
        dataIndex: 'id',
        className: 'table-head',
      },
      {
        title: '广告名称',
        dataIndex: 'title',
        className: 'table-head',
      },
      {
        title: '广告位置',
        dataIndex: 'advertisementPosition',
        className: 'table-head',
        render:(text: any,records: any) => {
          return( 
            <div>
              {records.type === 0 ? <div style = {{display:'block'}}>小程序首页</div>:<div style = {{display:'block'}}>小程序门店页</div>}
              <div>轮播{records.position}</div>
            </div>
        )}
      },
      {
        title: '广告图片',
        dataIndex: 'advertisementImg',
        className: 'table-head',
        render:(text: any, records: any) => {
          return <img src={records.imagePath} style={{width:'70px', height:'70px'}}/>
        }
      },
      {
        title: '时间',
        dataIndex: 'time',
        className: 'table-head',
        render:(text: any, records: any) => {
          return(<span><p>开始时间：{records.startTime}</p><p>结束时间：{records.expireTime}</p></span>)
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        className: 'table-head',
        render: (text: any,records: any) => {
          return (
            new Date().getTime() - moment(records.expireTime).valueOf() > 0 ?
            <span>已过期</span>:
            <div>
              {records.outName}       
            </div>
          )
        }
      },
       {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render:(text: any, records: any) => {
          return(
            new Date().getTime() - moment(records.expireTime).valueOf() > 0 ?
            <div className="edit-btn-link">
              {records.outName !== '进行中' && adtEdit && <span onClick={() => this.hanlderEdit(records)}>编辑</span>}
              {records.outName !== '进行中' && adtDel && <span onClick={() => this.handlerDeleted(records)}>删除</span>}
            </div>:
            <div className="edit-btn-link">
              {records.outName === '已停用' && adtStart && <span onClick = {() => this.enableDiscontinue(records, 0)}>启用</span>}
              {records.outName === '进行中' && adtStop && <span onClick = {() => this.enableDiscontinue(records, 1)}>停用</span> || records.outName === '未开始' && adtStop && <span onClick = {() => this.enableDiscontinue(records, 1)}>停用</span>}
              {records.outName !== '已过期' && adtInfo && <span onClick = {(e) => this.handlerInfo(records)}>查看</span>}
              {records.outName !== '进行中' && adtEdit && <span onClick={() => this.hanlderEdit(records)}>编辑</span>}
              {records.outName !== '进行中' && adtDel && <span onClick={() => this.handlerDeleted(records)}>删除</span>}
            </div>
          )
        }
       },
    ]
    return (
      <div className='advertisement'>
        <Row className='ant-advertisement-search-row'>
          <Form className="ant-advertisement-search-form">
            <div className="search-header">
              <span className='title-left'>筛选查询</span>
              <Button className="title-right" onClick = {this.formData}>查询结果</Button>
            </div>
            <Col span={7}>
              <Item label="广告名称"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon={true}>
                { getFieldDecorator('title')(<Input onChange={this.isRequestData} className = 'input-200' placeholder="广告名称" allowClear/>) }
              </Item>
            </Col>
            <Col span={7}>
              <Item label="广告位置"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon={true}>
                { getFieldDecorator('type')( 
                  <Select
                    showSearch
                    placeholder="全部"
                    allowClear
                    className = 'input-200'
                    onChange={this.isRequestData}
                    optionFilterProp="children"
                  >
                    <Option value={0}>小程序首页轮播</Option>
                    <Option value={1}>小程序门店页轮播</Option>
                  </Select>) 
                }
              </Item>
            </Col>
            <Col span={7}>
              <Item label="到期时间"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon={true}>
                { getFieldDecorator('expireTime')( 
                  <Select
                    showSearch
                    className = 'input-200'
                    onChange={this.isRequestData}
                    allowClear
                    placeholder="全部"
                    optionFilterProp="children"
                  >
                    <Option value={1}>一天内</Option>
                    <Option value={3}>三天内</Option>
                    <Option value={7}>一周内</Option>
                  </Select>) }
              </Item>
            </Col>
          </Form>
        </Row>
        <div className='advertisement-content'>
          <Row className='title' type='flex' justify='space-between'>
            <Col>数据列表</Col>
            { adtAdd &&
            <Col>
              <Button  type="primary" htmlType="submit" onClick = { this.goodsHeadBtn }>添加广告</Button>
            </Col>
            }
          </Row>
          <TableItem
            ref={tabRef}
            rowSelectionFixed
            filterKey="id"
            rowKey={({ id }) => id}
            URL={this.api.postAdvertisementList}
            columns={columns}
            bordered={true}
            rowSelection={false}
            isRequestData={isRequestData}
            scroll={{x: 1320}}
            searchParams={{...searchParams, source:'show'}}
          />
        </div>
      </div>
    )
  }
}
export default Form.create<FormProps>()(AdvertisementList)