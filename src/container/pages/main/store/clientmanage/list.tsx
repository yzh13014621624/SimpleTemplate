/*
 * @description: 
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-26 10:25:51
 * @LastEditTime: 2019-09-06 16:10:29
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent,TableItem } from 'components'
import { Button,Form,Col,Input,Row} from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'

const {Item} = Form
interface State {
  customerList: any,
  getInfo: any,
  searchParams: any
}

interface FormProps extends BaseProps,FormComponentProps{}

 class ClientList extends RootComponent<FormProps,State>{
   constructor(props: any){
     super(props)
     this.state = {
        customerList:[],
        getInfo:[],
        searchParams: {}
      }
   }
   componentDidMount () {
    this.customerList()
  }
  //获取客户列表
  customerList() {
    this.axios.request(this.api.storeCustomerList,{}) .then(({data}) => {
      this.setState({
      customerList: data.data
    })
    })
  }
   //跳转至详情页
   handlerCheckout = (id: any) => {
    this.props.history.push(`/shop-management/client/detail?id=${id}`)
   }
   //跳转至编辑页
   handlerEdit = (id: any) => {
    this.props.history.push(`/shop-management/client/edit?id=${id}`)
   }
   //跳转至添加客户
   addClient = () => {
    this.props.history.push('/shop-management/client/add')
   }
   //查询搜索
   handlerSearch = () => {
    const formData = this.props.form.getFieldValue('name')
    console.log(formData)
    this.setState({
      searchParams:{
        name:formData
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
    const columns: any = [
      {
        title: '客户名称',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '客户联系人',
        dataIndex: 'contactName',
        key:'contactName'
      },
      {
        title: '客户联系方式',
        dataIndex: 'mobile',
        key:"mobile"
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key:'edit',
        render: (text: any, record: any) => {
          return(
            <div className="edit-btn-link">
             {cDetail && <span onClick={ () => this.handlerCheckout(record.id) }>查看</span>}
             {cEdit && <span onClick={ () => this.handlerEdit(record.id) }>编辑</span>}
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
            <Row>
              <div className="input_220">
              <Col className="ant-col-search">
                  <Item label="客户名称"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 3 }}>
                    {getFieldDecorator('name')(<Input  placeholder="客户名称" allowClear/>)}
                  </Item>
              </Col>
              </div>
            </Row>
        </Form>
        <Row className='list-title' type='flex' justify='space-between'>
            <Col className="title-data">数据列表</Col>
            <Col >
              {cAdd && <Button className="ant-search" htmlType="submit" onClick={this.addClient}>添加客户</Button>}
            </Col>
        </Row>
        <TableItem 
          rowSelectionFixed
          filterKey="id"
          columns={columns} 
          bordered = {true}
          rowSelection={false}
          searchParams = {searchParams}
          URL={this.api.storeCustomerList}
          rowKey={({ id }) => id}
            />
      </div>
      )
  }
}
export default Form.create<FormProps>()(ClientList)
