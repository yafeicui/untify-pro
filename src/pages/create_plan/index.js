import React, { Component } from 'react';
import { Steps } from 'antd';

import BasicInfo from './plan';
import NewScreen from './new_screen';
import UserOrient from './user_orient';
import PlanLocation from './location';
import Approval from './approval';

import './index.scss';
const Step = Steps.Step;
class CreatePlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1000,
      planId: '', //计划id
      fireworkId: 0, //弹屏id
      appId: '', //应用Id
      isEdit: false,
      originEdit: false,
      step: 0,
      readOnly: false,
      screen: false //如果为创建弹屏， 则为true
    };
  }
  componentDidMount() {
    let query = this.props.history.location.query || {};
    // console.log(query, '路由参数');
    this.setState({
      appId: query.appId,
      planId: query.id,
      originEdit: query.isEdit,
      isEdit: query.isEdit,
      current: 0,
      readOnly: query.readOnly,
      screen: query.screen
    });
  }
  next = num => {
    const current = this.state.current + 1;
    let isEdit = false;
    if (!this.originEdit && num < this.state.step) {
      isEdit = true;
    } else {
      isEdit = false;
    }
    if (this.state.originEdit) {
      isEdit = true;
    }
    this.setState({
      current,
      isEdit
    });
  };
  prev = num => {
    let step = num;
    const current = this.state.current - 1;
    if (step > this.state.step && !this.state.originEdit) {
      this.setState({
        current,
        isEdit: true,
        step: num
      });
    } else {
      this.setState({
        current,
        isEdit: true
      });
    }
  };
  // 创建弹屏时，planId为保存第一个弹屏时返回的planId
  changePlanId = planId => {
    this.setState({ planId });
  };
  // 创建计划时， 第一步计划基本信息时生成的planId, 然后进入下一步创建弹屏
  createplanId = planId => {
    this.setState({ planId }, () => {
      this.next(0);
    });
  };

  render() {
    // 创建计划比创建弹屏多  创建计划  这一步；
    const screenSteps = [
      {
        title: '创建弹屏',
        content: NewScreen
      },
      {
        title: '用户定向',
        content: UserOrient
      },
      {
        title: '位置',
        content: PlanLocation
      },
      {
        title: '审批',
        content: Approval
      }
    ];

    const { current } = this.state;
    let query = this.props.history.location.query || {};
    if (!query.screen) {
      screenSteps.unshift({ title: '创建计划', content: BasicInfo });
    }
    return (
      <div className="first-step">
        <div className="step-content">
          <Steps current={current}>
            {screenSteps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
        <div className="steps-contain">
          {screenSteps.map((ele, index) => {
            return index === current ? (
              <ele.content
                next={this.next}
                prev={this.prev}
                planId={this.state.planId}
                appId={this.state.appId}
                id={query.id}
                readOnly={this.state.readOnly}
                isEdit={this.state.isEdit}
                key={ele.title}
                changePlanId={
                  this.state.screen ? this.changePlanId : this.createplanId
                }
                screen={this.state.screen}
              />
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

export default CreatePlan;
