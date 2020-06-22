
import * as React from 'react'
import './index.less'
import { RootComponent } from 'components'
import { BaseProps } from 'typings/global'
import { Form,Input,Select} from 'antd'
import { FormComponentProps } from 'antd/es/form'
import City from 'assets/data/City'
const { Option } = Select
const {Item} = Form

interface State {
  confirmDirty:boolean,
  addParams: {
    address:string,
    area:string,
    city:string,
    company:string,
    contactName:string,
    mobile:string,
    name:string,
    province:string
  },
  cities: any,
  area: any,
}
interface FormProps extends BaseProps,FormComponentProps{}

class AddProvider extends RootComponent<FormProps,State>{
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
        province: "",
      },
      cities: City[0].areaList,
      area: City[0].areaList[0].areaList,
    }
  }
//添加供应商信息接口
insertInfo(params: any) {
  this.axios.request(this.api.storeInsertSupplier, params).then(({ code, data}) => {
    code === 200  && this.props.history.push('/shop-management/provider')
  })
}
handleSubmit = (e: any) => {//提交校验
  e.preventDefault()
  const getFieldsValue = this.props.form.getFieldsValue()
  this.props.form.validateFieldsAndScroll((err: any, values: any) => {
    if (!err) {
     this.insertInfo(getFieldsValue)
    }
  })
}
handleConfirmBlur = (e: any) => {
  const { value } = e.target;
  this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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

  render() {
    const {
      state:{ cities, area },
      props:{ form: { getFieldDecorator } }
    } = this
    return(
      <div className="provider-add">
        <div className="add-header">
          <p className='title'>添加供应商</p>
        </div>
        <Form onSubmit={this.handleSubmit} className="form-style">  
          <Item label="供应商名称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}>
              {getFieldDecorator('name', {
                  rules: [
                  {
                    required: true,
                    message: '供应商名称,最多20个字,中文汉字',
                    max: 20,
                    pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                  }
                  ],
                })(<Input placeholder="输入供应商名称" allowClear/>)}
          </Item>  
          <Item label="所属公司"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 4 }}>
            {getFieldDecorator('company', {
                rules: [
                {
                  required: true,
                  message: '公司名称,最多20个字,中文汉字',
                  max: 20,
                  pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                }
                ],
            })(<Input placeholder="输入所属行业" allowClear/>)}
          </Item>
          <Item label="通讯地址"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}
            >
            {getFieldDecorator('province', {
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
                rules: [
                {
                  required: true,
                  message: '请输入通信地址'
                },
                ],
            })(
                <Select placeholder="区">
                  {area.map((city: any) => (
                  <Option key={city.value} value={city.value}>
                    {city.name}
                  </Option>
                ))}
                </Select>
            )}
          </Item>
          <Item label="详细地址"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}
           >
              {getFieldDecorator('address', {
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
          wrapperCol={{ span: 4 }}>
              {getFieldDecorator('contactName', {
                  rules: [
                  {
                    required: true,
                    message: '联系人名称,最多6个字,中文汉字',
                    max: 6,
                    pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,6}$/, 'g')
                  }
                  ],
              })(<Input placeholder="输入联系人"allowClear/>)}
          </Item>
          <Item label="联系方式"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 4 }}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                      required: true,
                      message:'请输入正确的手机号',
                      pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/, 'g')
                  },
                  ],
              })(<Input placeholder="输入联系方式" allowClear/>)}
          </Item>
          <Item>
            <button className="ant-edit-btn" type="submit">提交</button>  
          </Item>
        </Form>
      </div>
    )
  }
}
export default Form.create<FormProps>()(AddProvider)