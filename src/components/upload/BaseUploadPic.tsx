/*
 * @description: TMS 图片多张图片上传，内含删除、预览、多选功能
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-07-04 14:27:48
 * @LastEditTime: 2019-09-07 14:37:30
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '../index'
import { Icon, Modal, Checkbox } from 'antd'
import RcUpload from 'rc-upload'
import { ComUtil } from 'utils/index'

import './style/BaseUploadPic'

interface PicItem {
  uid: number
  url: string
  selected?: boolean
  flag?:boolean // 后台上传图片不能选择 true:为后台上传的图片 false为app上传的图片
}

interface BaseUploadPicProps {
  className?: string // 样式类名
  style?: object // 行内样式
  multiple?: boolean // 是否多选
  accept?: string | string[] // 允许上传的类型
  fileSize?: number // 文件的大小上限，默认值为 3M
  fileSizeKb?: number // 文件大小上限以kb为单位时（没有默认值）
  onChange?: (list: PicItem[]) => void // 成功之后
  value?: PicItem[]
  maxlength?: number // 多选上传时，允许的上传最大张数，达到上限，隐藏上传按钮，默认不隐藏
  canRemove?: boolean // 是否可以移除，默认为 true
  canSelect?: boolean // 是否可以勾选，默认 false
}

interface BaseUploadPicState {
  imgUrl: PicItem[]
}

export default class BaseUploadPic extends RootComponent<BaseUploadPicProps, BaseUploadPicState> {
  static defaultProps = {
    fileSize: 3,
    multiple: false,
    canRemove: true,
    canSelect: false,
    maxlength: Infinity
  }

  accept = ['.png', '.jpg', '.jpeg', '.JPG', '.PNG', '.JPEG']

  constructor (props: BaseUploadPicProps) {
    super(props)
    const { accept, value } = props
    if (accept) {
      if (typeof accept === 'string') {
        const { include } = ComUtil.inArray(accept, this.accept)
        if (!include) this.accept.push(accept)
      } else {
        this.accept = [...this.accept, ...accept]
      }
    }
    this.state = {
      imgUrl: value || []
    }
  }

  componentWillReceiveProps (props: BaseUploadPicProps) {
    this.setState({
      imgUrl: props.value || []
    })
  }

  beforeUpload = (file: any) => {
    const {
      props: { fileSize, fileSizeKb },
      accept,
      $message
    } = this
    const { size, name } = file
    const lastIndex = name.lastIndexOf('.')
    const suffix = (name as string).substring(lastIndex, name.length)
    const { include } = ComUtil.inArray(suffix, accept)
    if (!include) {
      $message.error('请上传格式正确的图片')
      return false
    }
    if(!fileSizeKb){
      if ((size / 1024 / 1024) > fileSize!) {
        $message.warning(`上传图片的大小不能超过${fileSize}M`)
        return false
      }
    }else{
      if ((size / 1024 ) > fileSizeKb!) {
        $message.warning(`上传图片的大小不能超过${fileSizeKb}KB`)
        return false
      }
    }
  }

  onSuccess = (file: File) => {
    const reader = new FileReader()
    const { state: { imgUrl }, props: { onChange } } = this
    const len = imgUrl.length
    reader.readAsDataURL(file)
    reader.onload = (e: any) => {
      const imgItem = {
        uid: len > 0 ? imgUrl[len - 1].uid + 1 : 0,
        url: e.target.result,
        selected: false,
        file,
        flag: true
      }
      imgUrl.push(imgItem)
      onChange && onChange(imgUrl)
      this.setState({ imgUrl })
    }
  }

  customRequest = (request: any) => {
    const { file } = request
    request.onSuccess(file)
  }

  removePicItem = (uid: number) => {
    const { state: { imgUrl }, props: { onChange } } = this
    imgUrl.some((item, i, arr) => {
      if (item.uid === uid) {
        arr.splice(i, 1)
        return true
      }
      return false
    })
    onChange && onChange(imgUrl)
    this.setState({ imgUrl })
  }

  modifyPicItemSelectStatus = (uid: number) => {
    const { state: { imgUrl }, props: { onChange } } = this
    imgUrl.some((item, i) => {
      if (item.uid === uid) {
        item.selected = !item.selected
        return true
      }
      return false
    })
    onChange && onChange(imgUrl)
    this.setState({ imgUrl })
  }

  render () {
    const {
      accept,
      props: { multiple, canRemove, canSelect, maxlength },
      state: { imgUrl },
      onSuccess,
      beforeUpload,
      customRequest,
      removePicItem,
      modifyPicItemSelectStatus
    } = this
    const RcConfit = {
      accept: accept.join(),
      multiple,
      onSuccess,
      beforeUpload,
      customRequest
    }
    return (
      <div className="upload_pic_container">
        {
          !!imgUrl.length &&
          imgUrl.map(({ uid, url, selected, flag }) => {
            return (
              <div className="pic_item" key={uid}>
                <div className="photo_wall_warapper pic_wrapper">
                  <img src={url} className="upload_picture" />
                  {canRemove && <div className="remove_button" onClick={removePicItem.bind(this, uid)}>删除</div>}
                </div>
                {
                  canSelect &&
                    <Checkbox disabled={flag} checked={selected} onChange={modifyPicItemSelectStatus.bind(this, uid, selected)} />
                }
              </div>
            )
          })
        }
        {
          imgUrl.length < maxlength! &&
          <RcUpload {...RcConfit}>
            <div className="upload_placeholder pic_wrapper">
              {/* <Icon component={IconPhoto} /> */}
              <p className="placeholder">上传图片</p>
            </div>
          </RcUpload>
        }
      </div>
    )
  }
}
