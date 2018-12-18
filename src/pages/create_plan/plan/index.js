import React, { Component } from 'react';
import moment from 'moment';
import './index.scss';
import { Form, Input, Button, DatePicker, message, Spin } from 'antd';
import { createPlan, planBasicInfo, updatePlan } from '@/http/http.js';

const FormItem = Form.Item;
const { TextArea } = Input;

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  componentDidMount() {
    // console.log(this.props, '传入编辑')
    if (this.props.isEdit) {
      this.fetchSaveInfo();
      this.setState({
        loading: true
      });
    }
  }
  fetchSaveInfo = () => {
    planBasicInfo({ planId: this.props.planId })
      .then(res => {
        // console.log(res, '计划')
        let resp = res.data;
        this.props.form.setFieldsValue({
          name: resp.name,
          startAt: moment(resp.startAt),
          endAt: moment(resp.endAt),
          detail: resp.detail
        });
        this.setState({
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let startAt = moment(values.startAt._d).format('YYYY-MM-DD HH:mm:ss');
        let endAt = moment(values.endAt._d).format('YYYY-MM-DD HH:mm:ss');
        let oneDay = 24 * 60 * 60 * 1000;
        let gap = new Date(endAt).getTime() - new Date(startAt).getTime();
        if (endAt < startAt) {
          message.error('请正确选择起止日期');
          return;
        } else if (gap > oneDay * 30) {
          message.error('时间间隔不能大于30天');
          return;
        }
        let data = {
          appId: this.props.appId,
          name: values.name,
          detail: values.detail,
          startAt,
          endAt
        };
        if (this.props.isEdit) {
          data.id = this.props.planId;
          updatePlan(data).then(res => {
            this.props.next(0);
          });
        } else {
          createPlan(data).then(res => {
            this.props.changePlanId(res.data);
          });
        }
      }
    });
  };
  validFunction = (rule, value, callback) => {
    if (!value) {
      callback('请填写内容！');
    } else if (value.length > 230) {
      callback('内容长度不能超过230个字段'); // 校验未通过
    }
    callback(); // 校验通过
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { readOnly } = this.props;
    return (
      <div className="basic-content">
        <div className="basci-title">计划基本信息</div>
        <Spin spinning={this.state.loading}>
          <div className="basci-contain">
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label="名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: ' ' },
                    { validator: this.validFunction }
                  ]
                })(<Input disabled={readOnly} />)}
              </FormItem>
              <FormItem
                label="开始时间"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('startAt', {
                  rules: [{ required: true, message: '请选择时间' }]
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    placeholder="开始时间"
                    disabled={readOnly}
                    showToday={false}
                  />
                )}
              </FormItem>
              <FormItem
                label="结束时间"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('endAt', {
                  rules: [{ required: true, message: '请选择时间' }]
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    placeholder="结束时间"
                    disabled={readOnly}
                    showToday={false}
                  />
                )}
              </FormItem>
              <FormItem
                label="详情"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('detail', {
                  rules: [
                    { required: true, message: ' ' },
                    { validator: this.validFunction }
                  ]
                })(<TextArea rows={4} disabled={readOnly} />)}
              </FormItem>
              {readOnly ? null : (
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <div className="next-button">
                    <Button type="primary" htmlType="submit">
                      {' '}
                      下一步{' '}
                    </Button>
                  </div>
                </FormItem>
              )}
            </Form>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(BasicInfo);
