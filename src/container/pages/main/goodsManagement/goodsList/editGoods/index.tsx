/*
 * @description: 商品详情编辑页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2019-08-28 14:11:37
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Cascader, Input, Select, Radio, Button } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import { SearchHeader } from 'components/index'
import './index.less'

import { hot } from 'react-hot-loader'

const Item = Form.Item
const { Option } = Select
const { Group } = Radio
const { TextArea } = Input

interface FormProps extends BaseProps,FormComponentProps{}

@hot(module)
class GoodsEdit extends RootComponent<FormProps> {
  componentDidMount() {
  }

  /**页面事件 */
  onSubmit = (e: any) => {
    e.preventDefault()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 18,
        style: {
          marginLeft: '8px',
          width: '350px'
        }
      }
    }

    const formLongLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 18,
        style: {
          marginLeft: '8px',
        }
      }
    }
    return (
      <div className='edit-goods-container'>
        <Form onSubmit={this.onSubmit}>
          <SearchHeader title='基本信息'>
            <Item label='商品名称' {...formLayout}>
              <div>标准商品</div>
            </Item>
            <Item label='商品分类' {...formLayout}>
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品分类'
                  }
                ]
              })(
                <Cascader placeholder='请选择商品分类' />
              )}
            </Item>
            <Item label='商品名称' {...formLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称'
                  }
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )}
            </Item>
            <Item label='商品图片' {...formLayout}>
              {getFieldDecorator('imgs', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品图片'
                  }
                ]
              })(
                <Input placeholder='请选择商品图片' />
              )}
            </Item>
            <Item label='商品单位' {...formLayout}>
              {getFieldDecorator('unit', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品单位'
                  }
                ]
              })(
                <Select placeholder='请选择商品单位'>
                  <Option value='1'>个</Option>
                </Select>
              )}
            </Item>
            <Item label='储蓄类型' {...formLayout}>
              {getFieldDecorator('saveType', {})(
                <Group >
                  <Radio value='1'>常温</Radio>
                  <Radio value='2'>冷藏</Radio>
                </Group>
              )}
            </Item>
            <Item label='经营属性' {...formLayout}>
              {getFieldDecorator('attribute', {
                rules: [
                  {
                    required: true,
                    message: '请选择经营属性'
                  }
                ]
              })(
                <Select placeholder='请选择经营属性'>
                  <Option value='1'>直营</Option>
                </Select>
              )}
            </Item>
            <Item label='长宽高' {...formLongLayout}>
              {getFieldDecorator('attribute', {
                rules: [
                  {
                    required: true,
                    message: '请输入长宽高'
                  }
                ]
              })(
                <>
                  <Input className='spec-input' addonAfter='cm' />
                  <Input className='spec-input' addonAfter='cm' />
                  <Input className='spec-input' addonAfter='cm' />
                </>
              )}
            </Item>
            <Item label='规格' {...formLayout}>
              {getFieldDecorator('spec', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品规格'
                  }
                ]
              })(
                <Input placeholder='请输入商品规格' />
              )}
            </Item>
            <Item label='重量' {...formLongLayout}>
              {getFieldDecorator('attribute', {
                rules: [
                  {
                    required: true,
                    message: '请输入重量'
                  }
                ]
              })(
                <>
                  <Input className='weight-input' addonAfter='kg' />
                  <Input className='weight-input' addonAfter='kg' />
                </>
              )}
            </Item>
            <Item label='商品所属部门' {...formLayout}>
              {getFieldDecorator('department', {
                initialValue: '1'
              })(
                <Select placeholder='请选择商品所属部门'>
                  <Option value='1'>销售部</Option>
                </Select>
              )}
            </Item>
            <Item label='商品标签' {...formLayout}>
              {getFieldDecorator('label', {})(
                <Group >
                  <Radio value='1'>热销</Radio>
                  <Radio value='2'>新品</Radio>
                </Group>
              )}
            </Item>
          </SearchHeader>
          <SearchHeader title='商品条码信息'>
            <Item label='商品编码' {...formLayout}>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品编码'
                  }
                ]
              })(
                <Input placeholder='请输入商品编码' />
              )}
            </Item>
            <Item label='商品自编码' {...formLayout}>
              {getFieldDecorator('selfCode', {})(
                <Input placeholder='请输入商品自编码' />
              )}
            </Item>
            <Item label='商品条码' {...formLayout}>
              {getFieldDecorator('barcode', {})(
                <>
                  <div>
                    <Input placeholder='请输入商品条码' />
                    <div>+</div>
                  </div>
                  <Input placeholder='请输入商品自编码' />
                  <Input placeholder='请输入商品自编码' />
                </>
              )}
            </Item>
          </SearchHeader>
          <SearchHeader title='商品价格'>
            <Item label='销售价' {...formLayout}>
              {getFieldDecorator('pirce', {
                rules: [
                  {
                    required: true,
                    message: '请输入销售价'
                  }
                ]
              })(
                <Input placeholder='请输入销售价' />
              )}
            </Item>
            <Item label='采购价' {...formLayout}>
              {getFieldDecorator('purchasePrice', {
                rules: [
                  {
                    required: true,
                    message: '请输入采购价'
                  }
                ]
              })(
                <Input placeholder='请输入采购价' />
              )}
            </Item>
          </SearchHeader>
          <SearchHeader title='客户信息'>
            <Item label='所属客户' {...formLayout}>
              {getFieldDecorator('customer', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属客户'
                  }
                ]
              })(
                <Select placeholder='请选择所属客户'>
                  <Option value='1'>客户一</Option>
                </Select>
              )}
            </Item>
            <Item label='供应商' {...formLayout}>
              {getFieldDecorator('supplier', {
                rules: [
                  {
                    required: true,
                    message: '请选择供应商'
                  }
                ]
              })(
                <Select placeholder='请选择供应商'>
                  <Option value='1'>供应商一</Option>
                </Select>
              )}
            </Item>
          </SearchHeader>
          <SearchHeader title='包材信息'>
            <Item label='堂食包材' {...formLayout}>
              {getFieldDecorator('innerMaterial', {})(
                <>
                  <Button type='primary'>添加包材</Button>
                </>
              )}
            </Item>
            <Item label='外带包材' {...formLayout}>
              {getFieldDecorator('outMaterial', {
                rules: [
                  {
                    required: true,
                    message: '请添加外带包材'
                  }
                ]
              })(
                <>
                  <Button type='primary'>添加包材</Button>
                </>
              )}
            </Item>
          </SearchHeader>
          <SearchHeader cancelPadding={true} title='商品详情'>
            <TextArea className='textarea' />
          </SearchHeader>
          <div style={{textAlign: 'center'}}>
            <Button htmlType='submit' className='submit-button' type='primary'>提交</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create<FormProps>()(GoodsEdit)