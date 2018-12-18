import React, { Component } from 'react';
import './index.scss';
import { Form, Icon, Input, Button, message, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { fetchRegister } from '@/http/http';

const FormItem = Form.Item;
const telPattern = /^(1[\d]{1}[\d]{9})$/;
const nameReg = /^[\u4E00-\u9FA5]{1,15}$/;

class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log(values, '表单数据');
      if (!err) {
        this.setState({ loading: true }, () => {
          fetchRegister(values)
            .then(() => {
              message.success('注册成功!');
              setTimeout(() => {
                this.props.history.push({
                  pathname: '/login'
                });
              }, 200);
            })
            .catch(() => {
              this.setState({
                loading: false
              });
            });
        });
      }
    });
  };
  validatePhone = (rule, value, callback) => {
    if (value && !telPattern.test(value)) {
      callback('请输入正确的手机号');
    } else {
      callback();
    }
  };
  validateName = (rule, value, callback) => {
    if (value && !nameReg.test(value)) {
      callback('请输入正确的中文名');
    } else {
      callback();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    };
    return (
      <div className="register-container">
        <Form className="register-form">
          <FormItem {...formItemLayout} label=" " colon={false}>
            <h5 className="title">统一弹屏系统</h5>
          </FormItem>
          <Spin spinning={this.state.loading}>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入用户名!' }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="用户名"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '请输入合法邮箱地址!'
                  },
                  {
                    required: true,
                    message: '请输入邮箱地址!'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="邮箱"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="中文名">
              {getFieldDecorator('disName', {
                rules: [
                  { required: true, message: '请输入中文名!' },
                  {
                    validator: this.validateName
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="中文名"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('phonenumber', {
                rules: [
                  { required: true, message: '请输入手机号!' },
                  {
                    validator: this.validatePhone
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="手机号"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="部门">
              {getFieldDecorator('department')(
                <Input
                  prefix={
                    <Icon type="cluster" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="部门"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="钉钉号">
              {getFieldDecorator('dingding')(
                <Input
                  prefix={
                    <Icon type="pushpin" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="钉钉号"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label=" " colon={false}>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                onClick={this.handleSubmit}
              >
                注册
              </Button>
              <Link className="fr" to="/login">
                前往登录
              </Link>
            </FormItem>
          </Spin>
        </Form>
      </div>
    );
  }
}
export default withRouter(Form.create()(register));
