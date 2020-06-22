/*
 * @description: 忘记密码重置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-30 15:23:49
 * @LastEditTime: 2020-06-04 10:57:17
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { createHashHistory } from 'history'
import { Form, Input, Select, Button, Row } from 'antd'
import { hot } from 'react-hot-loader'
import { SysUtil, AesUtil } from 'utils'

import './index.styl'
import bg from 'assets/images/login/reset_password.png'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
interface ResetPasswordProps extends BaseProps, FormComponentProps {}
interface ResetPasswordState {
  isSending: boolean
  disabled: boolean
  tips: string
}

let count = 60
const tips = '获取验证码'
const { Item, create } = Form
const { encrypt } = AesUtil
const regPassword = /[^0-9a-zA-Z]/g
const history = createHashHistory()

@hot(module)
class ResetPassword extends RootComponent<ResetPasswordProps, ResetPasswordState> {
  verifyCode: string = ''
  countTimerId: any = null

  constructor (props: ResetPasswordProps) {
    super(props)
    this.state = {
      isSending: false,
      disabled: true,
      tips: tips
    }
  }

  transformInputValue = (value: string) => value.replace(regPassword, '')

  getVerifyCode = () => {
    if (this.state.isSending) return
    const {
      axios: { request },
      api: { publibGetVerifyCode },
      props: { form: { getFieldsValue } }
    } = this
    const { userPhone = '' } = getFieldsValue()
    request(publibGetVerifyCode, { userPhone }).then(({ data }) => {
      this.countTime()
      this.verifyCode = data
    })
  }

  countTime () {
    count--
    this.setState({
      tips: `倒计时${count}s`,
      isSending: true
    })
    this.countTimerId = setInterval(() => {
      count--
      if (count <= 0) {
        count = 60
        this.setState({
          tips: tips,
          isSending: false
        })
        clearInterval(this.countTimerId)
      } else {
        this.setState({
          tips: `倒计时${count}s`,
          isSending: true
        })
      }
    }, 1000)
  }

  setError = (value: string) => {
    this.props.form.setFields({
      confirmPassword: {
        value,
        errors: [new Error('新密码不一致')]
      }
    })
  }

  /* 设置 button 按钮的状态 */
  setButtonStatus = () => {
    const { userPhone, verifyCode, newPassword, confirmPassword } = this.props.form.getFieldsValue()
    const disabled = !(userPhone && verifyCode && newPassword && confirmPassword)
    this.setState({ disabled })
  }

  confirmChangePassword = () => {
    const {
      props: { form: { validateFields } },
      setError,
      axios: { request },
      api: { publicRetrievePassword },
      $message
    } = this
    validateFields((err, values) => {
      if (!err) {
        const { userPhone, newPassword, confirmPassword, verifyCode } = values
        if (newPassword !== confirmPassword) {
          setError(confirmPassword)
          return
        }
        const params = {
          userPhone,
          authCode: verifyCode,
          newPass: encrypt(newPassword)
        }
        request(publicRetrievePassword, params).then(() => {
          $message.success('修改成功')
          this.goLogin()
        })
      }
    })
  }

  goLogin = () => history.replace('/login')

  render () {
    const {
      props: {
        form: { getFieldDecorator }
      },
      state: { isSending, disabled, tips },
      getVerifyCode,
      confirmChangePassword,
      setButtonStatus
    } = this
    return (
      <div id="reset_password" style={{ background: `url(${bg}) center center no-repeat` }}>
        <h1 className="title">全逸早餐运营中台管理系统</h1>
        <Form layout="inline" onSubmit={confirmChangePassword}>
          <div className="guide">
            <span className="desc">找回密码</span>
            <a className="login" href="javascript:" onClick={this.goLogin}>去登陆&gt;</a>
          </div>
          <Row className="form_item">
            <Item>
              {getFieldDecorator('userPhone', {
                rules: [{ required: true, message: '请输入手机号' }],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return e.target.value.replace(/[^0-9]/g, '')
                }
              })(
                <Input
                  placeholder="请输入您的手机号"
                  maxLength={11}
                  allowClear
                  onChange={setButtonStatus} />
              )}
            </Item>
            <Button className={`verify_code ${isSending ? 'sending' : ''}`} onClick={getVerifyCode}>{tips}</Button>
          </Row>
          <Row className="form_item">
            <Item>
              {getFieldDecorator('verifyCode', {
                rules: [{ required: true, message: '请输入验证码' }],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return e.target.value.replace(/[^0-9]/g, '')
                }
              })(<Input placeholder="请输入验证码" maxLength={6} allowClear onChange={setButtonStatus} />)}
            </Item>
          </Row>
          <Row className="form_item">
            <Item>
              {getFieldDecorator('newPassword', {
                rules: [{ required: true, message: '请输入新密码' }, { min: 6, message: '6-18位，可纯数字、纯字母、数字加字母' }],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return this.transformInputValue(e.target.value)
                }
              })(<Input placeholder="请输入新密码" minLength={6} maxLength={18} type="password" allowClear onChange={setButtonStatus} />)}
            </Item>
          </Row>
          <Row className="form_item">
            <Item >
              {getFieldDecorator('confirmPassword', {
                rules: [{ required: true, message: '请重复新密码' }, { min: 6, message: '6-18位，可纯数字、纯字母、数字加字母' }],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return this.transformInputValue(e.target.value)
                }
              })(<Input placeholder="请重复新密码" minLength={6} maxLength={18} type="password" allowClear onChange={setButtonStatus} />)}
            </Item>
          </Row>
          <Row className="button_wrapper">
            <Button type="primary" size="large" htmlType="submit"disabled={disabled} >提交</Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default create<ResetPasswordProps>()(ResetPassword)
