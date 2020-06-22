/*
 * @Description: 广告管理-添加广告
 * @Author: qiuyang
 * @Date: 2019-08-26 11:24:53
 * @LastEditTime: 2019-09-18 11:48:51
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from 'components'
import { Form, Col, Row, Input } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/es/form'
import './index.less'
import { HttpUtil } from 'utils'

const { Item } = Form
const { TextArea } = Input

interface state {
  shopName:string
  dataSource: any
  detail: any[]
}

interface FormProps extends BaseProps,FormComponentProps{}

class AdvertisementInfo extends RootComponent<FormProps,state> {
  type:number = 1
  ids:number = 4
  advertisementTime:any = null 
  id: any = HttpUtil.parseUrl(this.props.location.search)
  constructor(props: FormProps){
      super(props)
      this.state={
        shopName:'',
        dataSource:{},
        detail:[]
      }
  }

  componentDidMount () {
    this.requestList()
  }

  requestList = () => {
    const { id } = this.id
    this.axios.request(this.api.getAdvertisementInfo, { id }).then(({data}) => {
      this.setState({
        dataSource: data,
        detail: JSON.parse(data.detail)
      })
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form
    const { dataSource, detail } = this.state
    return (
     <div className = 'ant-advertisementinfo'> 
        <Form className="ant-advertisementinfo-search-form">
          <Row>
            <Col span={5} className='ant-advertisementinfo-form'>
                <Item label="广告名称"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 3 }}
                  colon={true}>
                  { getFieldDecorator('advertName')(<div>{dataSource.title}</div>) }
                </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-advertisementinfo-form'>
                <Item label="广告位置"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}>
                  { getFieldDecorator('advertPosition')(
                      dataSource.type === 0?<span>小程序首页轮播</span>:<span>小程序门店页轮播</span>) }
                </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-advertisementinfo-form'>
                <Item label="轮播位选择"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}>
                  { getFieldDecorator('movecenterad')( 
                   <div>轮播位{dataSource.position}</div>)}
                </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-advertisementinfo-form'>
                <Item label="开始时间"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}>
                  { getFieldDecorator('startTime')( 
                     <div>{dataSource.startTime}</div>
                  )}
                </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} className='ant-advertisementinfo-form'>
                <Item label="到期时间"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                  colon={true}>
                  { getFieldDecorator('expireTime')( 
                      <div>{dataSource.expireTime}</div>
                  )}
                </Item>
            </Col>
          </Row>
          <Row>
              <Item label="广告图片"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator('advertImage')( 
                    <img src={dataSource.imagePathRe} className='ant-info-img'></img>
                )}
              </Item>
          </Row>
          <Row>
            { detail &&
            <Col className='ant-advertisementinfo-form'>
              <Item label="广告内容"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
                colon={true}>
                { getFieldDecorator(`advertLabel`,{
                  rules: [
                    {
                      required:true
                    }
                  ]
                })(<span>{ detail && detail.map((info: any, index: any) => (
                    <div key={index}>
                      <Row>
                        <Col span={8}>
                          { info.info &&
                          <TextArea disabled rows={7} defaultValue = {info.info} style={{backgroundColor:'#FFFFFF',width: '350px',color:'#666666'}}/>
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {info.imgPathRe && <img src={info.imgPathRe} className='ant-info-img-detail'></img>}
                        </Col>
                      </Row>
                    </div>
                ))}</span>)
                }
              </Item>
            </Col>
            }
          </Row>
        </Form>
    </div>
   )}
}
export default Form.create<FormProps>()(AdvertisementInfo)