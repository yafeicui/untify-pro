import React, { Component } from 'react';
import QRModal from './qr-modal';
import './index.scss';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Radio,
  Upload,
  Icon,
  message,
  Popconfirm,
  Modal
} from 'antd';
import { transformOuterUrl } from '@/http/http';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
class ScreenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTransformDisabled: true, //验证跳转地址按钮
      qRCodeUrl: '',
      qrVisible: false
    };
  }
  componentDidMount() {
    let paramsProps = this.props.ele.formobj;
    if (paramsProps.fireworkName) {
      // console.log(paramsProps, '反显的表单');
      this.props.form.setFieldsValue(paramsProps);
      //调转类型为站内
      if (paramsProps.jumpType === 1) {
        // 有跳转地址， 将值赋值给qRCodeUrl，用于生成二维码,
        // 获取outerUrl的值， 需要转换截取"iting://open?msg_type=14&url="
        if (paramsProps.jumpUrl) {
          let outerUrl = '';
          let startStr = paramsProps.jumpUrl.substring(0, 29);
          // 手输入的iting://开头的没有type=14, 不需要转码，直接赋值即可
          startStr !== 'iting://open?msg_type=14&url='
            ? (outerUrl = paramsProps.jumpUrl)
            : (outerUrl = decodeURIComponent(
                decodeURI(paramsProps.jumpUrl)
              ).slice(29));
          this.props.form.setFieldsValue({
            outerUrl
          });
          this.setState({
            isTransformDisabled: false,
            qRCodeUrl: paramsProps.jumpUrl
          });
        } else {
          this.setState({
            isTransformDisabled: true
          });
        }
      }
    }
  }

  handleSaveScreen = index => {
    this.props.form.validateFields((err, values) => {
      // console.log(values, '表单');
      if (!err) {
        // 判断开始时间小于结束时间
        if (values.beginTime === 'a') {
          let startAt = values.fireworkStartAt._d.getTime();
          let endAt = values.fireworkEndAt._d.getTime();
          if (endAt < startAt) {
            message.error('请正确选择起止日期');
            return false;
          }
        }
        if (values.jumpType === 1) {
          if (!values.jumpUrl && values.outerUrl) {
            confirm({
              title: '请先点击验证跳转地址按钮, 查看转换后的跳转地址 ！',
              content: '',
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                this.encodeJumpUrl();
              }
            });
          } else {
            this.props.handleSaveScreen(values, index);
          }
        } else {
          this.props.handleSaveScreen(values, index);
        }
      }
    });
  };
  // 改变内容类型
  changeContentType = (val, index) => {
    this.props.changeContentType(val, index);
  };
  // 切换h5 上传或填写地址
  changeH5Upload = (val, index) => {
    this.props.changeH5Upload(val, index);
    let formParams = this.props.form.getFieldsValue();
    if (val.target.value === 1) {
      if (formParams.h5Url) {
        this.props.form.setFieldsValue({
          h5Url: ''
        });
      }
    } else {
      if (formParams.h5File) {
        this.props.form.setFieldsValue({
          h5File: ''
        });
      }
    }
  };
  // h5文件上传
  h5HandleChange = (file, index) => {
    if (file.file.size <= 2000000) {
      let { fileList } = file;
      fileList = fileList.slice(-1);
      this.props.h5HandleChange(fileList, index);
      if (file.file.response === '文件数据异常') {
        // 实际重置不了， 还找不出原因
        this.props.form.setFieldsValue({ h5File: '' });
        // console.log(this.props.form.getFieldsValue(), '表单');
      }
    } else {
      this.props.h5HandleChange(false, index);
    }
  };
  // 视频类型改变
  changeVideoType = (val, index) => {
    // console.log(val, index, '视频类型改变');
    this.props.changeVideoType(val, index);
  };
  // 图片上传之前大小校验
  pictureBeforeUpload = file => {
    let size = file.size;
    if (size > 500000) {
      message.error('图片大小不得超过500kb');
      return false;
    }
  };
  // 视频上传之前
  movieFileBeforeUpload = file => {
    let size = file.size;
    if (size > 2000000) {
      message.error('视频大小不得超过2M');
      return false;
    }
  };
  // 视频上传
  videoHandleChange = (files, index) => {
    // console.log(files, index, '视频上传');
    if (files.file.size <= 2000000) {
      let { fileList } = files;
      fileList = fileList.slice(-1);
      this.props.videoHandleChange(fileList, index);
    } else {
      this.props.videoHandleChange(false, index);
    }
  };
  // 视频背景图片
  videoBgPicChange = (files, index) => {
    let { fileList } = files;
    fileList = fileList.slice(-1);
    this.props.videoBgHandleChange(fileList, index);
  };
  // 视频预览图片上传
  videoPreviewPicChange = (files, index) => {
    let { fileList } = files;
    fileList = fileList.slice(-1);
    this.props.videoPreviewPicChange(fileList, index);
  };
  // 图片类型上传
  imageChange = (files, index) => {
    let { fileList } = files;
    fileList = fileList.slice(-1);
    this.props.imageChange(fileList, index);
  };
  onRemove = () => {
    return false;
  };
  // 改变跳转类型
  changeJumpType = (jumpType, index) => {
    this.props.form.setFieldsValue({
      jumpUrl: ''
    });
    this.props.changeJumpType(jumpType.target.value, index);

    this.setState({
      isTransformDisabled: true
    });
  };
  // 转化跳转地址
  encodeJumpUrl = () => {
    let formParams = this.props.form.getFieldsValue();
    let h5Url = encodeURI(formParams.outerUrl);
    transformOuterUrl({ h5Url }).then(res => {
      // console.log(res, '跳转地址');
      this.props.form.setFieldsValue({
        jumpUrl: res.data
      });
      // 生成二维码使用state的qRCodeUrl数据
      this.setState({
        qRCodeUrl: res.data,
        qrVisible: true
      });
    });
  };
  // 取消二维码弹框
  qrCancelModal = val => {
    let qRCodeUrl = this.state.qRCodeUrl;
    // 配置有误, 清空手输入的url链接和转换后的url
    if (!val) {
      this.props.form.setFieldsValue({
        jumpUrl: '',
        outerUrl: ''
      });
      qRCodeUrl = '';
    }
    this.setState({
      qrVisible: false,
      qRCodeUrl
    });
  };
  // 站外地址Input框发生改变
  outerUrlChange = e => {
    this.setState({
      isTransformDisabled: e.target.value === '' ? true : false
    });
  };
  validFunction = (rule, value, callback) => {
    if (!value) {
      callback('请填写内容！'); // 校验未通过
    } else if (value.length > 230) {
      callback('内容长度不能超过230个字段'); // 校验未通过
    }
    callback(); // 校验通过
  };
  validFunctionUrl = (rule, value, callback) => {
    if (!value) {
      callback(); // 校验通过
    } else if (value.length > 230) {
      callback('内容长度不能超过230个字段'); // 校验未通过
    }
    callback(); // 校验通过
  };
  jumpUrlRule = (rule, value, callback) => {
    let jumpTypeForm = this.props.form.getFieldsValue();
    if (!value) {
      callback(); // 校验通过
    } else if (value.length > 230) {
      callback('内容长度不能超过230个字段'); // 校验未通过
    }
    if (jumpTypeForm.jumpType === 1) {
      // 如果跳转类型为站内 ，跳转地址有值的情况下 站内跳转地址必须以iting://开头
      if (value) {
        let startStr = value.substring(0, 8);
        if (startStr !== 'iting://') {
          callback('站内跳转地址须以 iting:// 开头'); // 校验未通过
        }
      }
    }
    callback(); // 校验通过
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = { display: 'block', height: '39px', lineHeight: '39px' };
    const videoRadioStyle = {
      display: 'block',
      height: '39px',
      lineHeight: '39px',
      marginLeft: '30px'
    };
    const h5Props = {
      action: '/firework-backend/upload/file',
      data: {
        method: 'post'
      },
      multiple: false
    };
    const imageProps = {
      action: '/firework-backend/upload/image',
      accept: 'image/jpg,image/jpeg,image/gif,image/png,image/bmp',
      data: {
        method: 'post'
      },
      beforeUpload: this.pictureBeforeUpload,
      multiple: false
    };
    const videoFileProps = {
      action: '/firework-backend/upload/file',
      accept: 'video/mp4',
      data: {
        method: 'post'
      },
      beforeUpload: this.movieFileBeforeUpload,
      multiple: false
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let index = this.props.index;
    let ele = this.props.ele || {};
    let { readOnly } = this.props;
    return (
      <Form>
        <FormItem label="名称" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator(`fireworkName`, {
            rules: [
              { required: true, message: ' ' },
              { validator: this.validFunction }
            ]
          })(<Input disabled={readOnly} />)}
        </FormItem>
        {/* 第一个弹屏时  有效时间不能为相对时间 */}
        <FormItem
          label="有效时间"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator(`beginTime`, {
            rules: [{ required: true, message: '请选择时间' }]
          })(
            <RadioGroup
              onChange={value => this.props.changeTimeType(value, index)}
              disabled={readOnly}
            >
              <Radio value="a" style={radioStyle}>
                绝对时间
              </Radio>
              {ele.beginTimeValue === 'a' ? (
                <div>
                  <FormItem
                    label="开始时间"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator(`fireworkStartAt`, {
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
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator(`fireworkEndAt`, {
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
                </div>
              ) : null}
              <Radio value="b" style={radioStyle} disabled={index === 0}>
                相对时间
              </Radio>
              {ele.beginTimeValue === 'b' ? (
                <div>
                  <FormItem
                    label="距上一弹屏间隔(秒)"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator(`prevDelaySeconds`, {
                      rules: [{ required: true, message: '请选择时间' }]
                    })(
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        disabled={readOnly}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label="过期时间(秒)"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator(`expireSeconds`, {
                      rules: [{ required: true, message: '请选择时间' }]
                    })(
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        disabled={readOnly}
                      />
                    )}
                  </FormItem>
                </div>
              ) : null}
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          label="url回调地址"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator(`httpCheckCallback`, {
            rules: [
              { required: false, message: ' ' },
              { validator: this.validFunctionUrl }
            ]
          })(<Input disabled={readOnly} />)}
        </FormItem>

        <FormItem
          label="展示内容类型"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator(`contentType`, {
            rules: [{ required: true, message: '请选择展示内容类型' }]
          })(
            <RadioGroup
              onChange={val => this.changeContentType(val, index)}
              disabled={readOnly}
            >
              <Radio value={3} style={radioStyle}>
                h5
              </Radio>
              {ele.contentTypeValue === 3 ? (
                <RadioGroup
                  onChange={val => this.changeH5Upload(val, index)}
                  style={{ marginLeft: '30px' }}
                  value={ele.h5Type}
                  disabled={readOnly}
                >
                  <Radio value={1} style={radioStyle}>
                    h5离线包上传
                  </Radio>
                  {ele.h5Type === 1 ? (
                    <FormItem
                      label="文件"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator(`h5File`, {
                        rules: [{ required: true, message: '请上传文件' }]
                      })(
                        <Upload
                          {...h5Props}
                          fileList={ele.h5FileList}
                          defaultFileList={ele.h5FileList}
                          onChange={file => this.h5HandleChange(file, index)}
                          disabled={readOnly}
                          onRemove={this.onRemove}
                        >
                          <Button>
                            <Icon type="upload" /> 文件上传
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  ) : null}
                  <Radio value={2} style={radioStyle}>
                    h5在线地址
                  </Radio>
                  {ele.h5Type === 2 ? (
                    <FormItem
                      label="地址"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 16 }}
                    >
                      {getFieldDecorator(`h5Url`, {
                        rules: [{ required: true, message: '请填写在线地址' }]
                      })(<Input disabled={readOnly} />)}
                    </FormItem>
                  ) : null}
                </RadioGroup>
              ) : null}
              <Radio value={2} style={radioStyle}>
                视频
              </Radio>
              {ele.contentTypeValue === 2 ? (
                <RadioGroup
                  onChange={val => this.changeVideoType(val, index)}
                  disabled={readOnly}
                  value={ele.videoType}
                >
                  <Radio value={1} style={videoRadioStyle}>
                    视频上传
                  </Radio>
                  {ele.videoType === 1 ? (
                    <div className="video-cont">
                      <FormItem
                        label="视频文件"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator(`videoFile`, {
                          rules: [{ required: true, message: '请上传视频' }]
                        })(
                          <Upload
                            {...videoFileProps}
                            fileList={ele.videoFileList}
                            defaultFileList={ele.videoFileList}
                            onChange={file =>
                              this.videoHandleChange(file, index)
                            }
                            disabled={readOnly}
                            onRemove={this.onRemove}
                          >
                            <Button>
                              <Icon type="upload" /> 视频上传
                            </Button>
                          </Upload>
                        )}
                      </FormItem>
                      <FormItem
                        label="视频背景图片"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator(`videoFileBgPic`, {
                          rules: [
                            { required: true, message: '请上传视频背景图片' }
                          ]
                        })(
                          <Upload
                            className="avatar-uploader"
                            showUploadList={false}
                            {...imageProps}
                            onChange={file =>
                              this.videoBgPicChange(file, index)
                            }
                            disabled={readOnly}
                          >
                            {ele.videoBgPic ? (
                              <img src={ele.videoBgPic} alt="avatar" />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        )}
                      </FormItem>
                      <FormItem
                        label="视频预览图片"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator(`videoFilePreviewPic`, {
                          rules: [
                            { required: true, message: '请上传视频预览图片' }
                          ]
                        })(
                          <Upload
                            className="preview-img"
                            showUploadList={false}
                            {...imageProps}
                            onChange={file =>
                              this.videoPreviewPicChange(file, index)
                            }
                            disabled={readOnly}
                          >
                            {ele.videoPreviewPic ? (
                              <img src={ele.videoPreviewPic} alt="avatar" />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        )}
                      </FormItem>
                    </div>
                  ) : null}

                  <Radio value={2} style={videoRadioStyle}>
                    视频在线地址
                  </Radio>
                  {ele.videoType === 2 ? (
                    <div style={{ marginLeft: '30px' }} className="video-cont">
                      <FormItem
                        label="视频地址"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {getFieldDecorator(`videoUrl`, {
                          rules: [{ required: true, message: '请填写视频地址' }]
                        })(<Input disabled={readOnly} />)}
                      </FormItem>
                      <FormItem
                        label="视频背景图片"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator(`videoUrlBgPic`, {
                          rules: [
                            { required: true, message: '请上传视频背景图片' }
                          ]
                        })(
                          <Upload
                            className="avatar-uploader"
                            showUploadList={false}
                            {...imageProps}
                            onChange={file =>
                              this.videoBgPicChange(file, index)
                            }
                            disabled={readOnly}
                          >
                            {ele.videoBgPic ? (
                              <img src={ele.videoBgPic} alt="avatar" />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        )}
                      </FormItem>
                      <FormItem
                        label="视频预览图片"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator(`videoUrlPreviewPic`, {
                          rules: [
                            { required: true, message: '请上传视频预览图片' }
                          ]
                        })(
                          <Upload
                            className="preview-img"
                            showUploadList={false}
                            {...imageProps}
                            onChange={file =>
                              this.videoPreviewPicChange(file, index)
                            }
                            disabled={readOnly}
                          >
                            {ele.videoPreviewPic ? (
                              <img src={ele.videoPreviewPic} alt="avatar" />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        )}
                      </FormItem>
                    </div>
                  ) : null}
                  <div style={{ marginLeft: '30px' }} />
                </RadioGroup>
              ) : null}
              <Radio value={1} style={radioStyle}>
                图片
              </Radio>
              {ele.contentTypeValue === 1 ? (
                <div style={{ marginLeft: '30px' }}>
                  <FormItem
                    label="图片上传"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator(`imgUrl`, {
                      rules: [{ required: true, message: '请上传图片' }]
                    })(
                      <Upload
                        className="avatar-uploader"
                        showUploadList={false}
                        {...imageProps}
                        onChange={file => this.imageChange(file, index)}
                        disabled={readOnly}
                      >
                        {ele.imageUrl ? (
                          <img src={ele.imageUrl} alt="avatar" />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    )}
                  </FormItem>
                </div>
              ) : null}
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          label="跳转类型"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator(`jumpType`, {
            rules: [{ required: true, message: '请选择跳转类型' }]
          })(
            <RadioGroup
              disabled={readOnly}
              onChange={val => this.changeJumpType(val, index)}
            >
              <Radio value={1}>站内</Radio>
              <Radio value={2}>站外浏览器</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {/* 加 跳转类型为站内时添加转换跳转地址操作 */}
        {/* 跳转类型为站内时跳转地址可以不填， 如果填了要以   iting://  开头  */}
        {/* 跳转类型为站外浏览器时 跳转地址为必填  */}
        {ele.jumpTypeValue === 1 ? (
          <Row gutter={24}>
            <Col span="13">
              <FormItem
                label="跳转地址"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator(`outerUrl`)(
                  <Input
                    disabled={readOnly}
                    onChange={this.outerUrlChange}
                    placeholder="点击转换按钮生成跳转的站内地址"
                  />
                )}
              </FormItem>
            </Col>
            <Col span="5">
              <div className="transform-button">
                <Button
                  type="primary"
                  onClick={this.encodeJumpUrl}
                  disabled={this.state.isTransformDisabled}
                  className="qr-button"
                >
                  验证跳转地址
                </Button>
              </div>
            </Col>
          </Row>
        ) : null}

        <FormItem
          label="跳转地址"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          className={[
            this.props.form.getFieldsValue().jumpType === 1
              ? 'hiddenJumpUrl'
              : ''
          ].join(' ')}
        >
          {getFieldDecorator(`jumpUrl`, {
            rules: [
              { required: false, message: ' ' },
              { validator: this.jumpUrlRule }
            ]
          })(<Input disabled={readOnly} placeholder="点击弹屏，跳转的地址" />)}
        </FormItem>

        {readOnly ? null : (
          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <div className="save-button">
              <Button
                type="primary"
                onClick={() => this.handleSaveScreen(index)}
                disabled={readOnly}
                style={{ marginRight: '20px' }}
              >
                {' '}
                保存{' '}
              </Button>
              <Popconfirm
                title="确定删除此弹屏？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.props.handleDeleteScreen(index)}
              >
                <Button type="danger" disabled={readOnly}>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </FormItem>
        )}
        {this.state.qrVisible ? (
          <QRModal
            visible={this.state.qrVisible}
            qRCodeUrl={this.state.qRCodeUrl}
            cancelVisible={this.qrCancelModal}
          />
        ) : null}
      </Form>
    );
  }
}
export default Form.create()(ScreenForm);
