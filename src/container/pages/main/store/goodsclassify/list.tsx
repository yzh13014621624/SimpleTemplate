/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-29 14:53:27
 * @LastEditTime: 2019-09-07 15:42:26
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent,TableItem } from 'components'
import { Button,Form,Col,Input} from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'

const {Item} = Form

interface State {
  getInfo: any,
  searchParams: any
}
interface FormProps extends BaseProps,FormComponentProps{}

 class classfiyList extends RootComponent<FormProps,State> {
  constructor(props: any){
    super(props)
    this.state = {
     getInfo:[],
     searchParams: {}
 }
}
  //跳转至详情
  handlerCheckout = (record: any) => {
    this.props.history.push(`/shop-management/classfiy/detail?cateId=${record.cateId}&shopId=${record.shopId}`)
  }
  //查询搜索
  handlerSearch = () => {
    const searchKey = this.props.form.getFieldValue('searchKey')
    this.setState({
      searchParams:{
        searchKey
      }
    })
  }

  render() {
    const {
      state: { searchParams },
      props: { 
        form : { getFieldDecorator },
        mobxGlobal: { authorityList: { store }, hasAuthority }
      }
    } = this
    const [pAdd, pEdit, pDetail,cAdd, cEdit, cDetail,gDetail,sAdd, sEdit, sDetail,sStop,sClose,sCheck]:any = hasAuthority(store)
    const columns:any = [
      {
        title: '门店ID',
        dataIndex: 'shopId',
        key:'shopId'
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        key:'shopName'
      },
      {
          title: '分类名称',
          dataIndex: 'cateName',
          key:"cateName"
      },
      {
          title: '分类下商品数量',
          dataIndex: 'cateGoodsTotalNum',
          key:'cateGoodsTotalNum'
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key:'edit',
        render: (text: any, record: any) => {
          return(
            <div className="edit-btn-link">
              {gDetail && <span onClick={ () => this.handlerCheckout(record) }>查看</span>}
            </div>
          )
        }
      },
    ]
  return(
    <div className="goodsList">
      <Form className="ant-advanced-search-form">
      <div className="search-header">
              <p className='title'>筛选查询</p>
              <Button className="data-btn" onClick={this.handlerSearch }>查询结果</Button>
            </div>
            <Col className="ant-col-search">
                <Item label="输入搜索"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 2 }}>
                  {getFieldDecorator('searchKey')(<Input  placeholder="门店名称/门店ID" allowClear/>)}
                </Item>
            </Col>
      </Form>
      <div style={{display:'flex',justifyContent:'space-between'}}>
            <div>数据列表</div>   
      </div>
      <TableItem 
        rowSelectionFixed
        filterKey="id"
        columns={columns} 
        bordered = {true}
        rowSelection={false}
        searchParams = {searchParams}
        URL={this.api.storeCateList}
        rowKey={({ id }) => id}
            />
    </div>
     )
   }
 }
 export default Form.create<FormProps>()(classfiyList)