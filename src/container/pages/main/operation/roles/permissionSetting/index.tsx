/*
 * @description: 权限设置界面
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-04 10:28:30
 * @LastEditTime: 2020-03-20 20:11:28
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */


import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Col, Input, Row, Button, Checkbox } from 'antd'
import { SearchHeader } from 'components/index'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import HttpUtil from 'utils/HttpUtil'
import './index.less'
import _ from 'lodash'
import axios from 'pages/login/utils/index'
import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps,FormComponentProps{}
interface ProductsState {
  checkAll: boolean,
  indeterminate: boolean,
  checkedList: string[],
  pageData: any[],
  plainOptions: any[]
}

const { Group } = Checkbox

@hot(module)
class User extends RootComponent<FormProps, ProductsState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      checkAll: false,
      indeterminate: false,
      checkedList: [],
      pageData: [],
      plainOptions: []
    }
  }
  componentDidMount() {
    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const newRequest = {
      ...this.api.findGrantedPerms,
      path: `${this.api.findGrantedPerms.path}${id}`
    }
    axios(newRequest, {}, false).then(({ code, data }) => {
      if (code && code === 200) {
        let options: any[] = []
        let checkedList: any[] = []
        data.forEach((element: any) => {
          options.push(element.authID)
          if (element.checked) {
            checkedList.push(element.authID)
          }
        })
        this.setState({
          pageData: data,
          plainOptions: options,
          checkedList: checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < options.length),
          checkAll: checkedList.length === options.length
        })
      }
    })
  }

  /**页面事件 */
  onChangeChecked = (checkedList: any) => {
    const { plainOptions } = this.state
    const checkAll = checkedList.length === plainOptions.length
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkAll
    })
  }

  handleCheckAll = (e: any) => {
    const { plainOptions } = this.state
    const { checked } = e.target
    this.setState({
      checkAll: checked,
      indeterminate: false,
      checkedList: e.target.checked ? plainOptions : []
    })
  }

  onSaveChange = () => {
    const { id } = HttpUtil.parseUrl(this.props.location.search)
    const { checkedList, pageData } = this.state
    const deepPageData = _.cloneDeep(pageData)
    /** 亲爱的后来的你，当你读到这段代码的时候请不要哭泣。因为总有人要来当这个傻逼 */
    const newCheckedList: any = []
    deepPageData.forEach(element => {
      checkedList.forEach(item => {
        if (item === element.authID) {
          newCheckedList.push(element.authID)
          element.children.forEach((firstChild: any) => {
            newCheckedList.push(firstChild.authID)
            firstChild.children.forEach((secendChild: any) => {
              newCheckedList.push(secendChild.authID)
            })
          })
        }
      })
    })
    const payload = {
      charID: id,
      perms: newCheckedList
    }
    axios(this.api.grantPerms, payload, false).then(({ code }) => {
      if(code && code === 200) {
        this.$message.success('授权成功')
        this.props.history.replace('/role-management/index')
      }
    })
  }

  render () {
    const { charName } = HttpUtil.parseUrl(this.props.location.search)
    const { checkAll, indeterminate, checkedList, pageData } = this.state
    return (
      <div className='permission'>
        <SearchHeader title={`当前角色：${charName}`} cancelBlock={true}>
          <Group onChange={this.onChangeChecked} style={{width: '100%'}} value={checkedList}>
            {
              pageData.length > 0 && pageData.map((item: any, index: number) => {
                return (
                  <SearchHeader title={item.authName} className='permission-search' key={item.authID}>
                    <Checkbox value={item.authID}>{item.authName}</Checkbox>
                  </SearchHeader>
                )
              })
            }
          </Group>
          <div className='select-all-container'>
            <Checkbox checked={checkAll} onChange={this.handleCheckAll} indeterminate={indeterminate}>选择全部</Checkbox>
          </div>
          <div className='save-button-container'>
            <Button className='save-button' type='primary' onClick={this.onSaveChange}>保存</Button>
          </div>
        </SearchHeader>
      </div>
    )
  }
}

export default Form.create<FormProps>()(User)