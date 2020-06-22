/*
 * @Description: 广告管理-添加广告
 * @Author: qiuyang
 * @Date: 2019-08-26 11:24:53
 * @LastEditTime: 2019-09-19 10:22:17
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { BaseUploadPic } from 'components/index'
import { Button, Select, Form, Col, Input, Radio, DatePicker,Row } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import moment from 'moment'
import './index.less'
import TextArea from 'antd/lib/input/TextArea'

import { OSSUtil } from 'utils'

const { Item } = Form
const { Option } = Select


interface State {
  addAdvertisement: any
  selectValue: number
  position: any[]
  list: any
}

interface FormProps extends BaseProps,FormComponentProps{}

class AdvertisementAdd extends RootComponent<FormProps, State> {
  id: number = 1
  ids: number = 1
  advertisementTime: any = null
  constructor(props: FormProps){
      super(props)
      this.state = {
        position: [    // 轮播位展示
          1,2,3,4,5
        ],   
        addAdvertisement:{},
        selectValue: 0,
        list:{}
      }
  }

  // 动态增加表单
  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.id++)
    // console.log(keys, nextKeys)
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  // 动态删除表单
  removes = (k: any, index: any) => {
    this.ids--
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const info = form.getFieldValue('info')
    const imgPath = form.getFieldValue('imgPath')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter((item: any, key: any) => key !== index),
      info: info.filter((item: any, key: any) => key !== index),
      imgPath: imgPath.filter((item: any, key: any) => key !== index)
    })
  }


  // 底部提交按钮
  bottomBtn = () => {
    const data = this.props.form.getFieldsValue()
    console.log(data)
    this.props.form.validateFieldsAndScroll(async (err: any, values: any) => {
      let{
        type,//广告位置
        title,//广告名称
        position,//轮播位
        startTimeStr,//开始时间
        expireTimeStr,//到期时间
        imagePath,//广告图片
        imgPath = [],//广告内容图片数组
        info = []// 广告内容数组
      } = values
      let detail = []
      let res: any = {}
      if(imgPath && info){
        const lengths = imgPath.length > info.length ? imgPath.length:info.length
        for(let i=0; i < lengths; i++){
          if(!imgPath[i] || !info[i]){
            if(!imgPath[i] && !info[i]){
              info.splice(i,1)
              imgPath.splice(i,1)
            }else if(!imgPath[i]){
              detail.push({imgPath: '', info: info[i]})
            }else{
              const imgs: any = await this.getOSSUrl(imgPath[i])
              detail.push({imgPath: imgs.name, info: ''})
            }
          }else{
            const img: any = await this.getOSSUrl(imgPath[i])
            detail.push({imgPath: img.name, info:info[i]})
          }
        }
      }
      if(imagePath){
        res = await this.getOSSUrl(imagePath)
      }
      let param = {
        title, //广告名称
        type, //广告位置
        position, //轮播位
        startTimeStr: moment(startTimeStr).format("YYYY-MM-DD")+' 00:00:00', //开始时间
        expireTimeStr: moment(expireTimeStr).format("YYYY-MM-DD")+' 23:59:59', //到期时间
        imagePath: res.name,//广告图片
        detail: detail||[]//广告内容图片数组
      }
      console.log("param",param)
      this.props.form.validateFields((err: any, values: any) => {
        if(!err){
          this.axios.request(this.api.postAdvertisementAdd, param).then(({code}) => {
            if(code ===200 ){
              this.props.history.push('/operation-management/advertisement')
              this.$message.success('新增成功！')
            }
          })
        }
      })
    })
  }

  async getOSSUrl (list: any[]){
    if(!list.length) return
    const item = list[0]
    return await OSSUtil.multipartUpload(item.file,'banners')
  }
  
  // 过滤 轮播位 数组得到展示位
  getArrDifference = (arr1: any, arr2: any) => {
    return arr1.concat(arr2).filter((v: any, i: any, arr: any) => {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }

  // 点击广告位置下拉框确定展示轮播位
  onRedioChange = (type: any) => {
    this.axios.request(this.api.getAdvertisementPosition, { type }).then(({data}) => {
      this.setState({
        position: this.getArrDifference(data,[1,2,3,4,5]),
        selectValue: type
      })
    })
  }

  // 开始时间
  onStartChange = (t: any) => {
    this.advertisementTime = t 
  }
  
  render(){
    console.log('111')
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { position, selectValue } = this.state
    const config = {
      rules:[{ type:'object', required: true, message:'请选择日期' }]
    }
    getFieldDecorator('keys', { initialValue: [0] })
    const keys = getFieldValue('keys')
    const formText = keys.map((k: any, index: any) => (
      <Row key={k}>
        <Col>
          <Item label="广告内容"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            colon={true}>
            { getFieldDecorator(`info[${index}]`,{
                rules:[
                  {
                    whitespace: true
                  }
                ]
            })(<TextArea rows = {5} placeholder="文本信息" style={{width:'360px'}}/>) }
          </Item>
        </Col>
        <Col className='ant-addadvertisement-imgpath'>
          <Item
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            colon={true}
          >
              { getFieldDecorator(`imgPath[${index}]`)( 
                <BaseUploadPic maxlength={1} fileSizeKb = {200}/>
              )}
              {keys.length-1 === index && <Button  className='ant-addAdvertisement-bottom-addBtn' onClick = {this.add}>新增一条图文</Button>}
              <Button onClick = {() => this.removes(k, index)} className = 'ant-deleted-imgInfo-btn' disabled = {keys.length === 1} style = {keys.length === 1?{background: 'rgb(190, 200, 200)'}:undefined} >删除图文信息</Button>
          </Item>
        </Col>
      </Row>
    ))
    return (
      <div id = 'ant-advertisement'> 
        <Form className="ant-advertisement-search-form">
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="广告名称"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 3 }}
                colon={true}>
                { getFieldDecorator('title',{
                    rules:[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入中文汉字,最多30字',
                        pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,30}$/, 'g')
                      }
                    ]
                })(<Input allowClear className = 'input-220' placeholder="输入广告名称" maxLength={30}/>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="广告位置"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator('type',{
                  rules:[
                    {
                      required:true,
                      message: '请选择广告位置',
                    }
                  ]
                })( 
                <Select
                  showSearch
                  placeholder="请选择"
                  allowClear
                  optionFilterProp="children"
                  onChange={(value: any)=> this.onRedioChange(value)}     //选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
                >
                  <Option value={0}>小程序首页轮播</Option>
                  <Option value={1}>小程序门店页轮播</Option>
                </Select>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="轮播位选择"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator('position',{
                    rules:[
                      {
                        required:true,
                        message: '请选择轮播位',
                      }
                    ]
                })( 
                <Radio.Group>
                  {position.map((k:any, index:any)=>(
                    <Radio value={k} key={k}>轮播{k}</Radio>
                  ))}
                </Radio.Group>)}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="开始时间"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator('startTimeStr',config)( 
                  <DatePicker 
                    allowClear
                    placeholder="开始时间"
                    onChange = {this.onStartChange}
                  />
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="到期时间"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator('expireTimeStr',config)( 
                  <DatePicker placeholder="到期时间" 
                  allowClear
                  disabledDate={(current: any) => this.advertisementTime && current && current < moment(this.advertisementTime)}
                  />
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Item label="广告图片"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              colon={true}
            >
              { getFieldDecorator('imagePath',{
                rules:[{
                  required:true,
                  message: '不能为空',
                }]
              })( 
                <BaseUploadPic maxlength={1} fileSizeKb = {200}/>
              )}
            </Item>
          </Row>
          <Row>
            {selectValue === 0?<div className = 'ant-center-text'>只能上传jpg/png格式文件，文件不能超过200kb，图片大小750*800px</div>:<div className = 'ant-center-text'>只能上传jpg/png格式文件，文件不能超过200kb，图片大小750*300px</div>}
          </Row>
          {selectValue === 0?<div>{formText}</div>:null}
          <Button className='ant-addAdvertisement-bottom-btn' onClick={this.bottomBtn}>提交</Button>
        </Form>
     </div>
    )
  }
}
export default Form.create()(AdvertisementAdd)