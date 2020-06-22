/*
 * @description: minjie, huxianghe
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 15:42:11
 * @LastEditTime: 2020-06-09 18:22:18
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, EmptyTable } from '../index'
import { Table, ConfigProvider, Button } from 'antd'
import { ComUtil, JudgeUtil } from 'utils/index'

import './index.less'

import { KeyValue } from 'typings/global'
import { ColumnProps } from 'antd/lib/table'
import { PaginationProps } from 'antd/lib/pagination'
type RowSelectionType = 'checkbox' | 'radio'

interface UrlInteface {
  path:string
  type?:string
}

interface TableItemProps {
  axios?: (url: UrlInteface, param: any, intercept: boolean) => Promise<any>
  URL: UrlInteface,
  rowKey: string | {(record: KeyValue): any},
  // columns: any
  columns: ColumnProps<any>[]
  searchParams?: object,
  pageSize?: number // 每页条数
  index?: boolean // 是否设置列表序号，默认 true
  scroll?: {
    x?: boolean | number | string
    y?: boolean | number | string
  }
  type?: number // 操作类型 1 - 删除；2 - 导出，默认 1
  rowSelection?: any, // 默认 true
  rowSelectionFixed?: boolean, // 第一列是否设置为左浮动，默认 true
  rowSelectionType?: RowSelectionType, // 设置表格是单选还是多选，默认多选
  filterKey?: string // 新增 key，和 rowKey 一致，但是只能是字符串类型，例如 id，默认 id
  onRow?: boolean // 是否要单击表单任意行选中/取消选中当前行
  getSelectedRow?: (selectedRowKeys: any[], selectedRows: KeyValue[]) => void // 如果需要，该接口用来提供表格选中的数据给父组件
  getRemoveSelect?: Function // 删除的选中信息
  getRemoveSelectAll?: Function // 删除的选中信息: 全部选中或取消的时候
  bordered?: any
  isPagination?: boolean // 是否需要分页的 true 显示， false 不显示默认的是true
  onGetData?: Function // 获取接口数据
  isRequestData?: boolean // 是否请求数据
}
interface TableState {
  dataSource: any[]
  pagination: PaginationProps
  selectedRowKeys: any[]
  selectedRows: KeyValue[]
  isPagination?: boolean, // 是否需要分页的 true 显示， false 不显示默认的是true
  dataSourcePic?:boolean,
}

// table 的数据 分页的数据

export default class TableItem<T> extends RootComponent<TableItemProps, TableState> {
  static defaultProps = {
    type: 1,
    index: true,
    filterKey: 'id',
    onRow: true,
    rowSelection: true,
    rowSelectionFixed: false,
    rowSelectionType: 'checkbox',
    bordered: false,
    isRequestData: true
  }

  columns: ColumnProps<any>[] = []

  constructor (props: TableItemProps) {
    super(props)
    const { isPagination, columns, pageSize = 10 } = props
    this.formatColumsList(columns)
    this.state = {
      dataSource: [], // 保存前的数据
      pagination: {
        current: 1, // 当前的页
        pageSize, // 每页显示的条数
        total: 1,
        size: 'small',
        showQuickJumper: true,
        onChange: (page: number) => {
          const { pagination } = this.state
          pagination.current = page
          this.setState({ pagination })
          this.loadingTableData()
        },
        itemRender: (current: number, type: string, originalElement: any) => {
          if (type === 'prev') {
            return <Button size="small" style={{ margin: '0 6px' }}>上一页</Button>
          } if (type === 'next') {
            return <Button size="small" style={{ margin: '0 6px' }}>下一页</Button>
          }
          return originalElement
        },
        showTotal: (total:any) => `总条数：${total}`
      },
      selectedRowKeys: [],
      selectedRows: [],
      isPagination: isPagination !== false,
      dataSourcePic: false
    }
  }

  /**
   * 格式化 Table 组件 column 属性
   */
  formatColumsList (columns: ColumnProps<any>[]) {
    columns.forEach(item => {
      if (!item.render) item.render = (text: string) => (<span>{(JudgeUtil.isEmpty(text) && '/') || text}</span>)
    })
    this.columns = columns
  }

  /**
   * 初始化数据
   */
  componentDidMount () {
    this.loadingTableData()
  }

  async componentWillReceiveProps (props: TableItemProps) {
    if (!ComUtil.compareDeep(this.props.searchParams, props.searchParams)) {
      const pagination = this.state.pagination
      pagination.current = 1
      await this.setState({
        pagination,
        selectedRowKeys: [],
        selectedRows: []
      })
    }
    this.loadingTableData(props, true) // 当 props 的值改变的时候重新查询值
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /**
   * 加载数据
   */
  loadingTableData = (props: any = this.props, bool?:boolean) => {
    const { state: { pagination, selectedRows, selectedRowKeys } } = this
    const { searchParams, index, onGetData, axios, filterKey, isRequestData } = props
    const page = pagination.current!
    const pageSize = pagination.pageSize!
    const params = { page, pageSize, ...searchParams }
    const request = axios || this.axios.request
    // 是否存在收集的数据
    const hasSelected = !!selectedRowKeys.length
    request(props.URL, params, true)
      .then(({ data }: any) => {
        let dataObj = []
        if (JudgeUtil.isArrayFn(data)) { // 返回的值为数组的时候
          dataObj = data
        } else {
          pagination.total = data.totalNum
          dataObj = data.data || data.bodyDto.data
        }
        if (index) {
          dataObj.forEach((item: any, i: number) => {
            item.index = (i + 1) + (page - 1) * pageSize
            const newKey = item[filterKey]
            // 更新选中的数据
            if (hasSelected) {
              selectedRowKeys.forEach((oldKey, index) => {
                if (newKey === oldKey) {
                  selectedRows.splice(index, 1, item)
                }
              })
            }
          })
        }
        if (bool && dataObj.length === 0) {
          this.setState({
            dataSourcePic: true
          })
        } else {
          this.setState({
            dataSourcePic: false
          })
        }
        onGetData && onGetData(dataObj)
        this.setState({
          dataSource: dataObj,
          pagination,
          selectedRows,
          selectedRowKeys
        })
      }).catch((err:any) => {
        if (err.msg) {
          this.$message.error(err.msg)
        } else {
          this.$message.error(err)
        }
      })
  }

  /**
   * 点击表格任意一行选中或者取消选中
   */
  selectedCurrentRow = (row: KeyValue) => {
    const key = this.props.filterKey as string
    const currentVal = row[key]
    const type = this.props.rowSelectionType
    const selectedRowKeys = this.state.selectedRowKeys as (string|number)[]
    const selectedRows = this.state.selectedRows as KeyValue[]
    if (type === 'radio') {
      selectedRowKeys.splice(0)
      selectedRows.splice(0)
      selectedRowKeys.push(currentVal)
      selectedRows.push(row)
    } else {
      const { include, index } = ComUtil.inArray(currentVal, selectedRowKeys)
      if (include) {
        selectedRows.some((item, i) => {
          if (currentVal === item[key]) {
            selectedRowKeys.splice(index, 1)
            selectedRows.splice(i, 1)
            return true
          }
          return false
        })
      } else {
        selectedRowKeys.push(currentVal)
        selectedRows.push(row)
      }
    }
    this.setState({
      selectedRowKeys,
      selectedRows
    })
    this.submitSelectedRow(selectedRowKeys, selectedRows)
  }

  /**
   * 提供该接口，以供父组件可能需要用到表格选中的数据
   */
  submitSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    const { rowSelection, getSelectedRow } = this.props
    rowSelection && getSelectedRow && getSelectedRow(selectedRowKeys, selectedRows)
  }

  /**
   * 删除之后计算
   * @param num  删除了几条数据
   */
  removeLodingTable = (num?:number) => {
    const { pagination, dataSource } = this.state
    if (num) {
      const pageSize = dataSource.length - num
      const current:any = pagination.current
      if (pageSize === 0) {
        pagination.current = current > 1 ? current - 1 : current
      }
    }
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      pagination
    })
  }

  /**
   * 数据更新后调用，清空列表选中
   */
  clearRowSelect = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.loadingTableData()
  }

  /**
   * 删除表格数据之后调用该方法
   */
  deletedAndUpdateTableData = () => {
    this.$message.success('删除成功', 2)
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.loadingTableData()
  }

  render () {
    const { columns, state, props } = this
    const { onRow, scroll, rowKey, filterKey, rowSelection, rowSelectionFixed, rowSelectionType, bordered } = props
    const { dataSource, pagination, selectedRowKeys, isPagination } = state
    const hasData = dataSource.length > 0
    const setScroll = hasData ? scroll : scroll
    let isOnRow, isRowSelection
    // 设置点击当前行任意位置取消/选中行
    if (onRow && rowSelection) {
      isOnRow = (row: KeyValue) => {
        return {
          onClick: () => {
            this.selectedCurrentRow(row)
          }
        }
      }
    }
    // 设置第一列为多选
    if (rowSelection) {
      isRowSelection = {
        type: rowSelectionType,
        fixed: hasData && rowSelectionFixed,
        selectedRowKeys,
        onChange: async (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
          const rowList = [...this.state.selectedRows, ...selectedRows]
          const row = rowList.filter((item, i, arr) => {
            const { include } = ComUtil.inArray(item[filterKey!], selectedRowKeys)
            return include && arr.indexOf(item) === i && item
          })
          await this.setState({
            selectedRowKeys,
            selectedRows: row
          })
          this.submitSelectedRow(selectedRowKeys, selectedRows)
        },
        onSelect: (record:any, selected:any, selectedRows:any, nativeEvent:any) => {
          const { getRemoveSelect } = this.props
          if (getRemoveSelect) {
            getRemoveSelect(record, selected, selectedRows)
          }
        },
        onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
          const { getRemoveSelectAll } = this.props
          if (getRemoveSelectAll) {
            getRemoveSelectAll(selected, selectedRows, changeRows)
          }
        }
      }
    }
    return (
      <div className="table-content">
        <ConfigProvider renderEmpty={EmptyTable}>
          <Table<T>
            className={`table ${onRow && rowSelection ? 'select_row' : null}`}
            size="middle"
            onRow={isOnRow}
            rowSelection={isRowSelection}
            scroll={setScroll}
            rowKey={rowKey}
            columns={columns}
            bordered={bordered}
            // onGetData={onGetData}
            pagination={isPagination ? hasData ? pagination : false : false }
            dataSource={dataSource} />
        </ConfigProvider>
      </div>
    )
  }
}
