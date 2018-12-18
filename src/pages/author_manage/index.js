import React, { Component } from 'react';
import './index.scss';
import PowerManager from './power-page';
import LocationManager from './power-page';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class AuthorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1'
    };
  }
  callback = activeTab => {
    this.setState({
      activeTab
    });
  };
  componentDidMount() {}
  render() {
    return (
      <Tabs defaultActiveKey={this.state.activeTab} onChange={this.callback}>
        <TabPane tab="权限管理" key="1">
          {this.state.activeTab === '1' ? <PowerManager pageKey={1} /> : null}
        </TabPane>
        <TabPane tab="位置管理" key="2">
          {this.state.activeTab === '2' ? (
            <LocationManager pageKey={2} />
          ) : null}
        </TabPane>
      </Tabs>
    );
  }
}
export default AuthorManage;
