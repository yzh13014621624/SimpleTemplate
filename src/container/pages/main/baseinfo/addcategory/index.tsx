/*
 * @Description: 添加类目
 * @Author: qiuyang
 * @Date: 2019-08-16 15:44:53
 * @LastEditTime: 2020-06-09 18:26:35
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import './index.less'
import { RootComponent } from 'components'
import { BaseProps } from 'typings/global'
import { inject, observer } from 'mobx-react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Avatar } from 'antd'

const { Option } = Select
const { Item } = Form

interface State {
  confirmDirty:boolean
}

interface FormProps extends BaseProps, FormComponentProps{}

@inject()
@observer
class AddCategory extends RootComponent<FormProps, State> {
  constructor (props: any) {
    super(props)
    this.state = {
      confirmDirty: false
    }
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    // this.props.form.validateFieldsAndScroll((err: any, values: any) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //   }
    // })
  }

  handleConfirmBlur = (e: any) => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
  }

  handlerSave = (e: any) => {
    const { value } = e.target
    this.props.history.push('/categorylist')
  }

  handlerBack = () => {
    this.props.history.push('/categorylist')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formStyle = {
      padding: '120px 200px 500px 200px',
      border: '1px solid #d5d5d5',
      backgroundColor: '#fbfbfb',
      borderRadius: 0
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    }
    return (
      <div className="addcategory">
        <div className="add-header">
          <p className='edit'>添加分类</p>
          <Button className="ant-edit" onClick={this.handlerBack}><Icon type="left" />返回</Button>
        </div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} style={formStyle}>
          <Item label="类目名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请填写类目名称'
                },
                {
                  type: 'name',
                  message: '类目名称最多20个，中文汉字'
                },
                {
                  max: 20,
                  message: '类目名称最多20个，中文汉字'
                }
              ]
            })(<Input placeholder="填写类目名称"/>)}
          </Item>
          <Item label="上级类目">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: ''
                }
              ]
            })(
              <Select placeholder="请选择分类" style={{ width: '100%' }}>
                <Select.Option value="一级分类">一级分类</Select.Option>
                <Select.Option value="二级分类">二级分类</Select.Option>
                <Select.Option value="三级分类">三级分类</Select.Option>
              </Select>
            )}
          </Item>
          <Item>
            <button className="ant-edit-btn" type="submit">提交</button>
          </Item>
        </Form>
      </div>
    )
  }
}
export default Form.create()(AddCategory)
