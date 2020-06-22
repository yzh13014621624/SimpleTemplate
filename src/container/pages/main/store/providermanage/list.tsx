/*
 * @description: 
 * @author: wanglu
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: wanglu
 * @Date: 2019-08-16 15:10:22
 * @LastEditTime: 2019-09-06 18:15:37
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
import * as React from 'react'
import { RootComponent,TableItem } from 'components'
import { Button,Form,Col,Input,Row} from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'

const {Item} = Form
interface State {
  data:any,
  searchParams: any
}
interface FormProps extends BaseProps,FormComponentProps{}

 class ProviderList extends RootComponent<FormProps,State>{
   constructor(props: any){
     super(props)
     this.state = {
        data: [],
        searchParams:{}
      }
   }
   componentDidMount() {
     this.getSupplierList()
   }
   getSupplierList() {//获取供应商列表
     this.axios.request(this.api.storeSupplierList,{}).then((res) => {
        this.setState({
          data: res.data.data
        })
     })
   }
   //查询搜索
   handlerSearch = () => {
    const formData = this.props.form.getFieldValue('name')
    this.setState({
      searchParams:{
        name:formData
      }
    })
   }
   //跳转至详情页
   handlerCheckout = (id: any) => {
    this.props.history.push(`/shop-management/provider/detail?id=${id}`)
   }
   //跳转至编辑页
   handlerEdit = (id: any) => {
    this.props.history.push(`/shop-management/provider/edit?id=${id}`)
   }
   //添加供应商
   addProvider = () => {
    this.props.history.push('/shop-management/provider/add')
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
    const columns: any[] = [
      {
        title: '供应商名称',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '供应商联系人',
        dataIndex: 'contactName',
        key:'contactName'
      },
      {
          title: '供应商联系方式',
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
                      {pDetail && <span onClick={() => this.handlerCheckout(record.id)}>查看</span>}
                      {pEdit && <span onClick={() => this.handlerEdit(record.id)}>编辑</span>}
                  </div>
              )
          }
      }
    ]
      return(
        <div className="provider-list">
          <Form className="ant-advanced-search-form">
          <div className="search-header">
              <p className='title'>筛选查询</p>
              <Button className="data-btn" onClick={this.handlerSearch }>查询结果</Button>
            </div>
            <Row>
              <div className="input_220">
                <Col className="ant-col-search">
                    <Item label="供应商名称"
                      labelCol={{ span: 2 }}
                      wrapperCol={{ span: 3 }}>
                      {getFieldDecorator('name')(<Input  placeholder="供应商名称" allowClear style={{width:'220px'}}/>)}
                    </Item>
                </Col>
              </div>
            </Row>
          </Form>
          <Row className='list-title' type='flex' justify='space-between'>
            <Col className="title-data">数据列表</Col>
            <Col >
              {pAdd && <Button className="ant-search" htmlType="submit" onClick={this.addProvider}>添加供应商</Button>}
            </Col>
          </Row>
          <TableItem 
            rowSelectionFixed
            filterKey="id"
            columns={columns} 
            bordered = {true}
            rowSelection={false}
            searchParams = {searchParams}
            URL={this.api.storeSupplierList}
            rowKey={({ id }) => id}
            />
         </div>
        )
    }
}
export default Form.create<FormProps>()(ProviderList)
