/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-15 19:32:51
 * @LastEditTime: 2019-09-16 11:34:51
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from 'components'
import { Form, Col, Row,Table} from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import { HttpUtil } from 'utils'
import './index.less'

const {Item} = Form

interface State {
  details: any,
  searchParams: any
}
interface FormProps extends BaseProps,FormComponentProps{}

 class ClassfiyDetail extends RootComponent<FormProps,State> {
    columns: any =[
    {
      title: '门店商品ID',
      dataIndex: 'goodsId',
      key:'goodsId'
    },
    {
      title: '商品图片',
      dataIndex: 'imagePath',
      key:'imagePath',
      render: (text: any,recond: any) => {
        return <img src={recond.imagePath} style={{width:'50px',height:'50px'}}/>
    }
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      key:"title"
    },
    {
      title: '商品售价',
      dataIndex: 'price',
      key:'price',
    },
    {
      title: '商品采购价',
      dataIndex: 'purchasePrice',
      key:'purchasePrice'
    },
    {
      title: '门店商品库存',
      dataIndex: 'qty',
      key:'qty'
    }
  ]
   constructor(props: any){
     super(props)
     this.state={
        details:[],
        searchParams: {}
     }
}
componentDidMount() {
  this.getInfo()
}
//获取客户详情
getInfo() {
  const {cateId,shopId} = HttpUtil.parseUrl(window.location.href)
  this.axios.request(this.api.storeCateListInfo,{cateId,shopId}).then(({ data: {data}} ) => {
    this.setState({details: data })
  })
}


  render() {
    const { 
    state:{ details, searchParams },
    props:{ form: { getFieldDecorator } }
    } = this
  return(
  <div className="classfiyDetail">
      <Form className = 'goodsclassifyForm'>
        <div className="store-tag">门店商品分类</div>
        <Row>
          <Col>
            <Item label="门店名称"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              colon={true} >
              <span>{details.length >0 && details[0].shopName}</span>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Item label="商品分类名称"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              colon={true} >
              <span>{details.length >0 && details[0].cateName}</span>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Item label="分类下商品"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              style={{backgroundColor:'#ffffff'}} >
                {getFieldDecorator('classfiy')(
                 <Table
                  columns={this.columns}
                  dataSource={details}
                  bordered = {true}
                  pagination={false}
                  />
                )}
            </Item>
          </Col>
        </Row>
      </Form>
  </div>
  )
  }
}
export default Form.create<FormProps>()(ClassfiyDetail)