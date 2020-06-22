
import * as React from 'react'
import './index.less'
import { RootComponent } from 'components'
import { BaseUploadPic } from 'components/index'
import { BaseProps } from 'typings/global'
import { Form, Input, Select, Checkbox, Radio, DatePicker, Upload, Row, Col,TimePicker } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import moment from 'moment'
import City from 'assets/data/City'

import { OSSUtil } from 'utils'

const { Option } = Select
const { Item } = Form
const { Group } = Checkbox

interface State {
  confirmDirty:boolean,
  details: any,
  searchParams: any
  value: any,
  addParams: {
    address: string, // 门店详细地址
    area: string, // 门店所在地区
    city: string, // 城市
    beginTime: string, // 开始营业时间
    bus1: number, // 是否支持外带：0：不支持；1：支持
    bus2: number, // 是否支持堂吃：0：不支持；1：支持
    bus3: number, // 是否支持外送：0：不支持；1：支持
    endTime: string, // 结束营业时间
    imgPath: string, // 门店logo图片地址
    linkman: string, // 门店联系人
    linkmanPhone: string, // 门店联系人电话
    lat1: number, // 纬度
    lng: number, // 经度
    loginPhone: string, // 门店账号 必须手机号
    name: string, // 商户名称
    out: string, //
    province:string, // 省份
    type: string, // 门店类型
  },
  cities: any,
  area: any,
  startValue: any,
  endValue: any,
  bar: boolean, //时间选择框开关
}
interface FormProps extends BaseProps, FormComponentProps{}

class Add extends RootComponent<FormProps, State> {
  startTime: any = null
  constructor (props: any) {
    super(props)
    this.state = {
      confirmDirty: false,
      details: [],
      addParams: {
        address: '',
        area: '',
        city: '',
        beginTime: '',
        bus1: 0,
        bus2: 0,
        bus3: 0,
        endTime: '',
        imgPath: '',
        linkman: '',
        linkmanPhone: '',
        lat1: 0,
        lng: 0,
        loginPhone: '',
        name: '',
        out: '',
        province: '',
        type: ''
      },
      searchParams: '',
      value: 1,
      cities: City[0].areaList,
      area: City[0].areaList[0].areaList,
      startValue: null,
      endValue: null,
      bar: false,
    }
  }

  addStore () {
    this.axios.request(this.api.storeAddShop).then(({ data }) => {
      console.log(data)
    })
  }

  handleSubmit = (e: any) => {
    console.log(this.props.form.getFieldsValue())
    e.stopPropagation()
    e.preventDefault()
    // setTimeout(() => {
    //   let getFieldsValue = this.props.form.getFieldsValue()
    //   let { bus } = getFieldsValue
    //       let bus1 = bus.indexOf(0)
    //       let bus2 = bus.indexOf(1)
    //       let bus3 = bus.indexOf(2)
    //       let params = {
    //         ...getFieldsValue,
    //         bus: undefined,
    //         bus1: bus1 >= 0 ? 1 : 0,
    //         bus2: bus2 >= 0 ? 1 : 0,
    //         bus3: bus3 >= 0 ? 1 : 0
    //       }
    //       console.log(params, 'params')
    // }, 0)
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const { bus } = values
    //     const bus1 = bus.indexOf(0)
    //     const bus2 = bus.indexOf(1)
    //     const bus3 = bus.indexOf(2)
    //     const params = {
    //       ...values,
    //       bus: undefined,
    //       bus1: bus1 >= 0 ? 1 : 0,
    //       bus2: bus2 >= 0 ? 1 : 0,
    //       bus3: bus3 >= 0 ? 1 : 0
    //     }
    //     console.log(params, 'params')
    //   }
    // })
    this.props.form.validateFieldsAndScroll(async (err: any, values: any) => {
      let { beginTime, endTime, license = [], imgPath = [] } = values
      beginTime = moment(beginTime).format('HH:mm')
      endTime = moment(endTime).format('HH:mm')
      // const res: any = await this.getOSSUrl(license)
      // const ress: any = await this.getOSSUrl(imgPath)
      if(err) {return}
      if (!err) {
        const { bus } = values
        const bus1 = bus.indexOf(0)
        const bus2 = bus.indexOf(1)
        const bus3 = bus.indexOf(2)
        if(imgPath){
          const res: any = await this.getOSSUrl(values.imgPath)
          imgPath = res.name
          console.log(imgPath)
        }
        if(license){
          const res: any = await this.getOSSUrl(values.license)
          license =  res.name
        }
        const params = {
          ...values,
          // bus: undefined,
          bus1: bus1 >= 0 ? 1 : 0,
          bus2: bus2 >= 0 ? 1 : 0,
          bus3: bus3 >= 0 ? 1 : 0,
          // license: res.name,
          // imgPath: ress.name,
          beginTime,
          endTime,
          imgPath,
          license
        }
        console.log(params, 'params')
        this.insertInfo(params)
      }
    })
  }

  async getOSSUrl (list: any[]) {
    if (!list.length) return
    const item = list[0]
    return await OSSUtil.multipartUpload(item.file, 'shop')
  }

  insertInfo (addParams: any) {
    this.axios.request(this.api.storeAddShop, addParams).then(({ code, data }) => {
      code === 200 && this.props.history.push('/shop-management/list')
      console.log(data)
    })
  }

  onChangebox = () => {}
  onChange = (e: any) => {
    console.log('radio checked', e.target.value)
    this.setState({
      value: e.target.value
    })
  }

  onChangeTime = (current:any, checkTime:any) => {
    // this.beginTime = t
    if(checkTime === "00:00") {
      this.setState({ bar: true })
    } else {
      this.setState({ bar: false })
    }
    this.isDisabledHours()
    const endTime = this.props.form.getFieldValue('endTime')
    if(checkTime >= endTime) {
      this.isDisabledHours()
    }
  }
  isDisabledHours = () => {
    const { bar } = this.state
    if (bar) {
       return [0]
    } else {
      return [-1]
    }
  }

   /** 省 change */
   ProvinceChange = (value: any) => {
     const citys = City.filter(
       (province: any) => province.value === Number(value)
     ) // [0].areaList
     if (citys.length > 0) {
       const cities = citys[0].areaList
       const area = citys[0].areaList[0].areaList
       console.log(cities, 'citiescitiescities')
       this.props.form.setFieldsValue({ city: cities[0].value })
       this.props.form.setFieldsValue({ area: cities[0].areaList[0].value })
       this.setState({
         cities,
         area
       })
     }
   }

  // 经营执照单选
  onChangeRadio = (e: any) => {
    console.log('radio checked', e.target.value)
    this.setState({
      value: e.target.value
    })
  }
 //时间规则
  validatorEndtime = (rules: any, value: any, callback: any) => {
    const { beginTime } = this.props.form.getFieldsValue()
    if(value <= beginTime){
      callback('结束营业时间需大于开始营业时间')
    } 
    callback()
  }

  render () {
    const {
      state: { details, cities, area },
      props: { form: { getFieldDecorator } }
    } = this
    const format = 'HH:mm'
    return (
      <div className="addstore">
        <Form onSubmit={(e) => this.handleSubmit(e)} className="form-style">
          <Row>
            <Col>
              <Item label="门店名称"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 4 }}>
                {getFieldDecorator('name', {
                  rules:[
                    {
                      required: true,
                      message: '门店名称最多20个，中文汉字',
                      pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])|\(|\){1,20}$/, 'g')
                    }
                  ]
                })(<Input placeholder="输入门店名称" maxLength={20} allowClear />)}
              </Item>
            </Col>
            <Col>
              <Item label="开始营业时间"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 4 }} >
                {getFieldDecorator('beginTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开始营业时间'
                    }
                  ]
                })(<TimePicker format={format} allowClear onChange={ this.onChangeTime }/>)}
              </Item>
          </Col>
          <Col>
            <Item label="结束营业时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }} >
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择结束营业时间'
                  },
                  {
                    validator: this.validatorEndtime
                  }
                ]
              })(<TimePicker format={format} allowClear disabledHours = { this.isDisabledHours} />)}
            </Item>
          </Col>
          <Col>
            <div className="logo"> 
              <Item label="门店LOGO"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('imgPath', {
                  initialValue: [],
                  rules: [{
                    required: true,
                    message:'只能上传jpg/png格式文件，尺寸：200*200px，大小：50kb'
                  }]
                })(<BaseUploadPic maxlength={1} fileSizeKb={50} style={{width:'200px',height:'200px'}}/>)}
              </Item>
            </div>
          </Col>
          <Row>
            <Col span={12} offset={8}>
              <Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}><span className='markedwords'>只能上传jpg/png格式文件，尺寸：200*200px，大小：50kb</span></Item>
            </Col>
          </Row>
          <Col>
            <Item label="经营执照"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('licenseType', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={1}>营业执照</Radio>
                  <Radio value={2}>个体工商户执照</Radio>
                </Radio.Group>
              )}
            </Item>
          </Col>
          <Col>
            <div className="logo">
              <Item 
                label="."
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
                {getFieldDecorator('license', {
                  rules: [{
                    required: true,
                    message:'文件需清晰可见，并在有效期内。照片大小不超过5M，格式为png、jpg'
                  }]
                })(<BaseUploadPic maxlength={1} fileSize={5}/>)}
              </Item>
            </div>
          </Col>
          <Row>
            <Col span={12} offset={8}>
              <Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}><span className='markedwords'>文件需清晰可见，并在有效期内。照片大小不超过5M，格式为png、jpg</span></Item>
            </Col>
          </Row>
          <Col>
            <Item label="门店所在地区"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}
            >
              {getFieldDecorator('province', {
                rules: [
                  {
                    required: true,
                    message: '请输入通信地址'
                  }
                ]
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
                  }
                ]
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
                  }
                ]
              })(
                <Select placeholder="区" className='special'>
                  {area.map((city: any) => (
                    <Option key={city.value} value={city.value}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Item>
          </Col>
          <Col>
            <Item label="门店详细地址"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}
            >
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入详细地址'
                  }
                ]
              })(<Input placeholder="详细地址" allowClear/>)}
            </Item>
          </Col>
          <Col>
            <Item label="门店联系人"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('linkman', {
                rules: [
                  {
                    required: true,
                    message: '不能为空或格式不正确',
                    pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,20}$/, 'g')
                  }
                ]
              })(<Input placeholder="填写门店联系人" allowClear />)}
            </Item>
          </Col>
          <Col>
            <Item label="联系方式"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('linkmanPhone', {
                rules: [
                  {
                    required: true,
                    message: '手机号错误',
                    pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/, 'g')
                  }
                ]
              })(<Input placeholder="填写联系方式" maxLength={11} allowClear />)}
            </Item>
          </Col>
          <Col>
            <Item label="门店账号"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('loginPhone', {
                rules: [
                  {
                    required: true,
                    message: '手机号错误',
                    pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/, 'g')
                  }
                ]
              })(<Input placeholder="填写门店账号" maxLength={11} allowClear />)}
            </Item>
          </Col>
          <Col>
          <Item label="门店类型"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 4 }}
            className="last">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '选择门店类型'
                }
              ]
            })(
              <Select placeholder="选择门店类型" allowClear className="last" style={{width:'420px'}}>
                <Option value={0}>直营</Option>
                <Option value={1}>加盟</Option>
                <Option value={2}>合作</Option>
              </Select>
            )}
          </Item>
          </Col>
          <Row>
          <Col>
            <Item label="门店业务类型"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 4 }}>
              {getFieldDecorator('bus', {
                rules: [
                  {
                    required: true,
                    message: '选择门店业务类型' 
                  }
                ]
              })(
                <Group>
                  <Checkbox value={0}>堂吃</Checkbox>
                  <Checkbox value={1}>外带</Checkbox>
                  <Checkbox value={2}>外送</Checkbox>
                </Group>
              )}
            </Item>
          </Col>
          </Row>
          <Col>
            <Item>
              <button className="ant-edit-btn">提交</button>
            </Item>
          </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create<FormProps>()(Add)
