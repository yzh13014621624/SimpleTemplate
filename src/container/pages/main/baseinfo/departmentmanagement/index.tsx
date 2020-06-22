/*
 * @description: 部门管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-21 15:28:29
 * @LastEditTime: 2019-09-17 14:31:51
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from 'components/index'
import { Button, Form, Col, Modal, Input, Row } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import './index.less'
import { BaseProps } from 'typings/global'

const { Item } = Form
const { TextArea } = Input

interface State {
  type: number
  visible: boolean
  titleText: any
  departmentList: any[]
  departmentInfo: any
}

interface FormProps extends BaseProps,FormComponentProps{}

class Departmentmanagement extends RootComponent<FormProps, State> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      type: 0, // 0为新增 1为编辑
      titleText: '',
      visible: false,
      departmentList:[],
      departmentInfo:{
        departmentId: '',
        departmentName: '',
        functionDescribe: ''
      }
    }
  }

  componentDidMount () {
    this.requestList()
  }


  requestList = () => {
    this.axios.request(this.api.postDepartmentList,{}).then(({data}) => {
      this.setState({
        departmentList:data.data
      })
    })
  }
 
  // 头部添加按钮
  handbtn = () => {
    console.log('添加')
    this.setState({
      type: 0,
      visible: true,
      titleText:'添加部门',
    });
  }

  // 删除
  handlerDeleted = (e: any,records: any) => {
    this.axios.request(this.api.getDepartmentDeleted, {departmentId:records.departmentId}).then(({code}) => {
      if(code === 200){
        this.requestList()
        this.$message.success('删除成功！')
      }
    })
  }

  // 编辑
  hanlderEdit = (e: any,records: any) => {
    this.setState({
      type:1,
      visible: true,
      titleText:'修改部门',
      departmentInfo:{
        departmentId:records.departmentId,
        departmentName:records.departmentName,
        functionDescribe:records.functionDescribe
      }
    })
  }

  // 模态框确定按钮
  handleOk = (departmentId: any) => {
    // 获取form表单中修改的值
    this.props.form.validateFields((err: any, values: any) => {
      values.departmentId = departmentId
      if(!err){
          // 调添加接口
        if(this.state.type === 0){
          this.axios.request(this.api.postDepartmentAdd, values).then(({code}) => {
            if(code === 200){
              this.requestList()
              this.$message.success("新增成功！")
            }
          })
        }else{
          //调修改接口
          this.axios.request(this.api.postDepartmentUpdate, values).then(({code}) => {
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

  // 模态框取消按钮
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  // tabel头部添加按钮
  titleBtn = () => {
    this.setState({
      type:0,
      visible: true,
      titleText: '添加部门',
      departmentInfo:{
        departmentId: '',
        departmentName: '',
        functionDescribe: ''
      }
    })
  }

  render () {
    const { titleText, departmentInfo }=this.state
    const { getFieldDecorator } = this.props.form
    const { authorityList: { baseinfo }, hasAuthority } = this.props.mobxGlobal
    const [ labelList, labelAdd, labelEdit, labelDele, goodsList, goodsAdd, goodsEdit, goodsDele, depList, depAdd, depEdit, depDele ]: any = hasAuthority(baseinfo)
    const columns: any = [
      {
        title: '部门名称',
        align: 'center',
        dataIndex: 'departmentName',
        className: 'table-head',
      },
      {
        title: '职能描述',
        align: 'center',
        dataIndex: 'functionDescribe',
        className: 'table-head-funDescribe',
      },
      {
        title: '添加时间',
        align: 'center',
        dataIndex: 'createTime',
        className: 'table-head',
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'edit',
        key: 'edit',
        render: (text: any,records: any) => {
            return (
              <div className="edit-btn-link">
                <div>
                  {depEdit && <span onClick={(e) => this.hanlderEdit(e,records)}>编辑</span>}
                  {depDele && <span onClick={(e) => this.handlerDeleted(e,records)}>删除</span>}
                </div>
              </div>
            )
        } 
      },
    ]
    return (
      <div className='ant-departmentmanagement'>
        <div className='departmentmanagement-content'>
          <Row className='title' type='flex' justify='space-between'>
            <Col>数据列表</Col>
            { depAdd &&
            <Col>
              <Button type="primary" htmlType="submit" onClick = { this.titleBtn }>添加</Button>
            </Col>
            }
          </Row>
          <TableItem 
            rowSelectionFixed
            filterKey="departmentId"
            rowKey={({ departmentId }) => departmentId}
            URL={this.api.postDepartmentList}
            columns={columns}
            bordered={true}
            rowSelection={false}
            scroll={{x: 1320}}
          />
        </div>
        <Modal
          title={titleText}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={'580px'}
          destroyOnClose
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel} style={{width:'80px',margin:'4px 20px'}}>
              取 消
            </Button>,
            <Button key="submit" type="primary" onClick={() => this.handleOk(this.state.departmentInfo.departmentId)} style={{width:'80px'}}>
              确 认
            </Button>
          ]}
        >
          <Form>
            <div className='modal-labelmanagement-form'>
              <Col span={25}>
                <Item label='部门名称'
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  colon={true}
                  className="ant-classify-item">
                  { getFieldDecorator('departmentName',{
                    initialValue: departmentInfo.departmentName,
                    rules:[{
                      required: true,
                      message: '最多8个字，中文汉字',
                      pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,8}$/, 'g')
                    }]
                  })(<Input  placeholder="请输入部门名称" maxLength={8}/>) }
                </Item>
              </Col>
              <Col span={25}>
                <Item label='职能描述'
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  colon={true}
                  className="ant-department-item">
                  { getFieldDecorator('functionDescribe',{
                    initialValue: departmentInfo.functionDescribe,
                    rules:[{
                      required: true,
                      message:'职能描述不能为空'
                    }]
                  })(<TextArea placeholder="请输入内容" rows={7}/>) }
                </Item>
              </Col>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(Departmentmanagement)