

import * as React from 'react'
import { RootComponent } from 'components'
import { Form} from 'antd';
import { HttpUtil } from 'utils'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'

const {Item} = Form

interface State {
  details: any,
}
interface FormProps extends BaseProps,FormComponentProps{}

class ClientDetail extends RootComponent<FormProps,State> {
  constructor(props: any){
    super(props)
    this.state={
      details:[],
    }
}
componentDidMount() {
  this.getInfo()
}
//获取客户详情
getInfo() {
  const { id } = HttpUtil.parseUrl(window.location.href)
  this.axios.request(this.api.storeCustomerInfo,{ id }).then(({data}) => {
    this.setState({
      details: data
    })
  })
}

  render() {
    const { 
      state:{ details },
      props:{ form: { getFieldDecorator } }
    } = this
    return(
      <div className="detail">
        <Form>
        <Item label="客户名称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}>
              {getFieldDecorator('name', {
                  rules: [
                  { required: true}
                  ],
              })(<span>{details.name}</span>)}
          </Item>  
          <Item label="所属公司"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}>
            {getFieldDecorator('company', {
                rules: [
                { required: true }
                ],
            })(<span>{details.company}</span>)}
          </Item>
          <Item label="通讯地址"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}>
            {getFieldDecorator('address', {
                rules: [
                { required: true }
                ],
            })(<span>{details.provinceName}{details.cityName}{details.areaName}{details.address}</span>)}
          </Item>
          <Item label="联系人"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}>
            {getFieldDecorator('userName', {
                rules: [
                { required: true }
                ],
            })(<span>{details.contactName}</span>)}
          </Item>
          <Item label="联系方式"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}>
            {getFieldDecorator('tel', {
                rules: [
                  { required: true }
                  ],
            })(<span>{details.mobile}</span>)}
          </Item>
        </Form>
      </div>
       )
     }
  }
export default Form.create<FormProps>()(ClientDetail)
