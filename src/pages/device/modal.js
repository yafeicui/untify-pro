import React, { Component } from 'react';

import { Button, Modal, Form, Input, InputNumber } from 'antd';

const FormItem = Form.Item;

class ModalLayer extends Component {
  onCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };
  render() {
    const { visible, onCreate, form, title, formData } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={title}
        okText="Create"
        onCancel={this.onCancel}
        onOk={onCreate}
        footer={[
          <Button key="submit" type="primary" onClick={onCreate}>
            提交
          </Button>
        ]}
      >
        <Form>
          <FormItem
            label="设备信息"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('deviceId', {
              initialValue: formData.deviceId,
              rules: [
                {
                  required: true,
                  message: '请输入设备信息'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            label="公司唯一机器码"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('serialNumber', {
              initialValue: formData.serialNumber
            })(<Input />)}
          </FormItem>
          <FormItem
            label="机型"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('model', {
              initialValue: formData.model
            })(<Input />)}
          </FormItem>
          <FormItem
            label="设备持有者"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('owner', {
              initialValue: formData.owner
            })(<Input />)}
          </FormItem>
          <FormItem
            label="用户id白名单"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('userId', {
              initialValue: formData.userId
            })(<InputNumber max={2147483647} style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModalLayer);
