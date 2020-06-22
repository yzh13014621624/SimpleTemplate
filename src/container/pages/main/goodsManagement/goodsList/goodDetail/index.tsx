/*
 * @description: 商品详情查看页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-26 15:39:59
 * @LastEditTime: 2020-04-07 18:44:43
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Row, Col } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import HttpUtil from 'utils/HttpUtil'
import { SearchHeader } from 'components/index'
import './index.less'

import { hot } from 'react-hot-loader'

interface FormProps extends BaseProps, FormComponentProps{}
interface ItemProps {
  title: string,
  text?: string,
  node?: any
}
class Item extends React.PureComponent<ItemProps> {
  render () {
    const { title, text, node } = this.props
    return (
      <Row className='item' type='flex'>
        <Col span={2} style={{ width: '90px' }}>
          <label>{title}：</label>
        </Col>
        <Col>
          {text && <label>{text}</label>}
          {node && node}
        </Col>
      </Row>
    )
  }
}

interface GoodsState {
  detail: any
}

@hot(module)
class GoodDetail extends RootComponent<FormProps, GoodsState> {
  constructor (props: FormProps) {
    super(props)
    this.state = {
      detail: {}
    }
  }

  componentDidMount () {
    const { id, shopId } = HttpUtil.parseUrl(this.props.location.search)
    const params = {
      goodsId: id,
      shopId: shopId
    }
    this.axios.request(this.api.getGoodsInfo, params).then(({ data }) => {
      this.setState({
        detail: data
      })
    })
  }

  /** 页面方法 */
  handleGoodsSize = (goodsSize: string) => {
    if (!goodsSize) {
      return ''
    }
    let renderSizeInfo = ''
    const sizeArray = goodsSize.split(';')
    sizeArray.forEach((element) => {
      const sizeItem = element.split(':')
      switch (sizeItem[0]) {
        case 'weight':
          renderSizeInfo += `长:${sizeItem[1]}cm`
          break
        case 'breadth':
          renderSizeInfo += `    宽:${sizeItem[1]}cm`
          break
        default:
          renderSizeInfo += `    高:${sizeItem[1]}cm`
      }
    })
    return renderSizeInfo
  }

  handleGoodsWeight = (goodsWeight: string) => {
    if (!goodsWeight) {
      return ''
    }
    let renderWeightInfo = ''
    const weightArray = goodsWeight.split(';')
    weightArray.forEach(element => {
      const weightItem = element.split(':')
      switch (weightItem[0]) {
        case 'net_weight':
          renderWeightInfo += `净重:${weightItem[1]}kg`
          break
        default:
          renderWeightInfo += `    毛重:${weightItem[1]}kg`
      }
    })
    return renderWeightInfo
  }

  handleGoodsBarCode = (barCode: any) => {
    if (!(barCode && barCode.length > 0)) {
      return ''
    }
    let renderBarCode = ''
    barCode.forEach((element: any, index: number) => {
      if (index !== 0) {
        renderBarCode += '、'
      }
      renderBarCode += element
    })
    return renderBarCode
  }

  handleMaterialInfo = (materialArray: any[]) => {
    if (!materialArray || materialArray.length === 0) {
      return '无需包材'
    }
    let renderString = ''
    materialArray.forEach((element, index) => {
      if (index !== 0) {
        renderString += '、'
      }
      renderString += element
    })
    return renderString
  }
  /** 页面事件 */

  render () {
    const { detail } = this.state
    const renderImgNodes = (imgList: any) => <div className='imgs-contain'>
      {
        imgList && imgList.length > 0 && imgList.map((item: any, index: any) => {
          return <img className='goods-img' src={item} key={`img${index}`} alt='' />
        })
      }
    </div>

    const renderStoreList = (shopsList: any) => <div className='shop-contain'>
      {
        shopsList && shopsList.length > 0 && shopsList.map((item: any, index: any) => {
          return <div className='shop-item' key={`name${index}`}>{item}</div>
        })
      }
    </div>

    const { shopId } = HttpUtil.parseUrl(this.props.location.search)

    return (
      <React.Fragment>
        <SearchHeader title='基础信息'>
          <div className='info-cont'>
            <Item title='商品类型' text={detail.goodsType} />
            <Item title='商品类目' text={detail.goodsCategory} />
            <Item title='商品名称' text={detail.goodsTitle} />
            <Item title='商品图片' node={renderImgNodes(detail.goodsImgList)} />
            <Item title='商品单位' text={detail.goodsUnit} />
            <Item title='储存类型' text={detail.storageType} />
            <Item title='经营属性' text={detail.manageProperty} />
            <Item title='长宽高' text={this.handleGoodsSize(detail.goodsSize)} />
            <Item title='规格' text={detail.spec} />
            <Item title='重量' text={this.handleGoodsWeight(detail.goodsWeight)} />
            <Item title='商品所属部门' text={detail.department} />
            <Item title='商品标签' text={detail.goodsLabels} />
          </div>
        </SearchHeader>
        <SearchHeader title='商品条码信息'>
          <div className='info-cont'>
            <Item title='商品编码' text={detail.goodsCode} />
            <Item title='商品自编码' text={detail.ownCode} />
            <Item title='商品条码' text={this.handleGoodsBarCode(detail.goodsBarCode)} />
            <Item title='商品二维码' node={renderImgNodes([detail.qrImage])} />
          </div>
        </SearchHeader>
        <SearchHeader title='商品价格'>
          <div className='info-cont'>
            <Item title='销售价' text={`￥${detail.goodsPrice}`} />
            <Item title='采购价' text={`￥${detail.purchasePrice}`} />
          </div>
        </SearchHeader>
        <SearchHeader title='客户信息'>
          <div className='info-cont'>
            <Item title='所属客户' text={detail.customer} />
            <Item title='供应商' text={detail.supplier} />
          </div>
        </SearchHeader>
        {
          detail.goodsType === '标准商品' &&
          <SearchHeader title='包材信息'>
            <div className='info-cont'>
              <Item title='外带包材' text={this.handleMaterialInfo(detail.attachWdList)} />
              <Item title='堂吃包材' text={this.handleMaterialInfo(detail.attachTcList)} />
            </div>
          </SearchHeader>
        }
        <SearchHeader title='商品详情'>
          <div className='info-cont'>
            {detail.des}
          </div>
        </SearchHeader>
        {
          detail.goodsType === '标准商品' &&
          <SearchHeader title='销售门店'>
            <div className='info-cont'>
              <Item title='所选店铺' node={renderStoreList(detail.shops)} />
            </div>
          </SearchHeader>
        }
        {
          shopId &&
          <SearchHeader title='库存信息'>
            <Item title='库存' text={detail.goodsStore} />
          </SearchHeader>
        }
      </React.Fragment>
    )
  }
}

export default Form.create<FormProps>()(GoodDetail)
