/*
 * @description:
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-21 17:08:57
 * @LastEditTime: 2020-04-30 11:18:36
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form } from 'antd'
import { BaseProps } from 'typings/global'
import { HttpUtil } from 'utils'
import { FormComponentProps } from 'antd/es/form'
import City from 'assets/data/City'
import './index.less'

const { Item } = Form

interface State {
  details: any,
  cities: any,
  area: any,
  province: any
}
interface FormProps extends BaseProps, FormComponentProps{}

class StoreDetail extends RootComponent<FormProps, State> {
  constructor (props: any) {
    super(props)
    this.state = {
      details: [],
      cities: City[0].areaList,
      area: City[0].areaList[0].areaList,
      province: ''
    }
  }

componentDidMount = () => {
  this.getInfo()
}

// 获取客户详情
getInfo () {
  const { id } = HttpUtil.parseUrl(window.location.href)
  this.axios.request(this.api.storeFindShopByShopId, { shopId: id }).then(({ data }) => {
    this.setState({
      details: data
    })
    console.log(data)
  })
}

   /** 省 change */
   ProvinceChange = (value: any) => {
     const citys = City.filter(
       (province: any) => province.value === Number(value)
     ) // [0].areaList
     console.log(citys, 'cs')
     if (citys.length > 0) {
       const cities = citys[0].areaList
       const area = citys[0].areaList[0].areaList
       console.log(cities, 'citiescitiescities')
       this.props.form.setFieldsValue({ city: cities[0].value })
       this.props.form.setFieldsValue({ area: cities[0].areaList[0].value })
       this.setState({
         cities,
         area,
         province: citys[0]
       })
     }
   }

   render () {
     const {
       state: { details, cities, area, province },
       props: { form: { getFieldDecorator } }
     } = this
     return (
       <div className="detail" >
         <Form>
           <div className="store-tag"> 门店基本信息</div>
           <Item label="门店名称"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('name', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.name}</span>)}
           </Item>
           <Item label="开始营业时间"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('beginTime', {
               rules: [
                 { required: true }
               ]
             })(<span>{details && details.beginTime ? details.beginTime : ''}</span>)}
           </Item>
           <Item label="结束营业时间"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('endTime', {
               rules: [
                 { required: true }
               ]
             })(<span>{details && details.endTime ? details.endTime : ''}</span>)}
           </Item>
           <Item label="门店LOGO"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('logoImgUrl', {
               rules: [
                 { required: true }
               ]
             })(<img src={details.logoImgUrl} style={{ width: '50px' }}/>)}
           </Item>
           <Item label="经营执照"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('licenseUrl', {
               rules: [
                 { required: true }
               ]
             })(<img src ={details.licenseUrl} style={{ width: '50px' }} />)}
           </Item>
           <Item label="所在地区"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('area', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.province}{details.city}{details.area}</span>
             )}
           </Item>
           <Item label="门店地址"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('address', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.address}</span>)}
           </Item>
           <Item label="门店联系人"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('linkman', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.linkman}</span>)}
           </Item>
           <Item label="联系方式"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('linkmanPhone', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.linkmanPhone}</span>)}
           </Item>
           <Item label="门店账号"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('account', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.account}</span>)}
           </Item>
           <Item label="门店类型"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('type', {
               rules: [
                 { required: true }
               ]
             })(<span>{details.type == 0 ? '直营' : details.type == 1 ? '加盟' : '合作'}</span>)}
           </Item>
           <Item label="门店业务类型"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 10 }}>
             {getFieldDecorator('bus', {
               rules: [
                 { required: true }
               ]
             })(<span>{Number(details.bus1) === 1 ? '外带' : ''} {Number(details.bus2) === 1 ? '堂吃' : ''} {Number(details.bus3) === 1 ? '外送' : ''}</span>)}
           </Item>
         </Form>
       </div>
     )
   }
}
export default Form.create<FormProps>()(StoreDetail)
