/*
 * @description: 导出数据和下载导入模板组件
 * @author: minjie, huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-20 10:54:08
 * @LastEditTime: 2020-06-09 18:23:21
 * @Copyright: Copyright © 2019 Shanghai Shangjia Logistics Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components/index'
import { Button, Modal, Progress, Icon } from 'antd'
import moment from 'moment'

// import { IconDC, IconLoad } from '../icon/BasicIcon'

import './index.styl'

declare const ButtonTypes: ['default', 'primary', 'ghost', 'dashed', 'danger', 'link']
type ButtonType = (typeof ButtonTypes)[number]

interface UrlInteface {
  path: string
  type?: string
}

interface BaseDowloadProps {
  btntype?: ButtonType // 下载按钮的样式
  action?: UrlInteface // 下载的地址对象
  fileName?: string // 导出文件的文件名
  suffix?: 'xlsx' | 'xls' // 导出文件后缀 xlsx  xls，默认为 .xlsx
  downloadDate?: any // 导出文件时候下载日期，默认为当前日期
  params?: object // 导出条件
  downloadTemplate?: boolean // 是否是下载模板
  exportData?: boolean // 是否是导出数据
  includeTime?: boolean // 下载文件名是否携带当前时间，默认为 false
  className?: string
  isClickExportData?: boolean // 点击导出是否执行事件，默认true
  title?: string // 按钮里面显示的字体
  handleHide?: () => void
}

interface BaseDowloadState {
  visible: boolean // 显示下载的进度条
  progressPercent: number // 下载进度
}

export default class BaseDowload extends RootComponent<BaseDowloadProps, BaseDowloadState> {
  static defaultProps = {
    action: {
      path: ''
    },
    btntype: 'primary',
    fileName: 'TMS导出文件',
    suffix: 'xls',
    downloadDate: moment().format('YYYYMMDD'),
    downloadTemplate: false,
    exportData: false,
    includeTime: false,
    isClickExportData: true,
    title: '导出'
  }

  constructor (props: BaseDowloadProps) {
    super(props)
    this.state = {
      visible: false,
      progressPercent: 0
    }
  }

  // componentWillReceiveProps ({ fileName }: BaseDowloadProps) {
  //   this.setState({ fileName: fileName! })
  // }

  /* 下载模板 */
  downloadTemplate = () => {
    const { props: { params, action, fileName, suffix, downloadDate, includeTime } } = this
    const { type = 'post', path }: any = action!
    let ax: any
    this.setState({ visible: true, progressPercent: 0 })
    let time: any = setInterval(() => {
      let { progressPercent } = this.state
      if (progressPercent >= 80) {
        clearInterval(time)
      } else {
        progressPercent += 8
      }
      this.setState({ progressPercent })
    }, 1000)
    if (action) {
      if (type === 'post') {
        ax = this.axios.instance({
          method: type,
          url: path,
          data: params,
          responseType: 'blob'
        })
      } else {
        ax = this.axios.instance({
          method: type,
          url: path,
          params: params,
          responseType: 'blob'
        })
      }
    }
    ax.then((res: any) => {
      if (!res || res.data.type === 'application/json') {
        this.$message.error('导出失败！')
      } else {
        const url = window.URL.createObjectURL(res.data)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        includeTime
          ? link.setAttribute('download', `${fileName}_${downloadDate}.${suffix}`)
          : link.setAttribute('download', `${fileName}.${suffix}`)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(res.data)
        this.$message.success('导出成功!')
      }
    }).catch((err: any) => {
      this.$message.error(err.message)
    }).finally(() => {
      clearInterval(time)
      time = null
      this.setState({ visible: false, progressPercent: 100 })
    })
  }

  /* 导出数据 */
  exportData = () => {
    const { props: { params, action, fileName, suffix, downloadDate, includeTime, handleHide } }: any = this
    const { startDate, endDate }: any = params
    if (startDate) {
      params.startDate = moment(startDate).format('YYYY-MM-DD')
    }
    if (endDate) {
      params.endDate = moment(endDate).format('YYYY-MM-DD')
    }
    this.setState({ visible: true, progressPercent: 0 })
    let time: any = setInterval(() => {
      let { progressPercent } = this.state
      if (progressPercent >= 80) {
        clearInterval(time)
      } else {
        progressPercent += 8
      }
      this.setState({ progressPercent })
    }, 1000)
    this.axios.instance({
      method: 'post',
      url: action!.path,
      data: params
    }).then((res: any) => {
      const { data, code, msg } = res.data
      if (code === 200) {
        // let url = window.URL.createObjectURL(data)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = data
        includeTime
          ? link.setAttribute('download', `${fileName}_${downloadDate}.${suffix}`)
          : link.setAttribute('download', `${fileName}.${suffix}`)
        document.body.appendChild(link)
        link.click()
        handleHide && handleHide()
      } else {
        this.$message.error('导出失败！')
      }
    }).catch((err: any) => {
      console.log(err)
    }).finally(() => {
      clearInterval(time)
      time = null
      this.setState({ visible: false, progressPercent: 100 })
    })
  }

  render () {
    const {
      props: { className, btntype, downloadTemplate, exportData, children, isClickExportData, title },
      state: { visible, progressPercent }
    } = this
    return (
      <div className={isClickExportData ? 'cus-dowload' : 'cus-dowload-stopclick'}>
        <Button
          className={className}
          type={btntype}
          onClick={exportData ? this.exportData : this.downloadTemplate}>
          {exportData && <span><Icon />{title}</span>}
          {downloadTemplate && <span><Icon /> 下载导入模板</span>}
          {children}
        </Button>
        <Modal title="" closable={false} footer={null} visible={visible}>
          <div className="upload-progress">
            <p>下载中，请稍等...</p>
            <Progress strokeColor={{
              to: '#24C8EA',
              from: '#2B8FF9'
            }}
            status="active" percent={progressPercent} />
          </div>
        </Modal>
      </div>
    )
  }
}
