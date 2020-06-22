/*
 * @description: 商品管理列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-03 10:48:15
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Divider, Col, Input, Row, Select, Button, Switch } from 'antd'
import { SearchHeader, TableItem } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'
import axios from 'pages/login/utils/index'
import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps, FormComponentProps { }
interface ProductsState {
  condition: any,
  modalVisible: boolean
}
interface ComponentFormProps extends FormComponentProps {
  onChangeParams: Function,
  parentState: any
}

const { Item } = Form
const { Option } = Select

const CONDITIONS = {
  userName: undefined,
  charID: '',
  userPhone: undefined
}
class SearchComponent extends RootComponent<ComponentFormProps, any> {
  constructor (props: ComponentFormProps) {
    super(props)
    this.state = {
      roleList: []
    }
  }

  componentDidMount () {
    axios(this.api.findRoleList, { pageSize: 999 }, false).then(({ code, data }) => {
      if (code && code === 200) {
        this.setState({
          roleList: data.data
        })
      }
    })
  }

  /** 页面事件 */
  onSearch = (e: any) => {
    e.preventDefault()

    const { form, onChangeParams } = this.props
    form.validateFields((err, value) => {
      onChangeParams(value)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      }
    }
    const { parentState } = this.props
    const { roleList } = this.state

    return (
      <div className='user-search'>
        <Form onSubmit={this.onSearch}>
          <SearchHeader title='筛选条件' cancelBlock={true} extraButton={<Button type='primary' htmlType='submit'>查询结果</Button>}>
            <Row type='flex' justify='space-between'>
              <Col span={6}>
                <Item label='用户姓名' {...formLayout}>
                  {getFieldDecorator('userName', {
                    initialValue: parentState.userName
                  })(
                    <Input placeholder='输入用户姓名' />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='所属角色' {...formLayout}>
                  {getFieldDecorator('charID', {
                    initialValue: parentState.charID
                  })(
                    <Select className='dropdown'>
                      <Option value=''>全部</Option>
                      {
                        roleList.length > 0 && roleList.map((item: any, index: number) => {
                          return (
                            <Option value={item.charID} key={item.charID}>{item.charName}</Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label='手机号' {...formLayout}>
                  {getFieldDecorator('userPhone', {
                    initialValue: parentState.userPhone
                  })(
                    <Input placeholder='输入手机号' />
                  )}
                </Item>
              </Col>
            </Row>
          </SearchHeader>
        </Form>
      </div>
    )
  }
}

const FormSearchCom = Form.create<ComponentFormProps>()(SearchComponent)

@hot(module)
class User extends RootComponent<FormProps, ProductsState> {
  constructor (props: FormProps) {
    super(props)
    this.state = {
      condition: {
        ...CONDITIONS
      },
      modalVisible: false
    }
  }

  /** 页面事件 */
  onDelete = (userID: any) => {
    const newRequest = {
      ...this.api.userRemove,
      path: `${this.api.userRemove.path}${userID}`
    }
    const { condition } = this.state
    axios(newRequest, {}, false).then(({ code, data }) => {
      if (code && code === 200) {
        this.$message.success('删除成功')
        this.setState({
          condition: condition
        })
      }
    })
  }

  onChangeChecked = (item: any) => {
    const userSysID = item.userProjs[0].userSysID
    const newRequest = {
      ...this.api.enableDisable,
      path: `${this.api.enableDisable.path}${userSysID}`
    }
    const { condition } = this.state
    axios(newRequest, {}, false).then(({ code }) => {
      if (code && code === 200) {
        this.$message.success('修改成功')
        this.setState({
          condition
        })
      }
    })
  }

  /** 子组件事件 */
  childChangeCondition = (condi: object) => {
    this.setState({
      condition: condi
    })
  }

  render () {
    const {
      state: { condition },
      props: {
        mobxGlobal: { authorityList: { user }, hasAuthority }
      }
    } = this
    const [pUserDetail, pAddUser, pEditUser, pDeleteUser, pOpenClose]: any = hasAuthority(user)
    const columns = [
      {
        title: '用户姓名',
        dataIndex: 'userName'
      },
      {
        title: '手机号',
        dataIndex: 'userPhone'
      },
      {
        title: '邮箱地址',
        dataIndex: 'userMail'
      },
      {
        title: '所属角色',
        dataIndex: 'userRoles',
        render: (value: any) => {
          let renderString = ''
          value && value.forEach((element: any, index: number) => {
            if (index !== 0) {
              renderString += '、'
            }
            renderString += element.charName
          })
          return (
            <span>{renderString}</span>
          )
        }
      },
      {
        title: '添加时间',
        dataIndex: 'userCtime'
      },
      {
        title: '是否启用',
        dataIndex: 'userProjs',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pOpenClose
                  ? <Switch checked={(value[0].userEnabled)} onChange={() => this.onChangeChecked(item)} />
                  : <span>{value && value.length > 0 ? (value[0].userEnabled ? '是' : '否') : '否'}</span>
              }
            </>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (value: any, item: any) => {
          return (
            <>
              {
                pUserDetail &&
                <>
                  <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/user-management/user-detail?id=${item.userID}`) }}>查看</a>
                  <Divider type='vertical' />
                </>
              }
              {
                pEditUser &&
                <>
                  <a href='javacript:void(0);' onClick={() => { this.props.history.push(`/user-management/user-edit?id=${item.userID}`) }}>编辑</a>
                  <Divider type='vertical' />
                </>
              }
              {pDeleteUser && <a href='javacript:void(0);' onClick={() => this.onDelete(item.userID)}>删除</a>}
            </>
          )
        }
      }
    ]
    return (
      <div className='user'>
        <FormSearchCom
          onChangeParams={this.childChangeCondition}
          parentState={condition}
        />
        <SearchHeader title='数据列表' cancelPadding={true} cancelBlock={true} extraButton={pAddUser ? <Button type='primary' onClick={() => { this.props.history.push('/user-management/user-edit') }}>添加</Button> : ''}>
          <TableItem
            rowKey='index'
            columns={columns as any}
            axios={axios}
            URL={this.api.findUserPageList}
            rowSelection={false}
            bordered={true}
            scroll={{ x: 1320 }}
            searchParams={condition}
          />
        </SearchHeader>
      </div>
    )
  }
}

export default Form.create<FormProps>()(User)
