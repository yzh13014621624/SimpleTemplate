/*
 * @Description: 广告管理-添加广告
 * @Author: qiuyang
 * @Date: 2019-08-26 11:24:53
 * @LastEditTime: 2019-09-19 10:24:30
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { BaseUploadPic } from 'components/index'
import { Button, Select, Form, Col, Input, message, Row, Radio, DatePicker } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import moment from 'moment'
import '../addadvertisement/index.less'
import { HttpUtil } from 'utils'

import { OSSUtil } from 'utils'

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

interface State {
  position: any[]
  addAdvertisement: any
  dataSource: any
  selectValue: number
  info: any[]
  imgPath: any[]
  imgPathRes: any[]
  echoShowImg: any[]
}

interface FormProps extends BaseProps,FormComponentProps{}

class AdvertisementEdit extends RootComponent<FormProps, State> {
  key: number = 0
  advertisementTime: any = null
  imagePathRe: any[] = []
  id: any = HttpUtil.parseUrl(this.props.location.search)
  constructor(props: FormProps){
      super(props)
      this.state = {
        position: [    // 轮播位展示
          1,2,3,4,5
        ],
        addAdvertisement: {},
        dataSource: {},
        selectValue: 0,
        info: [],
        imgPath: [],//相对路径
        imgPathRes: [],//完整路径
        echoShowImg: []
      }
  }

  componentDidMount () {
    this.requestList()
  }

  requestList = () => {
    const { id } = this.id
    this.axios.request(this.api.getAdvertisementInfo, { id }).then(({data}) => {
      let imgPathRes: any = []
      let imgPath: any = []
      let info: any = []
      let echoShowImg: any = []
      if(data.detailData !== null){
        for(let i = 0; i < data.detailData.length; i++){
          imgPath.push(data.detailData[i].imgPath)
          info.push(data.detailData[i].info)
          imgPathRes.push(data.detailData[i].imgPathRe)
          echoShowImg.push({url:data.detailData[i].imgPathRe, uid: i})
        }
      }
      this.advertisementTime = data.startTime
      this.imagePathRe.push({url:data.imagePathRe, uid:0})
      this.onRedioChange(data.type, data.position)
      this.setState({
        dataSource: data,
        info,
        imgPath,
        imgPathRes,
        echoShowImg
      })
    })
  }

  // 动态增加表单
  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.key++)
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  // 动态删除表单
  removes = (k: any, index: any) => {
    const { info, imgPathRes, imgPath, echoShowImg } = this.state
    this.key--
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const infos = form.getFieldValue('info')
    const imgPaths = form.getFieldValue('imgPath')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter((item:any, key: any) => key !== index),
      info: infos.filter((item:any, key: any) => key !== index),
      imgPath: imgPaths.filter((item:any, key: any) => key !== index)
    })
    info.splice(index,1)
    imgPathRes.splice(index,1)
    imgPath.splice(index,1)
    echoShowImg.splice(index,1)
  }


  // 底部提交按钮
  bottomBtn = () => {
    const { id } = this.id
    this.props.form.validateFieldsAndScroll(async (err: any, values: any) => {
      let{
        type,//广告位置
        title,//广告名称
        position,//轮播位
        startTime,//开始时间
        expireTime,//到期时间
        imagePath,//广告图片
        imgPath, //广告内容图片
        info//广告内容
      } = values
      let detail = []
      let imgPaths = ''
      // 验证类型是长地址，还是文件类型
      if(imagePath[0].flag !== true){
        imgPaths = this.state.dataSource.imagePath
      }else{
        const res: any = await this.getOSSUrl(imagePath)
        imgPaths = res.name
      }
      if(imgPath && info){
        const lengths = imgPath.length > info.length ? imgPath.length:info.length
        for(let i=0; i < lengths; i++){
          if(!imgPath[i] || !info[i] || imgPath[i].length === 0){
            if(imgPath[i].length === 0 && !info[i]){
              this.state.info.splice(i,1)
              this.state.imgPath.splice(i,1)
              this.state.imgPathRes.splice(i,1)
            }else if(!imgPath[i] || imgPath[i].length === 0){
              detail.push({imgPath: '', info: info[i]})
            }else if(imgPath[i][0].flag !== true){
              detail.push({imgPath: this.state.imgPath[i], info:info[i]})
            }else{
              const imgEdit: any = await this.getOSSUrl(imgPath[i])
              detail.push({imgPath: imgEdit.name, info: ''})
            }
          }else if(imgPath[i][0].flag !== true){
            detail.push({imgPath: this.state.imgPath[i], info:info[i]})
          }else{
            const img: any = await this.getOSSUrl(imgPath[i])
            detail.push({imgPath: img.name, info:info[i]})
          }
        }
      }
      let param = {
        id,
        title, //广告名称
        type, //广告位置
        position, //轮播位
        startTimeStr: moment(startTime).format("YYYY-MM-DD")+' 00:00:00', //开始时间
        expireTimeStr: moment(expireTime).format("YYYY-MM-DD")+' 23:59:59', //到期时间
        imagePath: imgPaths,//广告图片
        detail: detail || []//广告内容和广告内容下上传图片
      }
      if(new Date(param.startTimeStr).getTime() > new Date(param.expireTimeStr).getTime()){
        this.$message.error("参数错误！开始时间不能大于到期时间！")
      } else {
        this.props.form.validateFields((err: any, values: any) => {
          if(!err){
            this.axios.request(this.api.postAdvertisementAdd, param).then((res) => {
              if(res.code ===200 ){
                this.props.history.push('/operation-management/advertisement')
              }
            })
          }
        })
      }
    })
  }

  // 获取oss
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
  onRedioChange = (type: any, position: number) => {
    this.axios.request(this.api.getAdvertisementPosition, { type }).then(({data}) => {
      this.setState({
        position: this.getArrDifference(this.getArrDifference(data,[position]),[1,2,3,4,5]),
        selectValue: type
      })
    })
  }

  // 开始时间
  onStartChange = (t: any) => { 
    this.advertisementTime = t 
  }
  
  render(){
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { position, dataSource, selectValue, imgPathRes, info, echoShowImg } = this.state
    getFieldDecorator('keys', { initialValue: dataSource.detail === null? []:info })
    const keys = getFieldValue('keys')
    const formText = keys.map((k: any, index: any) => (
      <Row key={index}>
        <Col>
          <Item label="广告内容"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            colon={true}>
            { getFieldDecorator(`info[${index}]`,{
              initialValue: info[index],
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
            { getFieldDecorator(`imgPath[${index}]`,{
              initialValue: imgPathRes[index] && imgPathRes[index].length !== 0 ?[echoShowImg[index]]:[],
            })( 
              <BaseUploadPic maxlength={1} fileSizeKb = {200} />
            )}
            {keys.length-1 === index && <Button className='ant-addAdvertisement-bottom-addBtn' onClick = {this.add}>新增一条图文</Button>}
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
                wrapperCol={{ span: 15 }}
                colon={true}>
                { getFieldDecorator('title',{
                    initialValue: dataSource.title,
                    rules:[
                      {
                        required: true,
                        whitespace: true,
                        message: '最多30个字，中文汉字',
                        pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,30}$/, 'g')
                      }
                    ]
                })(<Input allowClear className='input-220' placeholder="输入广告名称" maxLength={30}/>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="广告位置"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                colon={true}>
                { getFieldDecorator('type',{
                  initialValue: dataSource.type,
                  rules:[
                    {
                      required:true,
                      message: '请选择广告位置',
                    }
                  ]
                })( 
                  <Select
                    showSearch
                    allowClear
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={(value: any)=> this.onRedioChange(value, dataSource.position)}     //选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
                  >
                    <Option value={0}>小程序首页轮播</Option>
                    <Option value={1}>小程序门店页轮播</Option>
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-addAdvertisement-form'>
              <Item label="轮播位选择"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                colon={true}>
                { getFieldDecorator('position',{
                  initialValue: dataSource.position,
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
                wrapperCol={{ span: 15 }}
                colon={true}>
                { getFieldDecorator('startTime',{
                  initialValue: moment(dataSource.startTime),
                  rules:[{ 
                    type:'object', required: true, message:'请选择日期' 
                  }]
                })( 
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
                wrapperCol={{ span: 15 }}
                colon={true}>
                { getFieldDecorator('expireTime',{
                  initialValue: moment(dataSource.expireTime),
                  rules:[{ 
                    type:'object', required: true, message:'请选择日期' 
                  }]
                })( 
                  <DatePicker
                  placeholder="到期时间"
                  allowClear
                  disabledDate={(current: any) => this.advertisementTime && current && current < moment(this.advertisementTime)}/>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Item label="广告图片"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              colon={true}>
              {getFieldDecorator('imagePath',{
                initialValue: this.imagePathRe,
                rules:[{
                  required:true,
                  message: '请上传广告图片',
                }]
              })( 
                <BaseUploadPic maxlength={1} fileSizeKb = {200} />
              )}
            </Item>
          </Row>
          <Row>
            {selectValue === 0?<div className = 'ant-center-text'>只能上传jpg/png格式文件，文件不能超过200kb，图片大小750*800px</div>:<div className = 'ant-center-text'>只能上传jpg/png格式文件，文件不能超过200kb，图片大小750*300px</div>}
          </Row>
          <Row>
            {selectValue === 0 &&  formText}
          </Row>
          <Button className='ant-addAdvertisement-bottom-btn' onClick={this.bottomBtn}>提交</Button>
        </Form>
     </div>
    )
  }
}
export default Form.create()(AdvertisementEdit)