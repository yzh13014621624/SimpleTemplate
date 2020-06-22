/*
 * @description:
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-09-06 16:36:10
 * @LastEditTime: 2020-04-30 16:16:45
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import './index.less'
import { RootComponent, TableItem, BasicModal } from 'components'
import { Button, Form, Row, Col, Input, DatePicker, Select, Checkbox, Table } from 'antd'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import { FormComponentProps } from 'antd/es/form'

const { Item } = Form
const { Option } = Select
const { RangePicker } = DatePicker

interface State {
  data: any,
  indeterminate: boolean,
  checkAll: boolean,
  searchParams: any
  storeListParams: any
  currentStatus: number,
  btnlist: any,
  selectedRowKeys: any,
  isRequestData: boolean,
  storeItem: any
}
interface FormProps extends BaseProps, FormComponentProps { }

class StoreList extends RootComponent<FormProps, State> {
  tableRef = React.createRef<TableItem<any>>()
  modalRef = React.createRef<BasicModal>()

  constructor (props: any) {
    super(props)
    this.state = {
      data: [],
      indeterminate: false,
      checkAll: false,
      btnlist: [], // 状态按钮
      storeListParams: {
        bus1: 0,
        bus2: 0,
        bus3: 0,
        createTime: '',
        out: -1,
        // page: 1,
        // pageSize: 20,
        searchKey: '',
        type: ''
      },
      currentStatus: -1,
      searchParams: {
        bus1: null,
        bus2: null,
        bus3: null,
        searchKey: '', // 输入搜索
        type: '', // 商户类型
        createTime: '', // 创建时间
        out: '' // 门店状态
        // page: 1,
        // pageSize: 20
      },
      selectedRowKeys: [],
      isRequestData: true,
      storeItem: {}
    }
  }

  componentDidMount = () => {
    this.shopStatusNum()
  }

  // tab状态数量
  shopStatusNum = () => {
    this.axios.request(this.api.storeGetShopTotalByStatus).then(({ data }) => {
      this.setState({ btnlist: data })
    })
  }

  // 筛选门店
  storeStatusFilter = (id: number) => {
    let { storeListParams } = this.state
    storeListParams = Object.assign({}, storeListParams, { out: id, page: 1 })
    this.setState({
      storeListParams,
      currentStatus: id
    })
  }

  // 查询结果事件
  searchData = (out: any) => {
    const getFieldsValue = this.props.form.getFieldsValue()
    let { createTime, bus } = getFieldsValue
    const beginTime = createTime && createTime.length > 0 ? moment(createTime[0]).format('YYYY-MM-DD') : undefined
    const endTime = createTime && createTime.length > 0 ? moment(createTime[1]).format('YYYY-MM-DD') : undefined
    let { bus1, bus2, bus3 }: any = {}
    if (bus !== undefined) {
      bus.map((item: any, index: number) => {
        if (item === 0) {
          bus1 = 1
        }
        if (item === 1) {
          bus2 = 1
        }
        if (item === 2) {
          bus3 = 1
        }
      })
    }
    createTime = moment(createTime).format('YYYY-MM-DD') || undefined
    if (out !== '') {
      getFieldsValue.out = out
    }
    setTimeout(() => {
      this.setState({
        isRequestData: true,
        // searchParams: { ...getFieldsValue, bus1, bus2, bus3}
        searchParams: Object.assign(getFieldsValue, { createTime: undefined, beginTime, endTime }, { bus1, bus2, bus3 })
      })
    }, 500)
  }

  // 配置/解除打印机
  handleBindPrint = (storeItem: any) => {
    this.setState({ storeItem })
    this.modalRef.current!.handleOk()
  }

  // 提交配置/解除打印机
  handleConfrimBindPrint = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { sn } = values
        const { storeItem: { id, hasPos } } = this.state
        const params = { shopId: id, sn, type: hasPos + 1 }
        this.axios.request(this.api.storeShopBindPrint, params).then(({ code }) => {
          if (code === 200) {
            this.modalRef.current!.handleCancel()
            this.$message.success(hasPos === 0 ? '绑定成功' : '解绑成功')
            this.searchData('')
          }
        })
      }
    })
  }

  // 是否禁止请求table接口
  isRequestData = () => {
    this.setState({ isRequestData: false })
  }

  // 跳转至详情页
  handlerCheckout = (id: string) => {
    this.props.history.push(`/shop-management/list/detail?id=${id}`)
  }

  // 跳转至编辑页
  hanlderEdit = (id: any) => {
    this.props.history.push(`/shop-management/list/edit?id=${id}`)
  }

  // 跳转至添加门店
  addStore = () => {
    this.props.history.push('/shop-management/store')
  }

  // 修改商户状态
  changeStatus = (records: any, status: number, e: any) => {
    e.preventDefault()
    // let status: number = 0
    // switch (records.out) {
    //   case 0: status = 1; break
    //   case 1: status = 0; break
    //   case 2: status = 2; break
    //   case 3: status = 0; break
    // }
    this.axios.request(this.api.storeUpdateShopStatus, { shopId: records.id, out: status }).then(({ code }) => {
      if (code === 200) {
        this.shopStatusNum()
        this.tableRef.current!.loadingTableData()
        this.$message.info('操作成功')
      }
    })
    this.shopStatusNum()
  }

  render () {
    const {
      state: { searchParams, btnlist, isRequestData, storeItem },
      props: {
        form: { getFieldDecorator },
        mobxGlobal: { authorityList: { store }, hasAuthority }
      }
    } = this
    const columns: any[] = [
      {
        title: '门店ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '门店LOGO',
        dataIndex: 'logoImg',
        key: 'logoImg',
        render: (text: any, records: any) => {
          return <img src={records.logoImg} alt="" style={{ width: '40px', height: '30px' }} />
        }
      },
      {
        title: '门店名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '门店类型',
        dataIndex: 'type',
        key: 'type',
        render: (text: any, records: any) => {
          return <span>{records.type && records.type == 0 ? '直营' : records.type == 1 ? '加盟' : '合作'}</span>
        }
      },
      {
        title: '门店业务类型',
        dataIndex: 'bus1',
        key: 'bus1',
        render: (text: any, records: any) => {
          return <span>{records.bus1 && records.bus1 == 1 ? '外带' : ''} {records.bus2 && records.bus2 == 1 ? '堂吃' : ''} {records.bus3 && records.bus3 == 1 ? '外送' : ''}</span>
        }
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        key: 'linkman'
      },
      {
        title: '联系方式',
        dataIndex: 'linkmanPhone',
        key: 'linkmanPhone'
      },
      {
        title: '销售商品数',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
        render: (text: any, records: any) => {
          return <span>{records.goodsNum == null ? '0' : records.goodsNum}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text: any, records: any) => {
          return <span>{records.createTime}</span>
        }
      },
      {
        title: '状态',
        dataIndex: 'out',
        key: 'out',
        render: (text: any, records: any) => {
          return <span>{records.out === 0 ? '营业中' : records.out === 1 ? '暂停营业' : records.out === 2 ? '已关闭' : '筹备中'}</span>
        }
      },
      {
        title: '打印机',
        dataIndex: 'hasPos',
        key: 'hasPos',
        render: (text: any, records: any) => {
          return <div className="check-status">
            {text === 0 && <span onClick={() => this.handleBindPrint(records)}>配置</span>}
            {text === 1 && <span onClick={() => this.handleBindPrint(records)}>解除</span>}
          </div>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, records: any) => {
          return <div className="check-status">
            {sDetail && <span onClick={() => this.handlerCheckout(records.id)}>查看</span>}
            {sEdit && <span onClick={() => this.hanlderEdit(records.id)}>编辑</span>}
            {records.out === 0 && sStop ? <span onClick={(e) => this.changeStatus(records, 1, e)}>暂停营业</span> : ''}
            {records.out === 1 && sCheck ? <span onClick={(e) => this.changeStatus(records, 0, e)}>营业</span> : ''}
            {records.out === 3 && sCheck ? <span onClick={(e) => this.changeStatus(records, 0, e)}>审核营业</span> : ''}
            {(records.out === 0 || records.out === 1) && sClose ? <span onClick={(e) => this.changeStatus(records, 2, e)}>关闭</span> : ''}
          </div>
        }
      }
    ]
    const [pAdd, pEdit, pDetail, cAdd, cEdit, cDetail, gDetail, sAdd, sEdit, sDetail, sStop, sClose, sCheck]: any = hasAuthority(store)
    const { name, hasPos, posSn } = storeItem
    return (
      <div className="storeList">
        <Form className="ant-store-form">
          <div className='btnlist'>
            <Button onClick={() => this.searchData('')}>全部门店(<span>{btnlist.allTotal}</span>)</Button>
            <Button onClick={() => this.searchData(0)}>营业中(<span className='fontred'>{btnlist.enableTotal ? btnlist.enableTotal : 0}</span>)</Button>
            <Button onClick={() => this.searchData(1)}>暂停营业(<span className='fontred'>{btnlist.suspendedTotal ? btnlist.suspendedTotal : 0}</span>)</Button>
            <Button onClick={() => this.searchData(2)}>已关闭(<span className='fontred'>{btnlist.disableTotal ? btnlist.disableTotal : 0}</span>)</Button>
            <Button onClick={() => this.searchData(3)}>筹备中(<span className='fontred'>{btnlist.inPreparationTotal ? btnlist.inPreparationTotal : 0}</span>)</Button>
          </div>
        </Form>
        <Form className="ant-advanced-search-form">
          <div className="search-header">
            <p className='title'>筛选查询</p>
            <Button className="data-btn" onClick={() => this.searchData('')}>查询结果</Button>
          </div>
          <Row>
            <Col className="ant-col-search">
              <Item label="输入搜索"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                colon={true} >
                {getFieldDecorator('searchKey')(<Input placeholder="门店名称/门店ID" onChange={this.isRequestData} allowClear />)}
              </Item>
              <Item label="门店类型"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 6 }}
                colon={true} >
                {getFieldDecorator('type')(
                  <Select placeholder="请选择门店类型" onChange={this.isRequestData} allowClear>
                    <Option value={0}>直营</Option>
                    <Option value={1}>加盟</Option>
                    <Option value={2}>合作</Option>
                  </Select>
                )}
              </Item>
              <Item label="创建时间"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 6 }}
                colon={true} >
                {getFieldDecorator('createTime')(
                  <RangePicker
                    // placeholder='请选择时间'
                    showTime
                    format="YYYY-MM-DD"
                    onChange={this.isRequestData} />
                )}
              </Item>
              <Item label="门店状态"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 6 }}
                colon={true} >
                {getFieldDecorator('out', {
                  initialValue: ''
                })(
                  <Select placeholder="请选择门店状态" onChange={this.isRequestData} allowClear>
                    <Option value={''}>全部</Option>
                    <Option value={0}>营业中</Option>
                    <Option value={1}>暂停营业</Option>
                    <Option value={2}>已关闭</Option>
                    <Option value={3}>筹备中</Option>
                  </Select>
                )}
              </Item>
              <Item label="门店业务类型"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                colon={true}
              >
                {getFieldDecorator('bus')(
                  <Checkbox.Group onChange={this.isRequestData}>
                    <Checkbox value={1}>堂吃</Checkbox>
                    <Checkbox value={0}>外带</Checkbox>
                    <Checkbox value={2}>外送</Checkbox>
                  </Checkbox.Group>
                )}
              </Item>
            </Col>
          </Row>

        </Form>
        <Row className='list-title' type='flex' justify='space-between'>
          <Col className="title-data">数据列表</Col>
          <Col >
            {sAdd && <Button className="ant-search" htmlType="submit" onClick={this.addStore}>添加门店</Button>}
          </Col>
        </Row>
        <TableItem
          ref={this.tableRef}
          rowSelectionFixed
          filterKey="id"
          columns={columns}
          bordered={true}
          rowSelection={true}
          searchParams={searchParams}
          URL={this.api.storeFindShopList}
          rowKey={({ id }) => id}
          isRequestData={isRequestData}
        />
        <BasicModal
          ref={this.modalRef}
          destroyOnClose
          title={hasPos === 0 ? '配置小票打印机' : '解除小票打印机配置'}
        >
          <Form>
            <Row>
              <Item label="配置门店"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                colon={true} >
                {<span>{name}</span>}
              </Item>
            </Row>
            <Row>
              <Item label="打印机编号"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                colon={true} >
                {hasPos === 0
                  ? getFieldDecorator('sn', {
                    rules: [{ required: true, max: 9, message: '请输入9位数字' }]
                  })(<Input placeholder='请输入打印机编号' allowClear />) : <span>{posSn}</span>
                }
              </Item>
            </Row>
            <Row type='flex' justify='center'>
              <Button className="b-confirm" type='primary' onClick={this.handleConfrimBindPrint}>{hasPos === 0 ? '配置' : '解除'}</Button>
              <Button className="b-cancel" onClick={() => { this.modalRef.current!.handleCancel() }} >取消</Button>
            </Row>
          </Form>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(StoreList)
