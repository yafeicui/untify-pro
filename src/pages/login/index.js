import React, { Component } from 'react';
import './index.scss';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { fetchLogin } from '@/http/http';
import axios from 'axios';

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSumbit: true
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { canSumbit } = this.state;
    if (!canSumbit) return;
    this.setState({ canSumbit: false });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetchLogin(values)
          .then(res => {
            // console.log(res, '登陆');
            axios.defaults.headers.common['accessToken'] = res.token;
            message.success('登录成功!');
            this.setState({ canSumbit: true });
            localStorage.setItem('sideBar', JSON.stringify(res.sideBar));
            localStorage.setItem('screenUser', res.name);
            sessionStorage.setItem('isLogin', true);
            this.props.history.push({
              pathname: '/page/home'
            });
          })
          .catch(() => {
            this.setState({ canSumbit: true });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-container">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h5 className="title">统一弹屏系统</h5>
          <FormItem>
            {getFieldDecorator('username', {
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
          <FormItem>
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
          <FormItem>
            {/* <a className="login-form-forgot" href="">
							忘记密码？
						</a> */}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            <Link className="fr" to="/register">
              前往注册
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default withRouter(Form.create()(Login));
