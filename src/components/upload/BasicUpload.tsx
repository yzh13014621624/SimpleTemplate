/**
 * @author minjie
 * @createTime 2019/05/29
 * @description 简单的一个上传
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '../index'
import RcUpload from 'rc-upload'
import { Modal } from 'antd'
import './style/Upload.styl'

interface BasicUploadProps {
  // 传递该组件的值(传递个form 的 getFieldDecorator 值)
  onChange?: Function
  // 获取buffer 值
  getBuffer?:Function
  // 宽度
  width?: number | string
  // 样式类名
  className?: string
  // 行内样式
  style?: object
  // 是否多选
  multiple?:boolean
  // .png,.jpg 上传的类型
  accept?:string
  // 限制的大小
  size?:number
  // 默认显示的图片
  url?: any
  // 底部的显示（交强险）
  bomText?:string
  // 显示删除按钮还是编辑 del edit
  type?: 'del' | 'edit'
  // 是否只显示一个预览 true只显示一个预览按钮 false显示预览和（编辑/删除）按钮 默认为false
  showTwoBtn?: boolean
  value?: any
}

interface BasicUploadState {
  // 上传类型
  accept:string
  // 文件上传的大小
  fileSize: number
  data:any
  imageURL: string
  // 保存 这个文件的值
  selDate: any
  // 弹出框状态
  previewVisible?: boolean
  bufferURl?:any
}

export default class BasicUpload extends RootComponent<BasicUploadProps, BasicUploadState> {
  // static getDerivedStateFromProps (props:any, state:any) {
  //   const { url } = props
  //   const { size, accept, imageURL, selData, previewVisible } = state
  //   if ('value' in props) {
  //     return {
  //       fileSize: size || 3,
  //       accept: accept || '.png,.jpg,.jpeg,.JPG,.PNG,.JPEG',
  //       selDate: selData || {},
  //       imageURL: imageURL || url || props.value,
  //       data: props.value,
  //       previewVisible: previewVisible || false // 弹出框
  //     }
  //   }
  //   return null
  // }
  previewImage:string
  constructor (props:any) {
    super(props)
    const value = props.value || {}
    const { accept, size, url } = this.props
    this.previewImage = ''
    this.state = {
      previewVisible: false,
      fileSize: size || 3,
      accept: accept || '.png,.jpg,.jpeg,.JPG,.PNG,.JPEG',
      imageURL: url,
      selDate: value || {},
      data: value,
      bufferURl: ''
    }
  }

  componentDidUpdate (prveProps:any) {
    if (this.props.url !== prveProps.url) {
      this.setState({ imageURL: this.props.url })
    }
    if (this.props.value !== prveProps.value) {
      this.setState({ data: this.props.value })
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  // 将值传递给父级的事件
  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  onSuccess = (file:any) => {
    /* 一下为值的回显 */
    const render = new FileReader()
    render.readAsDataURL(file)
    render.onload = (e:any) => {
      this.setState({
        bufferURl: render.result,
        data: { imageURL: e.target.result, file: file },
        imageURL: e.target.result
      })
      let { getBuffer } = this.props
      if (getBuffer) {
        getBuffer(e.target.result)
      }
      this.triggerChange([file])
      // this.triggerChange({ imageURL: e.target.result, file: file })
    }
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any, fileList:any) => {
    const { accept, fileSize } = this.state
    const { size, name } = file
    let a = '文件上传出错'
    return new Promise((resolve, reject) => {
      // 对文件的信息进行 类型判断
      let index = name.lastIndexOf('.')
      let typeArry = accept.split(',')
      let suffer = (name as string).substring(index, name.length)
      if (typeArry.indexOf(suffer) < 0) {
        a = '请上传正确的文件'
        this.$message.error(a)
        reject(a)
      }
      if ((size / 1024 / 1024) > fileSize) { // 对文件进行 大小判断
        a = `上传文件的大小不能超过${fileSize}M`
        this.$message.warning(a)
        reject(a)
      }
      resolve(file)
    })
  }

  // 自定义的文件上传, 默认的不传，直接成功
  customRequest = (request:any) => {
    const { file } = request
    request.onSuccess(file)
  }

  /** 编辑 */
  edit = (e:any) => {
    let parnts = e.target.parentElement.parentElement.parentElement
    let input = parnts.getElementsByTagName('span')[0].getElementsByTagName('input')[0]
    input.click()
  }

  /* 文件的移除 */
  remove = () => {
    this.setState({
      selDate: [],
      imageURL: '',
      data: {}
    })
    this.triggerChange(null)
  }
  // 预览
  queryImg = (url:any) => {
    this.previewImage = url
    this.setState({
      previewVisible: true
    })
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  render () {
    const { className, style, multiple, type, bomText, showTwoBtn } = this.props
    const { accept, imageURL, previewVisible } = this.state
    // let imageURL = data ? data.imageURL : undefined
    const config = {
      accept: accept, // 默认上传的是图片
      multiple: multiple, // 多选
      onSuccess: this.onSuccess,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest
    }
    return (
      <div style={style} className={className ? `upload-image-content ${className}` : 'upload-image-content'}>
        <RcUpload {...config} className="upload-btn" style={style}>
          {this.props.children}
        </RcUpload>
        {bomText && <p className="cus-upload-bottom-text">{bomText}</p>}
        {imageURL && <div className="content-after">
          <img alt="" src={imageURL}></img>
          {
            showTwoBtn
              ? <p style={{ fontSize: 11, color: '#fff' }} onClick={() => (this.queryImg(imageURL))}>预览</p>
              : <p>
                <span style={{ fontSize: 11 }} onClick={() => (this.queryImg(imageURL))}>预览</span>
                {
                  type === 'del'
                    ? <span onClick={this.remove} style={{ fontSize: 11 }} >删除</span>
                    : <span onClick={this.edit} style={{ fontSize: 11 }} >编辑</span>
                }
              </p>
          }
        </div>}
        <Modal
          className="upload-more-modal-box"
          width='580px'
          footer={null}
          visible={previewVisible}
          onCancel={this.handleCancel}
          style={{ boxShadow: '0px 0px 5px 0px rgba(190,190,190,0.5)' }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <img alt="" style={{ width: '100%' }} src={this.previewImage} />
        </Modal>
      </div>
    )
  }
}
