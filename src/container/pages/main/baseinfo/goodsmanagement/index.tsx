/*
 * @Description: 商品单位管理
 * @Author: qiuyang
 * @Date: 2019-08-16 15:44:53
 * @LastEditTime: 2019-09-17 14:32:35
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { Table, Button, Form, Col, Input, Modal, Row } from 'antd'
import './index.less'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import api from 'service/api'

const { Item } = Form;

interface State {
  type: number
  visible: boolean
  searchParams: any
  dataSource: any[]
  selectedRowKeys: KeyValue[]
  isRequestData: boolean
  title: string
  selectedRows: any[]
}

interface FormProps extends BaseProps, FormComponentProps{}

class GoodsManagement extends RootComponent<FormProps, State> {
  constructor(props: FormProps){
    super(props)
    this.state = {
      title:'',
      type: 0,    // 0新增   1编辑
      visible: false,
      selectedRowKeys:[],
      dataSource:[],   
      isRequestData: true,
      searchParams:{},
      selectedRows:[]
    }
  }

  componentDidMount () {
    this.requestList()
  }
  
  requestList = () => {
    this.axios.request(api.postGoodsmanagementList, { "page": 1,"pageSize": 10}).then(({data}) => {
      this.setState({
        dataSource:data.data
      })
    })
  }

  // 删除
  handlerDeleted = (id: any[]) => {
    this.axios.request(api.postGoodsmanagementDeleted,{ id }).then(({code}) => {
      if(code === 200){
        this.requestList()
        this.$message.success("删除成功！")
      }
    })
  }

  // 编辑
  hanlderEdit = (records: any) => {
    this.setState({
      title: '修改商品单位',
      type: 1,
      visible: true,
      searchParams:{
        id:records.id,
        title:records.title
      }
    })
  }

  // 模态框确定按钮
  handleOk = (id: any) => {
    const { searchParams, type } = this.state
    // 获取form表单修改的值
    this.props.form.validateFields((err: any, values: any) => {
      values.id = searchParams.id
      if(!err){
        if(type === 0){
          // 调添加接口
          this.axios.request(api.postGoodsmanagementAdd, values).then(({code}) => {
            if(code === 200){
              this.requestList()
              this.$message.success("新增成功！")
            }
          })
        }else{
          // 调修改接口
          this.axios.request(api.postGoodsmanagementUpdate, values).then(({code}) => {
            if(code === 200){
              this.requestList()
              this.$message.success("修改成功！")
            }
          })
        }
        this.setState({
          visible: false,
        })
      }
    })
  }

  // 关闭遮罩取消按钮回调
  handleCancel = (e: any) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  // 表头添加商品单位按钮
  titleBtn = () => {
    this.setState({
      title: '添加商品单位',
      type: 0,
      visible: true,
      searchParams: {
        searchParams:{}
      }
    })
  }

  // 搜索框按钮
  seachBtn = () => {
    const formData = this.props.form.getFieldValue('goodsID')
    this.setState({
      isRequestData: true,
      searchParams:{
        labelName:formData
      }
    })
  }

  // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
  }

  // 获取表格选中的数据
  getSelectedRow = (keys: any[], selectedRows: KeyValue[]) => {
    this.setState({ selectedRows })
  }

   // 多选删除
  titleDeleted = () => {
    const { selectedRows } = this.state
    let id: any[] = []
    if(selectedRows.length === 0){
      this.$message.warning("请选择删除项！")
    }else{
      for(let i=0; i<selectedRows.length; i++){
        id.push(selectedRows[i].id)
      }
      this.handlerDeleted(id)
      this.setState({
        selectedRows:[]
      })
    }
  }

  render(){
    const { searchParams, isRequestData, title }=this.state
    const { getFieldDecorator } = this.props.form
    const { authorityList: { baseinfo }, hasAuthority } = this.props.mobxGlobal
    const [ labelList, labelAdd, labelEdit, labelDele, goodsList, goodsAdd, goodsEdit, goodsDele, depList, depAdd, depEdit, depDele ]: any = hasAuthority(baseinfo)
    const columns: any = [
      {
        title: '商品单位名称',
        dataIndex: 'title',
        className: 'table-head',
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (text: any,records: any) => {
          return (
            <div className="edit-btn-link">
              <div>
                {goodsEdit && <span onClick={() => this.hanlderEdit(records)}>编辑</span>}
                {goodsDele && <span onClick={(e: any) => this.handlerDeleted([records.id])}>删除</span>}
              </div>
            </div>
          )
        }
      },
    ]
    return (
      <div className='goodsmanagement'>
        <Row className = 'ant-labelmanagement-search-row'>
          <Form className="ant-goodsmanagement-search-form">
            <div className="search-header">
              <span className='title-left'>筛选查询</span>
              <Button className="title-right" onClick={this.seachBtn}>查询结果</Button>
            </div>
            <Col span={5}>
                <Item label="输入搜索"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}
                  className="ant-classify-item">
                  { getFieldDecorator('goodsID', {
                    rules:[{
                      message:'请输入中文汉字',
                      pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,7}$/, 'g')
                    }]
                  })(<Input onChange={this.isRequestData} allowClear className='input-220' placeholder="单位名称" maxLength = {6}/>) }
                </Item>
            </Col>
          </Form>
        </Row>
        <div className='goodsmanagement-content'>
          <Row className='title' type='flex' justify='space-between'>
            <Col>数据列表</Col>
            <Col>
            { goodsDele && 
              <Button type="primary" htmlType="submit" onClick = { this.titleDeleted } style = {{marginRight:'20px'}}>批量删除</Button>
            }
            { goodsAdd &&
              <Button  type="primary" htmlType="submit" onClick = { this.titleBtn }>添加商品单位</Button>
            }
            </Col>
          </Row>
          <TableItem 
            rowSelectionFixed
            filterKey="id"
            rowKey={({ id }) => id}
            URL={this.api.postGoodsmanagementList}
            isRequestData = {isRequestData}
            columns={columns}
            searchParams={searchParams}
            getSelectedRow={this.getSelectedRow}
            bordered={true}
            scroll={{x: 1320}}
          />
        </div>
        <Modal
          title={title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          destroyOnClose
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel} style={{width:'80px',margin:'4px 20px'}}>
              取 消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleOk(searchParams.id)} style={{width:'80px'}}>
              确 认
            </Button>,
          ]}
        >
          <Form>
            <div className='modal-goodsmanagement-form'>
              <Col span={25}>
                  <Item label={title}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 10 }}
                    colon={true}
                    className="ant-classify-item">
                    { getFieldDecorator('title',{
                      initialValue:searchParams.title,
                      rules:[{
                        required:true,
                        message:'最多6个字，中文汉字',
                        pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,7}$/, 'g')
                      }]
                    })(<Input placeholder="请输入商品单位名称" maxLength={6} />) }
                  </Item>
              </Col>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(GoodsManagement)