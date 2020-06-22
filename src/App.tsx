/*
 * @description: 首页
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 14:56:38
 * @LastEditTime: 2020-04-14 15:54:07
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, Version, BreadCrumb } from 'components'
import { Layout, Menu, Spin } from 'antd'
import { inject, observer } from 'mobx-react'
import { createHashHistory } from 'history'

import Routes from './routes'

import 'assets/style/app'
import logo from 'assets/images/logo.png'
import refresh from 'assets/images/app/refresh.png'
import avatar from 'assets/images/app/avatar.png'
import home from 'assets/images/app/home.png'
import out from 'assets/images/app/out.png'

import { BaseProps } from 'typings/global'

const { SubMenu, Item } = Menu
const { Header, Content, Sider } = Layout
const history = createHashHistory()

interface BaseState {
  isRefresh: boolean
}

@inject('mobxGlobal', 'mobxTabs')
@observer
export default class Home extends RootComponent<BaseProps, BaseState> {
  constructor (props: BaseProps) {
    super(props)
    this.axios.cacheAxiosHeaderConfig()
    this.state = {
      isRefresh: false
    }
  }

  selectedTopMuneItem = ({ key }: any) => {
    const { filterSiderData } = this.props.mobxTabs
    const { path } = filterSiderData(key)
    history.push(path)
  }

  selectedSiderMuneItem = ({ key }: any) => {
    const { setActiveSiderRoute } = this.props.mobxTabs
    setActiveSiderRoute(key)
    history.push(key)
  }

  refreshCurrentPage = async () => {
    await this.setState({ isRefresh: true })
    setTimeout(() => {
      this.setState({ isRefresh: false })
    }, 200)
  }

  goAccount = () => history.replace('/home/account')

  goHome = () => history.replace('/home/panel')

  loginOut = () => {
    const { props: { mobxGlobal: { loginOut } } } = this
    loginOut()
    history.replace('/login')
  }

  render () {
    const {
      props: {
        mobxTabs: { activeTopRoute: { path, alias }, activeSiderRoute, activeRoute, topTabData, siderData, openKeys },
        mobxGlobal: { isLogin, admin: { userName } }
      },
      state: { isRefresh }
    } = this
    return (
      <div id="app_container">
        {!isLogin && <Routes {...this.props} />}
        {
          isLogin &&
          <Layout>
            <Header>
              <div className="logo">
                <img src={logo} alt=""/>全逸早餐
              </div>
              <Menu
                mode="horizontal"
                defaultSelectedKeys={['/home']}
                selectedKeys={[path]}
                onSelect={this.selectedTopMuneItem}>
                {topTabData.map(({ path, title }) => <Item key={path}>{title}</Item>)}
              </Menu>
              <ul className="account_wrapper">
                <li className="account_item" onClick={this.goAccount}>
                  <img src={avatar} alt=""/> { userName }
                </li>
                <li className="line"></li>
                <li className="account_item" onClick={this.goHome}>
                  <img src={home} alt=""/>
                </li>
                <li className="line"></li>
                <li className="account_item" onClick={this.loginOut}>
                  <img src={out} alt=""/>
                </li>
              </ul>
            </Header>
            <Layout>
              <Sider>
                <Menu
                  mode="inline"
                  defaultOpenKeys={openKeys}
                  selectedKeys={[activeSiderRoute.path]}
                  onSelect={this.selectedSiderMuneItem}
                  style={{ height: '100%', backgroundColor: '#EAEDF1' }}>
                  <SubMenu key={path} disabled title={alias}>
                    {siderData.map(({ path, title }) => <Menu.Item key={path} onClick={() => { history.replace(path) }}>{title}</Menu.Item>)}
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout className="app_wrapper">
                <BreadCrumb
                  activeRoute={activeRoute}
                  alias={alias}
                  refreshCurrentPage={this.refreshCurrentPage}
                  onBackParent={() => { history.goBack() }}
                />
                <Content className="app_content" style={{ background: '#F9F9F9' }}>
                  {!isRefresh && <Routes {...this.props} />}
                  <Spin
                    className="loadding_wrapper"
                    tip="刷新中..."
                    size="large"
                    spinning={isRefresh} />
                </Content>
              </Layout>
            </Layout>
          </Layout>
        }
        <Version color={isLogin ? '#c0c0c0' : '#fff'} />
      </div>
    )
  }
}
