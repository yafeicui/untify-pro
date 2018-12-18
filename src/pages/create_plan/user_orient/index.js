import React, { Component } from 'react';
import './index.scss';
import { Form, Input, Button, Row, Col, Checkbox, Spin } from 'antd';
import {
  saveUserOrient,
  fetchUserOrient,
  fetchUserOrientInfo
} from '@/http/http.js';
import { relative } from 'path';

const FormItem = Form.Item;

class UserOrient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPlatform: false,
      isShowChannel: false,
      isShowLaunch: false,
      isShowUserNet: false,
      isShowDevice: false,

      putCrowdList: [],
      userNetList: [],
      platType: [],
      loading: false
    };
  }
  componentDidMount() {
    // console.log(this.props, '用户定向')
    this.setState({
      planId: this.props.planId
    });
    Promise.all([
      fetchUserOrient({ orientType: 62 }),
      fetchUserOrient({ orientType: 31 })
    ]).then(res => {
      let powList = res[0].data || [];
      let arr = [];
      if (powList.length) {
        //去除全部选项
        powList.forEach(ele => {
          let obj = {};
          if (ele.name !== 'all') {
            obj.value = ele.name;
            obj.label = ele.desc;
            arr.push(obj);
          }
        });
      }
      if (res[1].data.length) {
        res[1].data.forEach(ele => {
          ele.value = ele.name;
          ele.label = ele.desc;
        });
      }
      this.setState({
        putCrowdList: arr,
        userNetList: res[1].data || []
      });
      if (this.props.isEdit) {
        this.fetchSaveInfo();
        this.setState({
          loading: true
        });
      }
    });
  }
  fetchSaveInfo = () => {
    fetchUserOrientInfo({ planId: this.props.planId })
      .then(res => {
        let resp = res.data;
        if (resp.platform) {
          let platFormArr = resp.platform.split(',');
          this.setState(
            {
              isShowPlatform: true,
              platType: platFormArr
            },
            () => {
              if (platFormArr.indexOf('ios') !== -1) {
                //投放平台反显
                this.props.form.setFieldsValue({
                  platform: platFormArr,
                  iosPutMinVersion: resp.iosPutMinVersion,
                  iosPutMaxVersion: resp.iosPutMaxVersion
                });
              }
              if (platFormArr.indexOf('android') !== -1) {
                this.props.form.setFieldsValue({
                  platform: platFormArr,
                  androidPutMinVersion: resp.androidPutMinVersion,
                  androidPutMaxVersion: resp.androidPutMaxVersion
                });
              }
            }
          );
        }
        if (resp.putCrowd) {
          //投放群体
          let crowdArr = resp.putCrowd.split(',');
          this.setState(
            {
              isShowLaunch: true
            },
            () => {
              this.props.form.setFieldsValue({
                putCrowd: crowdArr
              });
            }
          );
        }
        if (resp.putNetworkType) {
          //用户网络
          this.setState(
            {
              isShowUserNet: true
            },
            () => {
              let workTypeArr = resp.putNetworkType.split(',');
              this.props.form.setFieldsValue({
                putNetworkType: workTypeArr
              });
            }
          );
        }
        if (resp.putCanalText) {
          //渠道
          this.setState(
            {
              isShowChannel: true
            },
            () => {
              this.props.form.setFieldsValue({
                putCanalText: resp.putCanalText
              });
            }
          );
        }
        if (resp.putDeviceUrl) {
          //投放设备
          this.setState(
            {
              isShowDevice: true
            },
            () => {
              this.props.form.setFieldsValue({
                putDeviceUrl: resp.putDeviceUrl
              });
            }
          );
        }
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
      // console.log(values, '提交表单')
      if (!err) {
        let platform = '';
        let putCrowd = '';
        let putNetworkType = '';

        values.platform
          ? values.platform.map((ele, index) => {
              return index === values.platform.length - 1
                ? (platform += ele)
                : (platform += ele + ',');
            })
          : null;
        values.putCrowd
          ? values.putCrowd.map((ele, index) => {
              return index === values.putCrowd.length - 1
                ? (putCrowd += ele)
                : (putCrowd += ele + ',');
            })
          : null;
        values.putNetworkType
          ? values.putNetworkType.map((ele, index) => {
              return index === values.putNetworkType.length - 1
                ? (putNetworkType += ele)
                : (putNetworkType += ele + ',');
            })
          : null;
        let data = {
          planId: this.state.planId,
          platform,
          putCrowd,
          putNetworkType,
          putCanalText: values.putCanalText, //渠道
          putDeviceUrl: values.putDeviceUrl
        };
        if (values.platform) {
          if (values.platform.indexOf('ios') !== -1) {
            data.iosPutMinVersion = values.iosPutMinVersion;
            data.iosPutMaxVersion = values.iosPutMaxVersion;
          }
          if (values.platform.indexOf('android') !== -1) {
            data.androidPutMinVersion = values.androidPutMinVersion;
            data.androidPutMaxVersion = values.androidPutMaxVersion;
          }
        }
        if (this.props.isEdit) data.planId = this.props.planId;
        saveUserOrient(data).then(res => {
          this.props.next(2);
        });
      }
    });
  };

  changePlat = val => {
    if (!this.props.readOnly) this.setState({ platType: val });
  };
  showPlatForm = val => {
    if (!this.props.readOnly) this.setState({ isShowPlatform: val });
  };
  showChannel = val => {
    if (!this.props.readOnly) this.setState({ isShowChannel: val });
  };
  showLaunch = val => {
    if (!this.props.readOnly) this.setState({ isShowLaunch: val });
  };
  showUserNet = val => {
    if (!this.props.readOnly) this.setState({ isShowUserNet: val });
  };
  showDevice = val => {
    if (!this.props.readOnly) this.setState({ isShowDevice: val });
  };
  handlePrev = () => {
    this.props.prev(2);
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
    const checkStyle = {
      display: 'block',
      height: '39px',
      lineHeight: '39px',
      margin: '0px'
    };
    const platStyle = { position: relative, margin: '-5px 0 10px 0' };
    const { readOnly } = this.props;
    return (
      <div className="basic-content">
        <div className="basci-title">指定用户id列表</div>
        <Spin spinning={this.state.loading}>
          <div className="basci-contain orient-content">
            <div className="orient-left">
              <div className="button-style">用户筛选项</div>
              <Button
                type="primary"
                className="button-style"
                onClick={() => this.showPlatForm(true)}
              >
                投放平台
              </Button>
              <Button
                type="primary"
                className="button-style"
                onClick={() => this.showChannel(true)}
              >
                渠道
              </Button>
              <Button
                type="primary"
                className="button-style"
                onClick={() => this.showLaunch(true)}
              >
                投放群体
              </Button>
              <Button
                type="primary"
                className="button-style"
                onClick={() => this.showUserNet(true)}
              >
                用户网络
              </Button>
              <Button
                type="primary"
                className="button-style"
                onClick={() => this.showDevice(true)}
              >
                投放设备
              </Button>
              <div className="desc-content">
                不点选用户筛选项默认投放给所有用户
              </div>
            </div>
            <div className="orient-form">
              <Form onSubmit={this.handleSubmit}>
                {this.state.isShowPlatform ? (
                  <Row gutter={24}>
                    <Col span="20">
                      <FormItem
                        label="投放平台"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                      >
                        {getFieldDecorator('platform', {
                          rules: [{ required: true, message: '请选择投放平台' }]
                        })(
                          <Checkbox.Group
                            style={{ width: '100%' }}
                            onChange={this.changePlat}
                            disabled={readOnly}
                          >
                            <Checkbox value="android" style={checkStyle}>
                              android
                            </Checkbox>
                            {this.state.platType.indexOf('android') !== -1 ? (
                              <div style={platStyle}>
                                <Row gutter={24}>
                                  <Col span="12">
                                    <FormItem
                                      label="最小版本"
                                      labelCol={{ span: 10 }}
                                      wrapperCol={{ span: 12 }}
                                    >
                                      {getFieldDecorator(
                                        'androidPutMinVersion',
                                        {
                                          rules: [
                                            {
                                              required: true,
                                              message: '请填写版本'
                                            }
                                          ]
                                        }
                                      )(<Input disabled={readOnly} />)}
                                    </FormItem>
                                  </Col>
                                  <Col span="12">
                                    <FormItem
                                      label="最大版本"
                                      labelCol={{ span: 10 }}
                                      wrapperCol={{ span: 12 }}
                                    >
                                      {getFieldDecorator(
                                        'androidPutMaxVersion',
                                        {
                                          rules: [
                                            {
                                              required: true,
                                              message: '请填写版本'
                                            }
                                          ]
                                        }
                                      )(<Input disabled={readOnly} />)}
                                    </FormItem>
                                  </Col>
                                </Row>
                              </div>
                            ) : null}
                            <Checkbox value="ios" style={checkStyle}>
                              ios
                            </Checkbox>
                            {this.state.platType.indexOf('ios') !== -1 ? (
                              <div style={platStyle}>
                                <Row gutter={24}>
                                  <Col span="12">
                                    <FormItem
                                      label="最小版本"
                                      labelCol={{ span: 10 }}
                                      wrapperCol={{ span: 12 }}
                                    >
                                      {getFieldDecorator('iosPutMinVersion', {
                                        rules: [
                                          {
                                            required: true,
                                            message: '请填写版本'
                                          }
                                        ]
                                      })(<Input disabled={readOnly} />)}
                                    </FormItem>
                                  </Col>
                                  <Col span="12">
                                    <FormItem
                                      label="最大版本"
                                      labelCol={{ span: 10 }}
                                      wrapperCol={{ span: 12 }}
                                    >
                                      {getFieldDecorator('iosPutMaxVersion', {
                                        rules: [
                                          {
                                            required: true,
                                            message: '请填写版本'
                                          }
                                        ]
                                      })(<Input disabled={readOnly} />)}
                                    </FormItem>
                                  </Col>
                                </Row>
                              </div>
                            ) : null}
                          </Checkbox.Group>
                        )}
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <div
                        style={checkStyle}
                        className="delete-button"
                        onClick={() => this.showPlatForm(false)}
                      >
                        X
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {this.state.isShowChannel ? (
                  <Row gutter={24}>
                    <Col span="20">
                      <FormItem
                        label="渠道"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                      >
                        {getFieldDecorator('putCanalText', {
                          rules: [
                            { required: true, message: ' ' },
                            { validator: this.validFunction }
                          ]
                        })(<Input disabled={readOnly} />)}
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <div
                        style={checkStyle}
                        className="delete-button"
                        onClick={() => this.showChannel(false)}
                      >
                        X
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {/* 投放群体 */}
                {this.state.isShowLaunch ? (
                  <Row gutter={24}>
                    <Col span="20">
                      <FormItem
                        label="投放群体"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                      >
                        {getFieldDecorator('putCrowd', {
                          rules: [{ required: true, message: '请选择投放群体' }]
                        })(
                          <Checkbox.Group
                            options={this.state.putCrowdList}
                            disabled={readOnly}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <div
                        style={checkStyle}
                        className="delete-button"
                        onClick={() => this.showLaunch(false)}
                      >
                        X
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {/* 用户网络 */}
                {this.state.isShowUserNet ? (
                  <Row gutter={24}>
                    <Col span="20">
                      <FormItem
                        label="用户网络"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                      >
                        {getFieldDecorator('putNetworkType', {
                          rules: [{ required: true, message: '请选择用户网络' }]
                        })(
                          <Checkbox.Group
                            options={this.state.userNetList}
                            disabled={readOnly}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <div
                        style={checkStyle}
                        className="delete-button"
                        onClick={() => this.showUserNet(false)}
                      >
                        X
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {this.state.isShowDevice ? (
                  <Row gutter={24}>
                    <Col span="20">
                      <FormItem
                        label="投放设备"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                      >
                        {getFieldDecorator('putDeviceUrl', {
                          rules: [
                            { required: true, message: ' ' },
                            { validator: this.validFunction }
                          ]
                        })(<Input disabled={readOnly} />)}
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <div
                        style={checkStyle}
                        className="delete-button"
                        onClick={() => this.showDevice(false)}
                      >
                        X
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {readOnly ? null : (
                  <FormItem wrapperCol={{ span: 16, offset: 4 }}>
                    <div className="next-button">
                      <Button type="primary" onClick={this.handlePrev}>
                        {' '}
                        上一步{' '}
                      </Button>
                      <Button type="primary" htmlType="submit">
                        {' '}
                        下一步{' '}
                      </Button>
                    </div>
                  </FormItem>
                )}
              </Form>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(UserOrient);
