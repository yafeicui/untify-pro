import React, { Component } from 'react';
import { Form, Checkbox, message, Modal } from 'antd';
import { approvalApply } from '@/http/http.js';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class Approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      disabled: false
    };
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
        this.setState({ disabled: true }, () => {
          approvalApply(data)
            .then(() => {
              message.success('提交成功');
              this.setState({
                visible: false
                // disabled: false
              });
              this.props.success();
            })
            .catch(() => {
              this.setState({
                disabled: false
              });
            });
        });
      }
    });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.handleCancel();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, userList, checkedUser } = this.props;
    return (
      <Modal
        title="提交审批"
        visible={visible}
        onOk={this.handleApproval}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: this.state.disabled }}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="审批人"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('users', {
              initialValue: checkedUser,
              rules: [{ required: true, message: '请选择审批人' }]
            })(
              <CheckboxGroup>
                {userList.map(ele => {
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
      </Modal>
    );
  }
}
export default Form.create()(Approval);
