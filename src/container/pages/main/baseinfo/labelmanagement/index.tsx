/*
 * @Description: 标签管理
 * @Author: qiuyang
 * @Date: 2019-08-16 15:44:53
 * @LastEditTime: 2019-09-17 14:33:09
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { Button, Form, Col, Input, Modal, Row, Checkbox } from 'antd'
import './index.less'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'

const { Item } = Form

interface State {
  type: number
  visible: boolean
  label: any
  dataSource: any[]
  searchParams: any
  title: string
  selectedRows: KeyValue[]
  isRequestData: boolean
}

interface FormProps extends BaseProps, FormComponentProps {}

class LabelManagement extends RootComponent<FormProps, State> {
  constructor (props: FormProps) {
    super(props)
    this.state = {
      title:'',
      type: 0,   // 0 新增   1编辑
      visible: false,
      label: {},  //存id  和标签名称
      dataSource: [],
      searchParams: {},
      selectedRows: [],
      isRequestData: true
    }
  }

  requestList = () => {
    this.axios.request(this.api.postLabelmanagementList,{  "page": 1,"pageSize": 10 }).then(({data}) => {
      console.log("res.data.data",data.data)
      this.setState({
        dataSource:data.data
      })
    })
  }
  
  // 删除
  handlerDeleted = (id: any[]) => {
    this.axios.request(this.api.postLabelmanagementDeleted,{ id }).then(({code}) => {
      if(code === 200){
        this.requestList()
        this.$message.success("标签删除成功！")
      }
    })
  }

  // 编辑
  hanlderEdit = (records:any) => {
    this.setState({
      title:'修改标签',
      type:1,
      visible: true,
      label:{
        id:records.id,
        labelName:records.labelName
      }
    })
  }

  // 列表头部添加
  titleBtn = () => {
    this.setState({
      title:'添加标签',
      type:0, 
      visible: true,
      label:{}
    })
  }

  // 搜索框按钮
  seachBtn = () => {
    const formData = this.props.form.getFieldValue('labelID')
    this.setState({
      isRequestData: true,
      searchParams:{
        labelName:formData
      }
    })
  }


  // 模态框确定按钮
  handleOk = (id:any) => {
    const { type, label } = this.state
    this.props.form.validateFields((err: any, values: any) => {
      values.id = label.id
      if(!err){
        if(type === 0){
          // 调新增接口
          this.axios.request(this.api.postLabelmanagementAdd,values).then(({code})=>{
            if(code === 200){
              this.$message.success("新增标签成功！")
              this.requestList()
            }
          })
        }else{
          // 调修改接口
          this.axios.request(this.api.postLabelmanagementUpdate,values).then(({code}) => {
            if(code === 200){
              this.$message.success("修改标签成功！")
              this.requestList()
            }
          })
        }
        this.setState({
          visible: false
        })
      }
    })
  }

    // 获取表格选中的数据
  getSelectedRow = (keys: any[], selectedRows: KeyValue[]) => {
    this.setState({ selectedRows })
  }
  

  // 关闭遮罩取消按钮回调
  handleCancel = (e:any) => {
    console.log(e);
    this.setState({
      visible: false
    })
  }

   // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
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
    const { searchParams, isRequestData, label }=this.state
    const { getFieldDecorator } = this.props.form
    const { authorityList: { baseinfo }, hasAuthority } = this.props.mobxGlobal
    const [ labelList, labelAdd, labelEdit, labelDele, goodsList, goodsAdd, goodsEdit, goodsDele, depList, depAdd, depEdit, depDele ]: any = hasAuthority(baseinfo)
    const columns: any = [
      {
        title: '标签名称',
        dataIndex: 'labelName',
        className: 'table-head',
      },
       {
          title: '操作',
          dataIndex: 'edit',
          key: 'edit',
          render: (text:any,records: any) => {
            return (
              <div className="edit-btn-link">
                <div>
                  {labelEdit && <span onClick={() => this.hanlderEdit(records)}>编辑</span>}
                  {labelDele && <span onClick={() => this.handlerDeleted([records.id])}>删除</span>}
                </div>
              </div>
            )
          }
       },
    ]
    return (
      <div className='labelmanagement'>
        <Row className = 'ant-labelmanagement-search-row'>
          <Form className="ant-labelmanagement-search-form">
              <div className="search-header">
                <span className='title-left'>筛选查询</span>
                <Button className="title-right" onClick={this.seachBtn}>查询结果</Button>
              </div>
              <Col span={5}>
                  <Item label="输入搜索"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 8 }}
                    colon={true}
                    className="ant-classify-item">
                    { getFieldDecorator('labelID',{
                      rules:[{
                        message:'请输入中文汉字',
                        pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,7}$/, 'g')
                      }]
                    })(<Input onChange={this.isRequestData} allowClear className='input-220' placeholder="标签名称" maxLength={6}/>) }
                  </Item>
              </Col>
          </Form>
        </Row>
        <div className='labelmanagement-content'>
          <Row className='title' type='flex' justify='space-between'>
            <Col>数据列表</Col>
            <Col>
              { labelDele && 
                <Button type="primary" htmlType="submit" onClick = { this.titleDeleted } style = {{marginRight:'20px'}}>批量删除</Button>
              }
              { labelAdd &&
              <Button type="primary" htmlType="submit" onClick = { this.titleBtn }>添加标签</Button>
              }
            </Col>
          </Row>
          <TableItem 
            rowSelectionFixed
            filterKey="id"
            rowKey={({ id }) => id}
            URL={this.api.postLabelmanagementList}
            columns={columns}
            isRequestData={isRequestData}
            searchParams = {searchParams}
            getSelectedRow={this.getSelectedRow}
            bordered={true}
            scroll={{x: 1320}}
          />
        </div>
         <Modal
          title={this.state.title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          destroyOnClose
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel} style={{width:'80px',margin:'4px 20px'}}>
              取 消
            </Button>,
            <Button key="submit" type="primary" onClick={ () => this.handleOk(searchParams.id) } style={{width:'80px'}}>
              确 认
            </Button>,
          ]}
         >
          <Form>
            <div className='modal-labelmanagement-form'>
              <Col span={25}>
                  <Item label={this.state.title}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 10 }}
                    colon={true}
                    className="ant-classify-item">
                    { getFieldDecorator('labelName',{
                      initialValue: label.labelName,
                      rules:[{
                        required:true,
                        message:'最多6个字，中文汉字',
                        pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,7}$/, 'g')
                      }]
                    })(<Input placeholder="请输入标签的名称" maxLength={6}/>) }
                  </Item>
              </Col>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(LabelManagement)