/*
 * @description: 文件上传模板组件
 * @author: minjie, huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-20 10:54:08
 * @LastEditTime: 2019-09-19 14:11:47
 * @Copyright: Copyright © 2019 Shanghai Shangjia Logistics Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RcUpload from 'rc-upload'
import { RootComponent, BasicModal } from 'components/index'
import { Button, Row, Col, Modal, Progress } from 'antd'
import { ComUtil } from 'utils/ComUtil'

// import js from '@assets/images/svg/component/file/warning.svg' // 警告的图片

import './index.styl'

interface UrlInteface {
  path:string
  type?:string
}

interface BaseUploadProps {
  name?: string // 上传的字段文件名，默认为 file
  action?: UrlInteface // 上传接口
  className?: string // 样式类名
  style?: object // 行内样式
  multiple?: boolean // 是否多选
  accept?: string | string[] // 允许上传的类型
  fileSize?: number // 文件的大小上限，默认值为 10M
  params?: any // 上传的时候的参数
  successChange?: Function // 成功之后
}

interface BaseUploadState {
  errmsg: string
  errurl: string
  visible: boolean
  progressPercent: number
}

export default class BaseUpload extends RootComponent<BaseUploadProps, BaseUploadState> {
  static defaultProps = {
    action: {
      path: ''
    },
    fileSize: 10,
    name: 'file'
  }

  basicModel = React.createRef<BasicModal>()
  accept = ['.xlsx', '.xls']

  constructor (props: BaseUploadProps) {
    super(props)
    const { accept } = props
    if (accept) {
      if (typeof accept === 'string') {
        const { include } = ComUtil.inArray(accept, this.accept)
        if (!include) this.accept.push(accept)
      } else {
        this.accept = [...this.accept, ...accept]
      }
    }
    this.state = {
      errmsg: '',
      errurl: '',
      visible: false,
      progressPercent: 0
    }
  }

  /* 文件上传前对文件限制类型和大小进行检查 */
  beforeUpload = (file: any) => {
    const {
      props: { fileSize },
      accept,
      $message
    } = this
    const { size, name } = file
    const lastIndex = name.lastIndexOf('.')
    const suffix = (name as string).substring(lastIndex, name.length)
    const { include } = ComUtil.inArray(suffix, accept)
    if (!include) {
      $message.error('请上传正确的文件')
      return false
    }
    if ((size / 1024 / 1024) > fileSize!) {
      $message.warning(`上传文件的大小不能超过${fileSize}M`)
      return false
    }
  }

  /* 开始上传事件 */
  onStart = (file: any) => {}

  /* 上传进度监听事件 */
  onProgress = (file: any) => {}

  /* 文件上传成功事件 */
  onSuccess = (res: any) => {
    const { props: { successChange }, showModel, $message } = this
    const { errNum, errMessage, errUrl, successNum, code } = res.data
    if (code === 400) showModel(errUrl, errMessage)
    else if (code === 200) $message.success('导入成功！')
    else if (code !== 400 && code !== 200 && code !== 401) $message.error('导入失败！')
    successChange && successChange(res)
  }

  /* 上传失败事件 */
  onError = (err: any) => {
    const { message = [] } = err
    this.error(message[0] || err)
  }

  /* 导入失败之后，获取失败信息和链接，以弹窗形式展示，以便下载出现失败的数据 */
  showModel = (errurl: string, errmsg: string) => {
    this.setState({ errurl, errmsg })
    this.handlerModal(true)
  }

  /* 是否显示展示错误提示信息的弹窗，以便下载失败的数据 */
  handlerModal = (show: boolean = false) => {
    const { handleOk, handleCancel } = this.basicModel.current!
    show ? handleOk() : handleCancel()
  }

  /* 拦截 rc-upload 的 ajax 上传，以自定义的方式进行上传文件 */
  customRequest = (request: any) => {
    const { action, file, filename, onSuccess, onError } = request
    let formData = new FormData()
    let params = this.props.params
    // 创建对象的信息
    formData.append(filename, file, file.name)
    if (params) {
      for (const key in params) {
        formData.append(key, params[key])
      }
    }
    this.setState({ visible: true, progressPercent: 0 })
    let time:any = setInterval(() => {
      let { progressPercent } = this.state
      if (progressPercent >= 80) {
        clearInterval(time)
      } else {
        progressPercent += 8
      }
      this.setState({ progressPercent })
    }, 1000)
    this.axios.upload({
      method: 'post',
      url: action,
      data: formData
    }).then((res:any) => {
      const { code } = res.data
      if (code === 200) {
        onSuccess(res.data, file)
      } else {
        onError(res.data, true)
      }
    }).catch((err:any) => {
      onError(err, false)
    }).finally(() => {
      this.setState({ visible: false, progressPercent: 100 })
    })
  }

  /* 下载出错数据 */
  dowloadFile = (url: string) => {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    document.body.appendChild(link)
    link.click()
    this.handlerModal()
    this.$message.success('下载成功!')
  }

  render () {
    const {
      props: { name, multiple, action },
      state: { errmsg, errurl, visible, progressPercent },
      accept,
      beforeUpload,
      onStart,
      onError,
      onProgress,
      onSuccess,
      customRequest
    } = this
    const config = {
      action: action!.path,
      name,
      accept: accept.join(),
      multiple,
      onStart,
      onProgress,
      onSuccess,
      onError,
      beforeUpload,
      customRequest
    }
    return (
      <div className="upload-file-content">
        <RcUpload {...config}>
          {this.props.children}
        </RcUpload>
        <Modal title="" closable={false} footer={null} visible={visible}>
          <div className="upload-progress">
            <p>正在导入，请稍等...</p>
            <Progress strokeColor={{
              to: '#24C8EA',
              from: '#2B8FF9'
            }}
            status="active" percent={progressPercent} />
          </div>
        </Modal>
        <BasicModal ref={this.basicModel}>
          <Row>
            {/* <Col span={7} style={{ textAlign: 'center' }}><img src={js}></img></Col> */}
            <Col span={22} className="error-col" style={{ padding: '20px 20px 0 20px' }}>{errmsg}</Col>
          </Row>
          <Row>
            <div className="import-error">
              <p>出错原因可能为：</p>
              <p>1.数据不完整（必填项为空）；</p>
              <p>2.字段格式不正确（如导入数据中的“项目”为系统内没有的项目名称等）；</p>
              <p>3.与原数据冲突（如导入的员工相关记录在系统中已存在）。</p>
            </div>
          </Row>
          <Row>
            <Button type="primary" onClick={() => (this.dowloadFile(errurl))}>下载出错数据</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }

  /* 销毁组件，重置 state */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }
}
