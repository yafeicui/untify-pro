import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './index.scss';
// 设置路由按需加载
import { asyncComponent } from '@/components/asyncComponent';

const Home = asyncComponent(() => import('../home'));
const CreatePlan = asyncComponent(() => import('../create_plan'));
const MangePutPage = asyncComponent(() => import('../mange_put_page'));
const ApproveManage = asyncComponent(() => import('../approve-manage'));
const Device = asyncComponent(() => import('../device'));
const AuthorManage = asyncComponent(() => import('../author_manage'));
// import Home from '../home'
// import CreatePlan from '../create_plan'
// import MangePutPage from '../mange_put_page'
// import ApproveManage from '../approve-manage'
// import Device from '../device'
// import AuthorManage from '../author_manage'

class PageMain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="con-box">
        <Switch>
          <Route path="/page/home" component={Home} />
          <Route path="/page/manage-put-page" component={MangePutPage} />
          <Route path="/page/device" component={Device} />
          <Route path="/page/approve-manage" component={ApproveManage} />
          <Route path="/page/create-plan" component={CreatePlan} />
          <Route path="/page/author-manage" component={AuthorManage} />
        </Switch>
      </div>
    );
  }
}
export default PageMain;
