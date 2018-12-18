import React, { Component } from 'react';
import './index.scss';
import { Form, Checkbox, Button, message, Spin } from 'antd';
import {
  approvalApply,
  fetchApproval,
  fetchAppApprovalUsers
} from '@/http/http.js';
import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class Approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      loading: false
    };
  }
  componentDidMount() {
    let params = {
      appId: this.props.appId
    };
    this.setState({ loading: true }, () => {
      fetchAppApprovalUsers(params)
        .then(res => {
          this.setState(
            {
              userList: res.data || [],
              loading: false
            },
            () => {
              if (this.props.isEdit) {
                fetchApproval({ planId: this.props.planId }).then(res => {
                  let resp = res.data;
                  let users = [];
                  resp.forEach(ele => {
                    users.push(ele.id);
                  });
                  this.props.form.setFieldsValue({
                    users
                  });
                });
              }
            }
          );
        })
        .catch(() => {
          this.setState({
            userList: [],
            loading: false
          });
        });
    });
  }

  handleApproval = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          auditors: values.users,
          planId: this.props.planId,
          appId: this.props.appId
        };
        approvalApply(data).then(res => {
          message.success('提交成功');
          this.props.history.push({
            pathname: '/page/home'
          });
        });
      }
    });
  };
  handlePrevStep = () => {
    this.props.prev(4);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { readOnly } = this.props;
    return (
      <div className="basic-content">
        <div className="basci-title">提交审批</div>
        <Spin spinning={this.state.loading}>
          <div className="basci-contain approval-content">
            <Form>
              <FormItem
                label="审批人"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                {getFieldDecorator('users', {
                  rules: [{ required: true, message: '请选择审批人' }]
                })(
                  <CheckboxGroup disabled={readOnly}>
                    {this.state.userList.map(ele => {
                      return (
                        <Checkbox value={ele.id} key={ele.id}>
                          {ele.disName}
                        </Checkbox>
                      );
                    })}
                  </CheckboxGroup>
                )}
              </FormItem>
            </Form>

            {readOnly ? null : (
              <div className="next-button">
                <Button type="primary" onClick={this.handlePrevStep}>
                  上一步
                </Button>
                <Button
                  type="primary"
                  onClick={this.handleApproval}
                  disabled={readOnly}
                >
                  提交审批
                </Button>
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default withRouter(Form.create()(Approval));
