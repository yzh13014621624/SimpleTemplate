/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-29 14:53:27
 * @LastEditTime: 2019-09-09 10:52:14
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import './index.less'
import { RootComponent } from 'components'
import { BaseProps } from 'typings/global'
import { Form, Input, Select } from 'antd'
import { HttpUtil } from 'utils'
import City from 'assets/data/City'
import { FormComponentProps } from 'antd/es/form'

const { Option } = Select
const {Item} = Form

interface State {
  confirmDirty:boolean,
  information: any,
  addParams: any,
  cities: any,
  area: any,
}
interface FormProps extends BaseProps,FormComponentProps{}

class EditClient extends RootComponent<FormProps,State>{
  constructor(props: any){
    super(props)
    this.state={
      confirmDirty:false,
      addParams: {
        address: "",
        area: "",
        city: "",
        company: "",
        contactName: "",
        mobile: "",
        name: "",
        province: ""
      },
      information:[],
      cities: City[0].areaList,
      area: City[0].areaList[0].areaList,
    }
  }
  componentDidMount() {
    const { id } = HttpUtil.parseUrl(window.location.href)
    this.EditInfo(id)
  }
  
  //获取客户详情
  EditInfo(id: any) {
    this.axios.request(this.api.storeCustomerInfo,{ id }).then(({ data }) => {
      this.setState({
        information: data
      }, () => {
        this.ProvinceChange(data.province)
      })
    })
  }

   /** 省 change */
   ProvinceChange = (value: any) => {
    let citys = City.filter(
      (province: any) => province.value === Number(value)
    ) // [0].areaList
    if (citys.length > 0) {
      let cities = citys[0].areaList
      let area = citys[0].areaList[0].areaList
      console.log(cities, 'citiescitiescities')
      this.props.form.setFieldsValue({ city: cities[0].value })
      this.props.form.setFieldsValue({ area: cities[0].areaList[0].value })
      this.setState({
        cities,
        area
      })
    }
  }
 
  //提交校验
  handleSubmit = (e: any) => {
    e.preventDefault();
    const getFieldsValue = this.props.form.getFieldsValue()
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        this.updateInfo(getFieldsValue)
      }
    })
  }
  //更新客户信息
  updateInfo(params: any) {
    const { id } = HttpUtil.parseUrl(window.location.href)
    this.axios.request(this.api.storeEditInfo, {...params, id }).then(({ code })=> {
      code === 200 && this.props.history.push('/shop-management/client')
  })
  }
  handleConfirmBlur = (e: any) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  
  render() {
    const {
      state:{ information, cities, area },
      props:{ form: { getFieldDecorator } }
    } = this
    return(
      <div className="client-add">
        <div className="add-header">
          <p className='title'>客户编辑</p>
        </div>
        <Form onSubmit={this.handleSubmit} className="form-style">  
          <Item label="客户名称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}
            className="ant-form-item" >
            {getFieldDecorator('name', {
                initialValue: information.name,
                rules: [
                {
                  required: true,
                  message:'客户名称,最多20个字,中文汉字',
                  max:20,
                  pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                },
              ],
            })(<Input allowClear/>)}
          </Item>  
          <Item label="所属公司"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 4 }} >
          {getFieldDecorator('company', {
            initialValue: information.company,
              rules: [
              {
                required: true,
                message: '所属公司,最多20个字,中文汉字',
                max:20,
                pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
              }
            ],
          })(<Input allowClear/>)}
          </Item>
          <Item label="通讯地址"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}
            >
            {getFieldDecorator('province', {
              initialValue: information.province,
                rules: [
                {
                  required: true,
                  message: '请输入通信地址'
                },
                ],
            })(
                <Select
                className='special'
                placeholder='省'
                showSearch
                allowClear
                onChange={this.ProvinceChange}
              >
                {City.map((province: any) => (
                  <Option
                    key={province.value}
                    ref="province"
                    value={province.value}
                  >
                    {province.name}
                  </Option>
                ))}
                </Select>
              )}
               {getFieldDecorator('city', {
                 initialValue: information.city,
                rules: [
                {
                  required: true,
                  message: '请输入通信地址'
                },
                ],
            })(
                <Select
                className='special'
                placeholder='市'
                allowClear
                >
                {cities.map((city: any) => (
                  <Option key={city.value} value={city.value} ref="city">
                    {city.name}
                  </Option>
                ))}
              </Select>
            )}
               {getFieldDecorator('area', {
                  initialValue: information.area,
                rules: [
                {
                  required: true,
                  message: '区'
                },
                ],
            })(
                <Select placeholder="请选择">
                  {area.map((city: any) => (
                  <Option key={city.value} value={city.value}>
                    {city.name}
                  </Option>
                ))}
                </Select>
            )}
          </Item>
          <Item label=""
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 6 }}
            style={{marginLeft:'568px'}}>
              {getFieldDecorator('address', {
                initialValue: information.address,
                  rules: [
                  {
                      required: true,
                      message:'请输入详细地址'
                  },
                  ],
              })(<Input placeholder="详细地址" allowClear/>)}
          </Item>
          <Item label="联系人"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }} >
            {getFieldDecorator('contactName', {
              initialValue: information.contactName,
                rules: [
                {
                  required: true,
                  message:'最多6个字，中文汉字',
                  max:6,
                  pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,6}$/, 'g') 
                }
              ],
              })(<Input allowClear/>)}
          </Item>
          <Item label="联系方式"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }} >
              {getFieldDecorator('mobile', {
                initialValue: information.mobile,
                rules: [
                  {
                    required: true,
                    message:'请输入正确的手机号',
                    pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/, 'g')
                  }
                ],
              })(<Input maxLength={11} allowClear/>)}
          </Item>
          <Item>
            <button className="ant-edit-btn" type="submit">提交</button>  
          </Item>
        </Form>
      </div>
    )
  }
}
export default Form.create<FormProps>()(EditClient)
