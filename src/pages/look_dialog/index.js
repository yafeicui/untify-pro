import React, { Component } from 'react';
import { Modal } from 'antd';
import BasicInfo from '../create_plan/plan';
import NewScreen from '../create_plan/new_screen';
import UserOrient from '../create_plan/user_orient';
import PlanLocation from '../create_plan/location';
import Approval from '../create_plan/approval';
import ApprovalProgress from '../progress';

import { fetchProgress } from '@/http/approve_manage';

class LookDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noProgress: false,
      steps: [], // 审批进度
      loading: true
    };
  }
  componentDidMount = () => {
    this.init();
  };
  init = () => {
    fetchProgress({ planId: this.props.planId })
      .then(res => {
        // console.log(res, '进度页面');
        this.setState({
          noProgress: res.data.length ? false : true,
          steps: res.data,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          steps: [],
          noProgress: true,
          loading: false
        });
      });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };
  render() {
    const { visible, appId, isEdit, planId, readOnly, screen } = this.props;
    let componentArr = [
      { name: BasicInfo, key: 0 },
      { name: NewScreen, key: 1 },
      { name: UserOrient, key: 2 },
      { name: PlanLocation, key: 3 },
      { name: Approval, key: 4 },
      { name: ApprovalProgress, key: 5 }
    ];
    // console.log(this.props, '是否是弹屏');
    if (screen) componentArr.shift();
    // 如果没提交审批， 则没有审批进度页面
    if (this.state.noProgress) componentArr.pop();
    return (
      <Modal
        title="查看计划"
        visible={visible}
        onCancel={this.handleCancel}
        footer={null}
        width="70%"
        destroyOnClose={true}
      >
        {componentArr.map(ele => {
          return (
            <ele.name
              planId={planId}
              appId={appId}
              isEdit={isEdit}
              readOnly={readOnly}
              key={ele.key}
              stepsItem={this.state.steps}
              progressLoading={this.state.loading}
            />
          );
        })}
      </Modal>
    );
  }
}
export default LookDialog;
