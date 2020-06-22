/*
 * @Description: 广告管理列表
 * @Author: qiuyang
 * @Date: 2019-08-16 15:44:53
 * @LastEditTime: 2019-08-31 18:00:41
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Table, Button, Select, Form, Col, Input, Modal, Row } from 'antd'
import './index.less'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'

const { Item } = Form;
const { Option } = Select;

interface State {
}

interface FormProps extends BaseProps,FormComponentProps{
  searchParams: Function
}

class AdvertisementTitle extends RootComponent<FormProps, State> {
  constructor(props:any){
    super(props)
  }

  formData = () => {
    const formData = this.props.form.getFieldsValue()
    return formData
  }

  render(){
    const { getFieldDecorator } = this.props.form
    return (
      <Row className='ant-advertisement-search-row'>
        <Form className="ant-advertisement-search-form">
            <div className="search-header">
              <span className='title-left'>筛选查询</span>
              <Button className="title-right" onClick = {this.formData}>查询结果</Button>
            </div>
            <Col span={5}>
                <Item label="广告名称"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 13 }}
                  colon={true}
                  className="ant-classify-item">
                  { getFieldDecorator('labelName')(<Input  placeholder="单位名称"/>) }
                </Item>
            </Col>
            <Col span={5}>
                <Item label="广告位置"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}
                  className="ant-classify-item">
                  { getFieldDecorator('labelPosition')( 
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="全部"
                        optionFilterProp="children"
                        // onChange={onChange}     选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
                        // onFocus={onFocus}     获得焦点的回调
                        // onBlur={onBlur}    失去焦点的回调
                        // onSearch={onSearch}   文本框值变化时回调
                        // filterOption={(input, option) =>   
                          // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
                          // option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                      >
                        <Option value="home">小程序首页轮播</Option>
                        <Option value="goods">小程序商家页轮播</Option>
                    </Select>) }
                </Item>
            </Col>
            <Col span={5}>
                <Item label="到期时间"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}
                  className="ant-classify-item">
                  { getFieldDecorator('labelTime')( 
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="全部"
                        optionFilterProp="children"
                        // onChange={onChange}     选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
                        // onFocus={onFocus}     获得焦点的回调
                        // onBlur={onBlur}    失去焦点的回调
                        // onSearch={onSearch}   文本框值变化时回调
                        // filterOption={(input, option) =>   
                          // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
                          // option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                      >
                        <Option value="oneDay">一天内</Option>
                        <Option value="threeDay">三天内</Option>
                        <Option value="week">一周内</Option>
                    </Select>) }
                </Item>
            </Col>
        </Form>
      </Row>
    )
  }
}
export default Form.create()(AdvertisementTitle)