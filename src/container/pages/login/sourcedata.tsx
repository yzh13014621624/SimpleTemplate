/*
 * @description: 登录界面
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:52:24
 * @LastEditTime: 2020-06-09 14:27:55
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { Card, Form, Row, Input, Button, Tabs } from 'antd'
import { SysUtil, AesUtil, globalEnum } from 'utils'

import { hot } from 'react-hot-loader'

import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import axios from './utils'
import './index.styl'
import bg from 'assets/images/login/login_bg.png'
import placeholder from 'assets/images/login/placeholder.png'
import iconPhoneNumber from 'assets/images/login/phone-number.png'
import iconPassword from 'assets/images/login/password.png'
import iconVerifyCode from 'assets/images/login/verify-code.png'

interface LoginProps extends BaseProps, FormComponentProps {}

interface LoginState {
  verifyErrMsg: string
  passwordErrMsg: string
  tips: string
  rememberPassword: boolean // 是否记住密码
  disabled: boolean // 禁用点击按钮
  isSending: boolean // 是否发送验证码中
  loginInfo: {
    phoneNumber: string
    password: string
  }
}

let count = 60
const tips = '发送验证码'
const { Item } = Form
const { TabPane } = Tabs

@hot(module)
class Login extends RootComponent<LoginProps, LoginState> {
  loginTime = new Date().getTime()
  loginType = 1
  countTimerId: any = null
  verifyCode: string = ''

  constructor (props: LoginProps) {
    super(props)
    this.state = {
      verifyErrMsg: '',
      passwordErrMsg: '',
      tips: tips,
      rememberPassword: true,
      disabled: false,
      isSending: false,
      loginInfo: {
        phoneNumber: '',
        password: ''
      }
    }
  }

  componentDidMount () {
    // this.getRememberdMessage()
    this.setButtonStatus(1)
  }

  /* 获取记住的账号和密码 */
  getRememberdMessage () {
    const rememberdMessage = SysUtil.getLocalStorage(globalEnum.cehckPwd)
    if (rememberdMessage) {
      const { password } = rememberdMessage
      this.setState({ loginInfo: rememberdMessage, rememberPassword: !!password })
    }
  }

  togglePanel = (t: number) => {
    this.props.form.resetFields()
    this.loginType = t
    this.setState({
      disabled: false,
      verifyErrMsg: '',
      passwordErrMsg: ''
    })
  }

  /* 设置 button 按钮的状态 */
  setButtonStatus = (t: number) => {
    const { phoneNumber, password, mobileNumber, sixVerifyCode } = this.props.form.getFieldsValue()
    const disabled = t < 2 ? !(phoneNumber && password) : !(mobileNumber && sixVerifyCode)
    this.setState({
      disabled,
      verifyErrMsg: '',
      passwordErrMsg: ''
    })
  }

  getVerifyCode = () => {
    if (this.state.isSending) return
    const {
      api: { publibGetVerifyCode },
      props: { form: { getFieldsValue } }
    } = this
    const request = axios
    const { mobileNumber = '' } = getFieldsValue()
    request(publibGetVerifyCode, { userPhone: mobileNumber }).then(({ data }) => {
      this.countTime()
      // this.verifyCode = data
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

  /* 登录 */
  handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {
      props: {
        form: { validateFields },
        mobxGlobal: { setAdminInfo, setAuthorityList },
        mobxTabs: { filterTopTabData },
        history: { replace }
      },
      api: { publicLogin },
      loginType,
      $message
    } = this
    const request = axios
    const loginByPassword = loginType === 1
    validateFields((err: any, data: any) => {
      if (!err) {
        const {
          phoneNumber, password, rememberPassword,
          mobileNumber, sixVerifyCode
        } = data
        const params = {
          userPhone: loginByPassword ? phoneNumber : mobileNumber,
          userPassword: AesUtil.encrypt(password),
          loginType: loginByPassword ? 200 : 100,
          authCode: sixVerifyCode
        }
        request(publicLogin, params, true)
          .then(({ data }) => {
            const { authoritis, user } = data
            if (authoritis.length) {
              authoritis.push('-1')
              setAdminInfo(user)
              setAuthorityList(authoritis)
              SysUtil.setSessionStorage(globalEnum.auth, authoritis)
              SysUtil.setSessionStorage(globalEnum.admin, user)
              this.axios.cacheAxiosHeaderConfig()
              filterTopTabData()
              $message.success('登录成功！')
              replace('/home/panel')
            } else {
              this.error('对不起您没有权限！')
            }
          })
          .catch(({ msg }) => {
            if (loginByPassword) this.setState({ passwordErrMsg: msg })
            else this.setState({ verifyErrMsg: msg })
          })
      }
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, history: { push } },
      state: { verifyErrMsg, passwordErrMsg, rememberPassword, disabled, loginInfo: { phoneNumber, password }, isSending, tips },
      loginType,
      setButtonStatus,
      getVerifyCode
    } = this
    const isRequires = loginType === 1
    return (
      <div id="login-container" style={{ background: `url(${bg}) center center no-repeat` }}>
        <Card className="login_wrapper">
          <img src={placeholder} alt="" />
          <Form onSubmit={this.handlerSubmit}>
            <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ marginBottom: 0 }} onChange={(k: string) => this.togglePanel(+k)}>
              <TabPane key="1" tab="账号密码登录">
                <div className="error_tips">{passwordErrMsg}</div>
                <Item>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: phoneNumber,
                    rules: [{ required: isRequires }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return e.target.value.replace(/[^0-9]/g, '')
                    }
                  })(
                    <Input
                      allowClear
                      placeholder="请输入用户名称"
                      maxLength={11}
                      prefix={<img src={iconPhoneNumber} />}
                      onChange={setButtonStatus.bind(this, 1)} />
                  )}
                </Item>
                <Item className="six_code">
                  {getFieldDecorator('password', {
                    initialValue: password,
                    rules: [{ required: isRequires }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return e.target.value.replace(/[^a-zA-Z_0-9]/g, '')
                    }
                  })(
                    <Input
                      allowClear
                      type="password"
                      placeholder="请输入登录密码"
                      prefix={<img src={iconPassword} />}
                      onChange={setButtonStatus.bind(this, 1)} />
                  )}
                </Item>
                {/* <Item className="verify_wrapper">
                  {getFieldDecorator('verifyCode', {
                    rules: [{ required: isRequires }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return e.target.value.replace(/[^0-9]/g, '')
                    }
                  })(
                    <Input
                      allowClear
                      placeholder="请输入验证码"
                      maxLength={4}
                      prefix={<img src={iconVerifyCode} />}
                      suffix={<img className="login-img" onClick={getCaptcha} src={captchaSrc} />}
                      onChange={setButtonStatus.bind(this, 1)} />
                  )}
                </Item> */}
                {/* <Item className="check_item">
                  {getFieldDecorator('rememberPassword', {
                    initialValue: rememberPassword,
                    valuePropName: 'checked'
                  })(
                    <Checkbox>记住密码</Checkbox>
                  )}
                </Item> */}
              </TabPane>
              <TabPane key="2" tab="手机验证码登录">
                <div className="error_tips">{verifyErrMsg}</div>
                <Item>
                  {getFieldDecorator('mobileNumber', {
                    rules: [{ required: !isRequires }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return e.target.value.replace(/[^0-9]/g, '')
                    }
                  })(
                    <Input
                      allowClear
                      placeholder="请输入手机号"
                      maxLength={11}
                      prefix={<img src={iconPhoneNumber} />}
                      onChange={setButtonStatus.bind(this, 2)} />
                  )}
                </Item>
                <Item className="six_code">
                  {getFieldDecorator('sixVerifyCode', {
                    rules: [{ required: !isRequires }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return e.target.value.replace(/[^0-9]/g, '')
                    }
                  })(
                    <Input
                      placeholder="请输入验证码"
                      prefix={<img src={iconVerifyCode} />}
                      suffix={<span className={`verify_code ${isSending ? 'sending' : ''}`} onClick={getVerifyCode}>{tips}</span>}
                      maxLength={6}
                      allowClear
                      onChange={setButtonStatus.bind(this, 2)} />
                  )}
                </Item>
              </TabPane>
            </Tabs>
            <Button type="primary" shape="round" disabled={disabled} className="button_login" htmlType="submit">登录</Button>
            {
              isRequires &&
              <Row style={{ paddingTop: 15, textAlign: 'right' }}>
                <a href="javascript:" onClick={() => push('/reset-password') } >忘记密码?</a>
              </Row>
            }
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(Login)
