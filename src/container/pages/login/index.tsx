/*
 * @description: 登录界面
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-12 14:52:24
 * @LastEditTime: 2020-06-09 19:06:26
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { Card, Form, Row, Input, Button, Tabs, Spin } from 'antd'
import { SysUtil, AesUtil, globalEnum, ComConfig } from 'utils/index'

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
import logo from 'assets/images/login/logo.png'

interface LoginProps extends BaseProps, FormComponentProps {}

interface LoginState {
  spinning: boolean
  base64LogoImage: any
  loginStatus: string
}

@hot(module)
class Login extends RootComponent<LoginProps, LoginState> {
  constructor (props: LoginProps) {
    super(props)
    this.state = {
      spinning: true,
      base64LogoImage: '',
      loginStatus: 'code' // code(扫码)  account 密码 accountcode验证码
    }
  }

  componentDidMount = () => {
    var image = new Image()
    image.crossOrigin = '*'
    image.src = logo
    image.onload = () => {
      const base64LogoImage = this.getBase64Image(image) // 转换之后的图片路径
      this.setState({ base64LogoImage })
    }
  }

  onLoad = () => {
    const { state: { base64LogoImage } } = this
    this.setState({ spinning: false }, () => {
      // 加载完成之后发送配置的信息
      const childFrameObj:any = document.getElementById('loginframe')
      // theme（主题颜色） icon（二维码图标） tips （二维码提示）  project（登录的项目）size (宽度大小：small middle large)
      childFrameObj.contentWindow.postMessage({
        qrCodeLink: 'https://hfw.sj56.com.cn/hfw/share/index.html#pd',
        project: 'ZC',
        theme: ' #19BC9C',
        icon: 'http://m.qpic.cn/psc?/V10yWiIW1cb57G/QBzlzF8iG*2NtSQ2AaEAUoVkp4GrfdUVErJD05u9*6O3KznmQlQdD5dtihXDVNO4tfNAfQqc.awY.2lQ8CvlLg!!/mnull&bo=MAIwAgAAAAADByI!&rf=photolist&t=5',
        tips: '好饭碗APP',
        size: 'middle'
      }, '*')
    })
    window.onmessage = ({ data: { logindata, token, msg, loginStatus }, origin }:any) => {
      this.setState({ loginStatus })
      // 判断是否存在值
      if (logindata && logindata.code === 200 && logindata.data) {
        // 设置项目的token, 具体看项目
        SysUtil.setSessionStorage(globalEnum.token, token) // 将登录成功的值进行处理
        this.handlerSubmit(logindata) // 是否存在返回的消息
      } else if (msg) {
        // 对消息进行处理
        this.error(msg)
      }
    }
  }

  /* 登录 */
  handlerSubmit = (p: any) => {
    const {
      props: {
        mobxGlobal: { setAdminInfo, setAuthorityList },
        mobxTabs: { filterTopTabData },
        history: { replace }
      },
      $message
    } = this
    console.log(p, 'data')
    const { code, data: { authDatas, authoritis, user } } = p
    if (code === 200) {
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
    }
  }

  getBase64Image = (img: any) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx: any = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
    const dataURL = canvas.toDataURL('image/' + ext)
    return dataURL
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, history: { push } },
      state: { spinning, loginStatus }
    } = this
    return (
      <div id="login-container" style={{ background: `url(${bg}) center center no-repeat` }}>
        <Card className="login_wrapper">
          <img src={placeholder} alt="" />
          <div className='qrcode'>
            <p className='qrcode-title'>全逸早餐管理系统</p>
            <Spin spinning={spinning}>
              <iframe
                id='loginframe'
                width='400Px'
                height='360Px'
                onLoad={this.onLoad}
                scrolling='no'
                frameBorder='0'
                src={ComConfig.loginItem}
              />
            </Spin>
            { loginStatus === 'account' && <span className='forgetpassword' onClick={() => push('/reset-password') } >忘记密码?</span> }
          </div>
        </Card>
      </div>
    )
  }
}

export default Form.create()(Login)
