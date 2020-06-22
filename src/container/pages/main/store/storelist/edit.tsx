/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-29 14:53:27
 * @LastEditTime: 2019-09-16 18:52:33
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import './index.less'
import { RootComponent } from 'components'
import { BaseProps } from 'typings/global'
import { Form,Input,Select,Checkbox,Radio,DatePicker,Row,Col,TimePicker } from 'antd'
import City from 'assets/data/City'
import { FormComponentProps } from 'antd/es/form'
import { HttpUtil } from 'utils'
import { BaseUploadPic } from 'components/index'
import moment from 'moment'
import { OSSUtil } from 'utils'

const {Item} = Form
const { Option } = Select
const { Group  } = Checkbox
const format = 'HH:mm'

interface State{
  confirmDirty:boolean,
  value: number,
  addParams: any,
  information: any,
  cities: any,
  area: any,
  details: any,
  province: any,
  logoImgurl: any,
  licenseurl: any,
  bar: boolean
}
interface FormProps extends BaseProps,FormComponentProps{}

class StoreEdit extends RootComponent<FormProps,State> {
  beginTime: any = null
  constructor(props: any){
    super(props)
    this.state= {
      confirmDirty: false,
      value:1,
      addParams: {
        address: "",
        area: "",
        city: "",
        company: "",
        contactName: "",
        mobile: "",
        name: "",
        province: "",
        endTime: "", // 结束营业时间
        beginTime:""
      },
      details:[],
      information:[],
      cities: City[0].areaList,
      area: City[0].areaList[0].areaList,
      province:'',
      logoImgurl:[],//门店logo短路径
      licenseurl:[],//营业执照短路径
      bar: false //判断开始时间

    }
  }
  componentDidMount = () => {
    this.getInfo()
  }
  // 获取客户详情
  getInfo() {
    const {id} = HttpUtil.parseUrl(window.location.href)
    this.axios.request(this.api.storeFindShopByShopId,{ shopId: id }).then(({data}) => {
      this.setState({
        information: data,
        logoImgurl: data.logoImg,
        licenseurl: data.license
      },() => {
        this.ProvinceChange(data.provinceId)
      })
    })
   
  }
  //提交校验
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err: any, values: any) => {
      console.log(values)
      const pic =  await this.getOSSUrl(values.license)
      console.log(pic)
      const {id} = HttpUtil.parseUrl(window.location.href)
      let {  province, bus, beginTime, endTime, license = [], logoImg = [] } = values
      console.log(province, 'province98')
      const { logoImgurl, licenseurl } = this.state
      beginTime = moment(beginTime).format('HH:mm')
      endTime = moment(endTime).format('HH:mm')
      if (!err) {
        // if(typeof province  === 'string'){
        //   province = this.state.province.value
        //   console.log(province, '123')
        // }  
        console.log(logoImg,"logoImg",license,"license")
        if(logoImg[0].flag === true){
          const res: any = await this.getOSSUrl(values.logoImg)
            logoImg = res.name
        }else{
          logoImg=logoImgurl
        }
        if(license[0].flag === true){
          const res: any = await this.getOSSUrl(values.license)
          license = res.name
        } else {
          license = licenseurl
        }
        if(beginTime == "00:00") {
          this.isDisabledHours()
        }   
        const bus1 = bus.indexOf(0)
        const bus2 = bus.indexOf(1)
        const bus3 = bus.indexOf(2)
        const params = {
          ...values,
          // bus: undefined,
          bus1: bus1 >= 0 ? 1 : 0,
          bus2: bus2 >= 0 ? 1 : 0,
          bus3: bus3 >= 0 ? 1 : 0,
          logoImg,
          license,
          beginTime,
          endTime,
          shopId:id,
          province,
        }
        delete params.bus
        this.storeUpdateInfo(params)
      }
    })
  }
//禁用小时
    isDisabledHours = () => {
      const { bar } = this.state
      if (bar) {
         return [0]
      } else {
        return [-1]
      }
    }
 
  async getOSSUrl (list: any[]) {
    if (!list.length) return
    const item = list[0]
    return await OSSUtil.multipartUpload(item.file, 'shop')
  }

  //更新客户信息
  storeUpdateInfo(params: any) {
    const { id } = HttpUtil.parseUrl(window.location.href)
    this.axios.request(this.api.storeUpdateShop, {...params}).then(({ code })=> {
      code === 200 && this.props.history.push('/shop-management/list')
  })
}
   /** 省 change */
   ProvinceChange = (value: any) => {
    let citys = City.filter(
      (province: any) => province.value === Number(value)
    ) // [0].areaList
    console.log(citys,'cs')
    if (citys.length > 0) {
      let cities = citys[0].areaList
      let area = citys[0].areaList[0].areaList
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
   onChange = (current:any, checkTime:any) => {
    // this.beginTime = t
    if(checkTime === "00:00") {
      this.setState({ bar: true })
    } else {
      this.setState({ bar: false })
    }
    this.isDisabledHours()
  }
   //时间规则
   validatorEndtime = (rules: any, value: any, callback: any) => {
    const { beginTime } = this.props.form.getFieldsValue()
    if(value <= beginTime){
      callback('结束营业时间需大于开始营业时间')
    } 
    callback()
  }

  render() {
    let { 
      state:{ information: { beginTime, endTime, provinceId, cityId, areaId }, cities, area, province, information ,bar},
      props:{ form: { getFieldDecorator } }
    } = this
    beginTime = beginTime && moment(beginTime, 'HH:mm')
    endTime = endTime && moment(endTime,  'HH:mm')
    console.log(beginTime, endTime)
    return(
      <div className='edit'>
          <Form onSubmit={this.handleSubmit} className="form-style">
          <div className="store-tag">门店基本信息</div>
            <Item label=" 门店名称"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}
              className="ant-form-item">
                  {getFieldDecorator('name', {
                    initialValue: information.name,
                      rules: [
                        {
                          required: true,
                          message: '门店名称最多20个，中文汉字',
                          pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                        },
                      ],
                  })(<Input allowClear />)}
              </Item>  
            <Item label="开始营业时间"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }}>
              {getFieldDecorator('beginTime', {
                initialValue: beginTime || undefined,
                  rules: [
                  {
                    required: true,
                    message: '请输入开始营业时间',
                  },
                  ],
              })(<TimePicker allowClear format={format} onChange={ this.onChange }/>)}
            </Item>
            <Item label="结束营业时间"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }} >
              {getFieldDecorator('endTime', {
                initialValue: endTime || undefined,
                  rules: [
                  {
                    required: true,
                    message: '请输入结束营业时间'
                  },
                  {
                    validator: this.validatorEndtime
                  }
                  ],
              })(<TimePicker allowClear format={format}  disabledHours = { this.isDisabledHours}/>)}
            </Item>
            <div className="logo">
              <Item label="门店LOGO"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('logoImg', {
                initialValue:[{uid:1,url:information.logoImgUrl}],
                rules: [
                  {
                    required: true,
                    message: '只能上传jpg/png格式文件，文件不能超过50kb',
                  },
                ],
              })(<BaseUploadPic maxlength={1} fileSizeKb={50}/>)}
            </Item>
          </div>
            <Item label="经营执照"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}>
                {getFieldDecorator('licenseType', {
                  initialValue: information.licenseType == 1 ? 1 : 2,
                    rules: [
                    {
                      required: true,
                    },
                    ],
                })(
                  <Radio.Group>
                    <Radio value={1} >营业执照</Radio>
                    <Radio value={2}>个体工商户执照</Radio>
                </Radio.Group>
                  )}
              </Item>
            <div className="logo">
              <Item 
              label="."
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}>
              {getFieldDecorator('license', {
                initialValue:[{uid:0,url:information.licenseUrl}],
                rules: [{
                  required: true,
                  message:'文件需清晰可见，并在有效期内。照片大小不超过5M，格式为png、jpg'
                }]
              })(<BaseUploadPic maxlength={1} fileSize={5}/>)}
            </Item>
          </div>
          <div className="address">
            <Item label="通讯地址"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 5 }}
            >
            {getFieldDecorator('province', {
              initialValue: provinceId ? Number(provinceId) : undefined,
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
                initialValue: cityId ? Number(cityId) : undefined,
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
                initialValue: areaId ? Number(areaId) : undefined,
                rules: [
                {
                  required: true,
                  message: '请输入通信地址'
                },
                ],
            })(
                <Select placeholder="区">
                  {area.map((area: any) => (
                  <Option key={area.value} value={area.value}>
                    {area.name}
                  </Option>
                ))}
                </Select>
            )}
          </Item>
          </div>
          <Row>
            <Col>
              <Item label="门店详细地址"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 4 }}>
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
            </Col>
          </Row>
            <Item label="门店联系人"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }}>
              {getFieldDecorator('linkman', {
                initialValue: information.linkman,
                rules: [
                {
                  required: true,
                  message: '不能为空或格式不正确',
                  pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                },
                ],
              })(<Input  allowClear />)}
            </Item>
            <Item label="联系方式"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }}>
              {getFieldDecorator('linkmanPhone', {
                initialValue: information.linkmanPhone,
                  rules: [
                  {
                    required: true,
                    message:'手机号错误',
                    pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/, 'g')
                  },
                  ],
              })(<Input allowClear/>)}
            </Item>
            <Item label="门店账号"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }}>
              {getFieldDecorator('account', {
                initialValue: information.account,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled={true}/>)}
            </Item>
            <div className="input_279">
            <Item label="门店类型"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4 }}>
              {getFieldDecorator('type', {
                initialValue: Number(information.type) === 0 ? 0 : Number(information.type) === 1 ? 1 : 2,
                rules: [
                  {
                    required: true,
                    message:'选择门店类型'
                  },
                ],
            })(  
              <Select placeholder="选择门店类型" allowClear style={{width:'420px'}}>
                <Option value={0}>直营</Option>
                <Option value={1}>加盟</Option>
                <Option value={2}>合作</Option>
            </Select>
            )}
            </Item>
            </div>
            <Item label="门店业务类型"
             labelCol={{ span: 8 }}
             wrapperCol={{ span: 4}}>
              {getFieldDecorator('bus', {
                initialValue: [Number(information.bus1) === 1 ? 1:'',Number(information.bus2) === 1 ? 0:'',Number(information.bus3)=== 1 ? 2:''],
                  rules: [
                  {
                    required: true,
                    message:'选择门店业务类型'
                  },
                  ],
              })(
                <Checkbox.Group>
                <Checkbox value={0}>堂吃</Checkbox>
                <Checkbox value={1}>外带</Checkbox>
                <Checkbox value={2}>外送</Checkbox>
              </Checkbox.Group>
              )}
            </Item>
            <button className="data-btn">保存</button>
      </Form>
    </div>
    )
  }
}
export default Form.create<FormProps>()(StoreEdit)
