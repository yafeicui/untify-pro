import React, { Component } from 'react'
import { Layout } from 'antd'
import './index.scss'
// 引入侧边栏
import MenuSider from '@/components/menu'
import ProHeader from '@/components/header'
import ProMain from '@/pages/index'
const { Sider, Content } = Layout

class MenuPage extends Component {
	state = {
		collapsed: false
	}
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		})
	}
	render() {
    return (
      <div className="outer-content">
        <Layout style={{ height: '100%' }}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">统一弹屏系统</div>
            <MenuSider />
          </Sider>
          <Layout>
            <ProHeader />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280, overflow: 'auto' }}>
              <ProMain />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
	}
}

export default MenuPage
