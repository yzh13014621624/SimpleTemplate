/*
 * @description: 账户设置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:12:09
 * @LastEditTime: 2020-03-20 20:52:42
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { Avatar, Form, Input, Button, Row } from 'antd'
import { AesUtil } from 'utils'
import { hot } from 'react-hot-loader'

import './index.styl'

import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'

interface AccountProps extends BaseProps, FormComponentProps {}
interface AccountState {
  disabled: boolean
}

const { Item, create } = Form
const { encrypt } = AesUtil
const regPassword = /[^0-9a-zA-Z]/g
@hot(module)
class Account extends RootComponent<AccountProps, AccountState> {
  constructor (props: AccountProps) {
    super(props)
    this.state = {
      disabled: false
    }
  }

  componentDidMount () {
    this.setButtonStatus()
  }

  transformInputValue = (value: string) => value.replace(regPassword, '')

  setError = (value: string) => {
    this.props.form.setFields({
      confirmPassword: {
        value,
        errors: [new Error('密码与确认密码不一致')]
      }
    })
  }

  /* 设置 button 按钮的状态 */
  setButtonStatus = () => {
    setTimeout(() => {
      const { oldPassword, newPassword, confirmPassword } = this.props.form.getFieldsValue()
      const disabled = !(oldPassword && newPassword && confirmPassword)
      this.setState({ disabled })
    }, 0)
  }

  confirmChangePassword = () => {
    console.log(this.lastClickTime)
    const {
      props: {
        form: { getFieldsValue },
        mobxGlobal: { admin: { userPhone }, loginOut },
        history: { replace }
      },
      setError,
      axios: { request },
      api: { publicChangeUserPassword },
      $message
    } = this
    const { oldPassword, newPassword, confirmPassword } = getFieldsValue()
    if (newPassword !== confirmPassword) {
      setError(confirmPassword)
      return
    }
    const params = {
      userPhone,
      oldPass: encrypt(oldPassword),
      newPass: encrypt(newPassword)
    }
    request(publicChangeUserPassword, params).then(res => {
      $message.success('修改成功')
      loginOut()
      replace('/login')
    })
  }

  render () {
    const {
      props: {
        form: { getFieldDecorator, resetFields },
        mobxGlobal: { admin: { userName }}
      },
      state: { disabled },
      setButtonStatus,
      confirmChangePassword,
      preventMoreClick
    } = this
    return (
      <div id="update_account">
        <Avatar size={64} icon="user" />
        <Form layout="inline" onSubmit={() => preventMoreClick(confirmChangePassword)}>
          <Item label="用户姓名">
            <Input placeholder="请输入用户姓名" disabled value={userName} />
          </Item>
          <Item label="旧密码">
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true, message: '请输入旧密码' }],
            })(<Input placeholder="请输入旧密码" minLength={6} maxLength={18} type="password" allowClear onChange={setButtonStatus} />)}
          </Item>
          <Item label="新密码">
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: '请输入新密码' }, { min: 6, message: '6-18位，可纯数字、纯字母、数字加字母' }],
              getValueFromEvent: (e: any) => {
                e.persist()
                return this.transformInputValue(e.target.value)
              }
            })(<Input placeholder="请输入新密码" minLength={6} maxLength={18} type="password" allowClear onChange={setButtonStatus} />)}
          </Item>
          <Item label="确认密码">
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: '再次输入新密码' }, { min: 6, message: '6-18位，可纯数字、纯字母、数字加字母' }],
              getValueFromEvent: (e: any) => {
                e.persist()
                return this.transformInputValue(e.target.value)
              }
            })(<Input placeholder="请再次输入新密码" minLength={6} maxLength={18} type="password" allowClear onChange={setButtonStatus} />)}
          </Item>
          <Row className="button_wrapper">
            <Button size="large" onClick={() => resetFields()}>重置</Button>
            <Button type="primary" size="large" htmlType="submit" disabled={disabled}>提交</Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default create<AccountProps>()(Account)