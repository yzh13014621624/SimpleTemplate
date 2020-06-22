/*
 * @description: 草稿/提交/删除/通过/撤回/放弃/驳回弹窗
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-10 13:28:37
 * @LastEditTime: 2019-09-04 16:36:27
 * @Copyright: Copyright © 2019 Shanghai Shangjia Logistics Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from 'components/index'
import { Button, Input, Row } from 'antd'

import './index.styl'

import { BaseProps } from 'typings/global'

interface UrlInteface {
  path:string
  type?:string
}

interface BaseModalProps extends BaseProps {
  text?: string // 提示文本
  path?: string // 跳转路由
  confirmText?: string // 确定按钮文本
  cancelText?: string // 取消按钮文本
  intercept?: boolean // 是否拦截确定事件，默认 false
  url?: UrlInteface // 后台接口
  params?: object // 后台数据
  load?: () => void // 处理之后是否刷新数据，也可以是其他逻辑处理
  confirm?: (data?: any) => void // 拦截确定事件的处理函数
  showConfirm?: boolean // 隐藏与否确定按钮
  showCancle?: boolean // 隐藏与否取消按钮
  onClose?: () => void // 拦截取消事件的处理函数
}

interface BaseModalState {
  rejectReason?: string
}

class BaseModal extends RootComponent<BaseModalProps, BaseModalState> {
  static defaultProps = {
    confirmText: '确认',
    cancelText: '取消',
    showConfirm: true,
    showCancle: true,
    intercept: false
  }

  modalRef = React.createRef<BasicModal>()

  constructor (props: BaseModalProps) {
    super(props)
  }

  show = () => {
    this.modalRef.current!.handleOk()
  }

  handlerConfirm = () => {
    const { props, axios, handleCancel } = this
    const { url, intercept, path, params, load, confirm, history, showCancle } = props
    if (!showCancle) {
      handleCancel()
      return
    }
    if (intercept) {
      confirm && confirm()
      return
    }
    axios.request(url!, params!).then(() => {
      handleCancel()
      load && load()
      path && history.replace(path)
    })
  }

  handleCancel = () => {
    const { onClose } = this.props
    this.modalRef.current!.handleCancel()
    onClose && onClose()
  }

  createModalChildren (txt?: string) {
    const {
      modalRef, handlerConfirm, handleCancel,
      props: { confirmText, cancelText, text, showConfirm, showCancle }
    } = this
    return (
      <BasicModal ref={modalRef} title={'提示'} width="480px">
        <div className="modal_container">
          <p className='modal_text'>{txt || text}</p>
          {showConfirm && <Button onClick={handlerConfirm} className="b-confirm" type='primary'>{confirmText}</Button>}
          {showCancle && <Button onClick={handleCancel} className="b-cancel">{cancelText}</Button>}
        </div>
      </BasicModal>
    )
  }
}

/* 通用模态框 */
export class BaseCommonModal extends BaseModal {
  render = () => this.createModalChildren()
}

/* 草稿模态框 */
export class BaseDraftModal extends BaseModal {
  render = () => this.createModalChildren('确认保存为草稿？')
}

/* 提交模态框 */
export class BaseSubmitModal extends BaseModal {
  render = () => this.createModalChildren('确认要提交吗？')
}

/* 删除模态框 */
export class BaseDeleteModal extends BaseModal {
  render = () => this.createModalChildren('确认要删除吗？')
}

/* 通过模态框 */
export class BasePassModal extends BaseModal {
  render = () => this.createModalChildren('确认要通过吗？')
}

/* 撤回模态框 */
export class BaseRecallModal extends BaseModal {
  render = () => this.createModalChildren('确认要撤回吗？')
}

/* 放弃模态框 */
export class BaseAbandonModal extends BaseModal {
  render = () => this.createModalChildren('确认要放弃吗？')
}
/* 启用模态框 */
export class BaseOnModal extends BaseModal {
    render = () => this.createModalChildren('确认要启用吗？')
}
/* 启用模态框 */
export class BaseOffModal extends BaseModal {
  render = () => this.createModalChildren('确认要停用吗？')
}
/* 反审核模态框 */
export class BaseTheauditModal extends BaseModal {
  render = () => this.createModalChildren('确认要反审核吗？')
}
/* 反确认模态框 */
export class BaseReconfirmModal extends BaseModal {
  render = () => this.createModalChildren('确认要反确认吗？')
}
/* 驳回模态框 */
export class BaseReturnModal extends BaseModal {
  constructor (props: BaseModalProps) {
    super(props)
    this.state = {
      rejectReason: ''
    }
  }
  getRejectReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const reg = /[^\u4E00-\uFA29-\uE7C7-\uE7F3a-zA-Z_0-9]{0,30}/g
    this.setState({
      rejectReason: e.target.value.replace(reg, '')
    })
  }

  handlerConfirm = () => {
    if (!this.state.rejectReason!.trim()) {
      this.$message.warn('请输入原因')
      return
    }
    const { props, axios, state, handleCancel } = this
    const { url, intercept, path, params, load, confirm, history } = props
    const { rejectReason } = state
    if (intercept) {
      confirm && confirm(rejectReason)
      return
    }
    const param = { ...params!, rejectReason }
    axios.request(url!, param).then(() => {
      load && load()
      path && history.replace(path)
      handleCancel()
    })
  }

  render () {
    const { handlerConfirm, handleCancel, props, state, modalRef } = this
    const { confirmText, cancelText } = props
    return (
      <BasicModal ref={modalRef} title={null} width="480px">
        <div className="return_container">
          <Row className="return_textarea" type="flex" align="middle">
            <span>驳回理由：</span>
            <Input.TextArea
              maxLength={30}
              value={state.rejectReason}
              onChange={this.getRejectReason}
              placeholder="请输入审核不通过原因（不超过30字）" />
          </Row>
          <Row className="return_button_wrapper">
            <Button onClick={handlerConfirm} className="b-confirm" type='primary'>{confirmText}</Button>
            <Button onClick={handleCancel} className="b-cancel">{cancelText}</Button>
          </Row>
        </div>
      </BasicModal>
    )
  }
}
