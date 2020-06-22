/*
 * @description: 编辑用户页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-04 19:50:18
 * @LastEditTime: 2020-03-20 20:25:28
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Row, Col, Button, Input, Checkbox } from 'antd'
import { SearchHeader } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import HttpUtil from 'utils/HttpUtil'
import './index.less'
import axios from 'pages/login/utils/index'
import { hot } from 'react-hot-loader'
const JSEncrypt = require('jsencrypt')

interface FormProps extends BaseProps,FormComponentProps{}
interface ProductsState {
  userInfo: any,
  roleList: any[],
  rolesPermission: any[],
  publicKey: string
}

const { Item } = Form
const { Group } = Checkbox

@hot(module)
class UserEdit extends RootComponent<FormProps, ProductsState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      userInfo: {},
      roleList: [],
      rolesPermission: [],
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPS8eaxMEKLTNL+oYwliannp44+tKS65nR4ODYFsmGaQGkoe7LhznkLyl+NARtrxwU7Hp7jW49Gc0evCK+fLPmotdpGKGHnbQQXLAJKHKG1A8rRxKxByOJCAgQdZ4G0oh7vTEGUve8Dmp5Bearbno5fIFnrHymNKajy3AT0JXWuQIDAQAB'
    }
  }
  componentDidMount() {
    const urlParams = HttpUtil.parseUrl(this.props.location.search)
    if (urlParams && urlParams.hasOwnProperty('id')) {
      const { id } = urlParams
      const { setFieldsValue } = this.props.form
      const newDetailRequest = {
        ...this.api.findUser,
        path: `${this.api.findUser.path}${id}`
      }
      const newRoleRequest = {
        ...this.api.findGrantedRoles,
        path: `${this.api.findGrantedRoles.path}${id}`
      }
      axios(newDetailRequest, {}, false).then(({ code, data }) => {
        if (code && code === 200) {
          this.setState({
            userInfo: data
          })
          setFieldsValue({
            'userPhone': data.userPhone,
            'userMail': data.userMail,
            'userName': data.userName
          })
        }
      })

      axios(newRoleRequest, {}, false).then(({ code, data }) => {
        if (code && code === 200) {
          let permissionList: any[] = []
          data.forEach((element: any) => {
            if(element.checked) {
              permissionList.push(element.charID)
            }
          })
          this.setState({
            rolesPermission: permissionList
          })
        }
      })
    }

    axios(this.api.findRoleList, {pageSize: 999}, false).then(({ code, data }) => {
      if(code && code === 200) {
        this.setState({
          roleList: data.data
        })
      }
    })
  }

  /**表单验证 */
  validatePhoneNumber = (rules: any, value: any, callback: any) => {
    if(value && !(/^1[3456789]\d{9}$/.test(value))) {
      callback('请输入正确手机号')
    }
    callback()
  }

  validateMail = (rules: any, value: any, callback: any) => {
    if (value && !(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
      callback('请输入正确邮箱')
    }
    callback()
  }

  validateConfirmPassword = (rules: any, value: any, callback: any) => {
    const { getFieldValue } = this.props.form
    const password = getFieldValue('passWord')
    if(value && password !== value) {
      callback('请输入正确确认密码')
    }
    callback()
  }

  /**分配角色 */
  grantRole = (params: any, tips: string) => {
    axios(this.api.grantRoles, params, false).then(({ code, data }) => {
      if(code && code === 200) {
        this.$message.success(tips)
        this.props.history.replace('/user-management/permission')
      }
    })
  }

  /**页面事件 */
  onSubmit = (e: any) => {
    e.preventDefault()

    const { form } = this.props
    form.validateFields((err, value) => {
      if (err) {return}

      const urlParams = HttpUtil.parseUrl(this.props.location.search)
      if (urlParams && urlParams.hasOwnProperty('id')) {
      /**编辑 */

        const { id } = urlParams
        const userInfoParams = {
          userID: id,
          userName: value.userName,
          userPhone: value.userPhone,
          userMail: value.userMail
        }
        const rolesParams = {
          userID: id,
          roles: value.rolesPermission
        }
        axios(this.api.userEdit, userInfoParams, false).then(({ code, data }) => {
          if(code && code === 200) {
            this.grantRole(rolesParams, '编辑成功')
          }
        })
      } else {
      /**新增 */

        const { publicKey } = this.state
        const encrypt = new JSEncrypt.JSEncrypt()
        encrypt.setPublicKey(publicKey)
        const rsaPassWord = encrypt.encrypt(value.passWord)
        const userInfoParams = {
          userName: value.userName,
          userPhone: value.userPhone,
          userMail: value.userMail,
          userPassword: rsaPassWord
        }
        axios(this.api.userAdd, userInfoParams, false).then(({ code, data }) => {
          if(code && code === 200) {
            const rolesParams = {
              userID: data.userId,
              roles: value.rolesPermission
            }
            this.grantRole(rolesParams, '添加成功')
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18
      }
    }
    const urlParams = HttpUtil.parseUrl(this.props.location.search)
    const { roleList, rolesPermission } = this.state

    return (
      <div className='user-edit'>
        <Form onSubmit={this.onSubmit}>
          <SearchHeader title={urlParams && urlParams.hasOwnProperty('id') ? '编辑用户' : '添加用户'} cancelBlock={true}>
            <Item {...formLayout} label='用户姓名'>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名'
                  }
                ]
              })(
                <Input placeholder='请输入用户姓名' />
              )}
            </Item>
            <Item {...formLayout} label='用户手机号'>
              {getFieldDecorator('userPhone', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户手机号'
                  },
                  {
                    validator: this.validatePhoneNumber
                  }
                ]
              })(
                <Input placeholder='手机号作为登陆账号及密码找回，请认真填写' maxLength={11} />
              )}
            </Item>
            <Item {...formLayout} label='用户邮箱'>
              {getFieldDecorator('userMail', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户邮箱'
                  },
                  {
                    validator: this.validateMail
                  }
                ]
              })(
                <Input placeholder='请输入用户邮箱' />
              )}
            </Item>
            <Item {...formLayout} label='所属角色'>
              {getFieldDecorator('rolesPermission', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属角色'
                  }
                ],
                initialValue: rolesPermission
              })(
                <Group style={{width: '100%'}}>
                  {
                    roleList.length > 0 && roleList.map((item: any, index: number) => {
                      return (
                        <Checkbox value={item.charID} key={item.charID}>{item.charName}</Checkbox>
                      )
                    })
                  }
                </Group>
              )}
            </Item>
            {
              !urlParams &&
              <>
                <Item {...formLayout} label='登录密码'>
                  {getFieldDecorator('passWord', {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录密码'
                      }
                    ]
                  })(
                    <Input type='password' onChange={() => { this.props.form.validateFields(['passWordComfirm'], {force: true}) }} placeholder='请输入登录密码' />
                  )}
                </Item>
                <Item {...formLayout} label='确认密码'>
                  {getFieldDecorator('passWordComfirm', {
                    rules: [
                      {
                        required: true,
                        message: '请确认密码'
                      },
                      {
                        validator: this.validateConfirmPassword
                      }
                    ]
                  })(
                    <Input type='password' placeholder='请确认密码' />
                  )}
                </Item>
              </>
            }
            <Row>
              <Col offset={6}>
                <Button type='primary' htmlType='submit'>提交</Button>              
              </Col>
            </Row>
          </SearchHeader>
        </Form>
      </div>
    )
  }
}

export default Form.create<FormProps>()(UserEdit)