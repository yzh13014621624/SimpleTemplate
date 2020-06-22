/*
 * @description: 用户详情页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-04 19:50:18
 * @LastEditTime: 2020-03-20 20:22:11
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Row, Col, Button, Input } from 'antd'
import { SearchHeader } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import HttpUtil from 'utils/HttpUtil'
import './index.less'
import axios from 'pages/login/utils/index'
import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps, FormComponentProps { }
interface UserState {
  userInfo: any,
  rolesPermission: any[]
}

const { Item } = Form

@hot(module)
class UserDetail extends RootComponent<FormProps, UserState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      userInfo: {},
      rolesPermission: []
    }
  }
  componentDidMount() {
    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const newRequest = {
      ...this.api.findUser,
      path: `${this.api.findUser.path}${id}`
    }
    const newRoleRequest = {
      ...this.api.findGrantedRoles,
      path: `${this.api.findGrantedRoles.path}${id}`
    }
    axios(newRequest, {}, false).then(({ code, data }) => {
      if (code && code === 200) {
        this.setState({
          userInfo: data
        })
      }
    })

    axios(newRoleRequest, {}, false).then(({ code, data }) => {
      if (code && code === 200) {
        let permissionList: any[] = []
        data.forEach((element: any) => {
          if (element.checked) {
            permissionList.push(element.charName)
          }
        })
        this.setState({
          rolesPermission: permissionList
        })
      }
    })
  }

  handleRolesString = (rolesPermission: any[]) => {
    let renderString = ''
    if (!rolesPermission || rolesPermission.length === 0) {
      return renderString
    }
    rolesPermission.forEach((c: any, i: number) => {
      if (i !== 0) {
        renderString += '、'
      }
      renderString += c
    })
    return renderString
  }

  render() {
    const formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18
      }
    }

    const { userInfo, rolesPermission } = this.state

    return (
      <div className='user-edit'>
        <SearchHeader title='用户详情' cancelBlock={true}>
          <Item {...formLayout} label='用户姓名'>
            <div>{userInfo.userName}</div>
          </Item>
          <Item {...formLayout} label='用户手机号'>
            <div>{userInfo.userPhone}</div>
          </Item>
          <Item {...formLayout} label='用户邮箱'>
            <div>{userInfo.userMail}</div>
          </Item>
          <Item {...formLayout} label='所属角色'>
            {
              this.handleRolesString(rolesPermission)
            }
          </Item>
        </SearchHeader>
      </div>
    )
  }
}

export default Form.create<FormProps>()(UserDetail)