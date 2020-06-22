/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-03-20 19:41:45
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Divider, Table, Button, Modal, Input } from 'antd'
import { SearchHeader } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import axios from 'pages/login/utils/index'
import './index.less'

import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps,FormComponentProps{}
interface ProductsState {
  condition: any,
  modalVisible: boolean,
  pageData: any[],
  pager: object,
  currentEditItem: object,
  modalActionType: string
}

const { Item } = Form

const PAGER = {
  current: 1,
  pageSize: 10,
  total: 0
}
@hot(module)
class Roles extends RootComponent<FormProps, ProductsState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      condition: null,
      modalVisible: false,
      pageData: [],
      pager: {
        ...PAGER
      },
      currentEditItem: {},
      modalActionType: 'add'
    }
  }
  componentDidMount() {
    this.getPageData()
  }

  /**获取页面数据 */
  getPageData = (params: any = {}) => {
    const { condition, pager } = this.state
    const payload = {
      ...pager,
      ...condition,
      ...params,
      projectName: 'zc',
      page: (pager as any).current
    }
    axios(this.api.findRoleList, payload, false).then(({ code, data }) => {
      if(code && code === 200) {
        this.setState({
          pageData: data.data,
          pager: {
            ...this.state.pager,
            total: data.totalNum
          }
        })
      }
    })
  }

  /**表单验证 */
  validateRoleName = (rules: any, value: any, callback: any) => {
    if(value && !(/^[\u4e00-\u9fa5]{1,12}$/.test(value))) {
      callback('请输入12字以内的汉字')
    }
    callback()
  }

  /**页面事件 */
  onDelete = (item: any) => {
    let roleIDs = []
    roleIDs.push(item.charID)
    let payload = {
      roleIDs
    }
    axios(this.api.roleRemove, payload, false).then(({ code }) => {
      if(code && code === 200) {
        this.$message.success('删除成功')
        this.getPageData()
      }
    })
  }

  onOpenModal = (item: any = {}, type: string) => {
    if (type === 'edit') {
      const { setFieldsValue } = this.props.form
      setFieldsValue({
        'name': item.charName,
        'description': item.charRemark
      })
      this.setState({
        modalVisible: true,
        currentEditItem: item,
        modalActionType: type
      })
    } else {
      const { setFieldsValue } = this.props.form
      setFieldsValue({
        'name': undefined,
        'description': undefined
      })
      this.setState({
        modalVisible: true,
        modalActionType: type
      })
    }
  }

  onEditRoles = () => {
    const { validateFields } = this.props.form
    const { currentEditItem, modalActionType } = this.state
    validateFields((err, value) => {
      if(err) {return}
      if (modalActionType === 'edit') {
        const payload = {
          charCode: (currentEditItem as any).charCode,
          charID: (currentEditItem as any).charID,
          charName: value.name,
          charRemark: value.description
        }
        axios(this.api.roleEdit, payload, false).then(({ code }) => {
          if(code && code === 200) {
            this.$message.success('编辑成功')
            this.setState({
              modalVisible: false
            })
            this.getPageData()
          }
        })
      } else if (modalActionType === 'add') {
        const payload = {
          charCode: '',
          charName: value.name,
          charRemark: value.description
        }
        axios(this.api.roleAdd, payload, false).then(({ code }) => {
          if(code && code === 200) {
            this.$message.success('添加成功')
            this.setState({
              modalVisible: false
            })
            this.getPageData()
          }
        })
      }
      
    })
  }
  
  handleChangePage = (value: any) => {
    this.setState({
      pager: {
        ...this.state.pager,
        current: value
      }
    }, () => {
      this.getPageData()
    })
  }

  render () {
    const {
      state: {
        pageData, pager, modalVisible, modalActionType
      },
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { role }, hasAuthority }
      }
    } = this
    const [pAddRole, pSettingRole, pDelete, pEditRole, pOpenClose]:any = hasAuthority(role)

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'charName',
      },
      {
        title: '角色描述',
        dataIndex: 'charRemark',
      },
      {
        title: '添加时间',
        dataIndex: 'authCtime',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pSettingRole &&
                <>
                  <a href='javacript:void(0);' onClick={() => {this.props.history.push(`/role-management/permission-setting?id=${item.charID}&&charName=${item.charName}`)}}>权限设置</a>
                  <Divider type='vertical' />
                </>
              }
              {
                pEditRole &&
                <>
                  <a href='javacript:void(0);' onClick={() => this.onOpenModal(item, 'edit')}>编辑</a>
                  <Divider type='vertical' />
                </>
              }
              {pDelete && <a href='javacript:void(0);' onClick={() => this.onDelete(item)}>删除</a>}
            </>
          )
        }
      }
    ]
    const paginationParam = {
      ...pager,
      size: 'small',
      current: (pager as any).current,
      showTotal: (total: any) => `总条数：${total}`,
      onChange: (value: any) => this.handleChangePage(value),
      itemRender: (current: number, type: string, originalElement: any) => {
        if (type === 'prev') {
          return <Button size="small" style={{ margin: '0 6px' }}>上一页</Button>
        } if (type === 'next') {
          return <Button size="small" style={{ margin: '0 6px' }}>下一页</Button>
        }
        return originalElement
      },
      showQuickJumper: true
    }
    
    return (
      <div className='roles'>
        <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true} extraButton={pAddRole ? <Button type='primary' onClick={() => this.onOpenModal(undefined, 'add')}>添加</Button> : ''}>
          <Table
            rowKey={({charID}) => charID}
            columns={columns as any}
            dataSource={pageData}
            bordered={true}
            scroll={{x: 1320}}
            pagination={paginationParam}
          />
        </SearchHeader>
        <Modal
          title={modalActionType === 'add' ? '添加角色' : '编辑角色'}
          visible={modalVisible}
          onOk={this.onEditRoles}
          onCancel={() => { this.setState({ modalVisible: false }) }}
        >
          <Item label='角色名称' labelCol={{span: 4}} wrapperCol={{span: 18}}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入角色名称'
                },
                {
                  validator: this.validateRoleName
                }
              ]
            })(
              <Input placeholder='请输入角色名称' maxLength={12} />
            )}
          </Item>
          <Item label='角色描述' labelCol={{span: 4}} wrapperCol={{span: 18}}>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '请输入角色描述'
                }
              ]
            })(
              <Input.TextArea style={{height: '150px'}} placeholder='请输入角色描述' />
            )}
          </Item>
        </Modal>
      </div>
    )
  }
}

export default Form.create<FormProps>()(Roles)