import React, { Component } from 'react';
import './index.scss';
import { Form, Button, Collapse, message, Spin } from 'antd';
import moment from 'moment';
import {
  saveNewScreen,
  fetchScreenInfo,
  updateScreenInfo,
  deleteScreen,
  updateScreenId
} from '@/http/http.js';
import ScreenForm from './form.js';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
class NewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couldAdd: false, //是否可以点击新增弹屏
      couldNext: false, //是否可以下一步
      screenList: [
        {
          beginTimeValue: '',
          contentTypeValue: '',
          h5Type: '',
          h5FileList: [], //h5文件
          videoFileList: [], //视频
          imageUrl: '', //图片
          prevFireworkId: '',
          formobj: {},
          id: '',
          videoBgPic: '', //视频背景图片
          videoPreviewPic: '', // 视频预览图片
          videoType: '',
          jumpTypeValue: ''
        }
      ],
      planId: '',
      id: '',
      loading: false
    };
  }
  componentDidMount() {
    // console.log(this.props, '新弹屏');
    if (this.props.isEdit) {
      this.fetchSaveInfo(this.props.planId);
      this.setState({
        couldAdd: true,
        couldNext: true,
        loading: true
      });
    }
  }
  // 查询保存的数据
  fetchSaveInfo(planId) {
    fetchScreenInfo({ planId })
      .then(res => {
        // console.log(res, '反显的数据');
        let saveInfo = res.data || [];
        if (saveInfo.length) {
          this.setState({ screenList: [] }, () => {
            let screenList = [];
            saveInfo.forEach((ele, index) => {
              screenList[index] = {
                beginTimeValue: '',
                contentTypeValue: '',
                h5Type: '',
                h5FileList: [],
                videoFileList: [], //视频
                imageUrl: '',
                prevFireworkId: '',
                formobj: {},
                id: '',
                videoBgPic: '',
                videoPreviewPic: '',
                videoType: '',
                jumpTypeValue: 1
              };
              screenList[index].prevFireworkId = ele.prevFireworkId;
              screenList[index].name = ele.name;
              screenList[index].id = ele.id;
              if (ele.prevDelaySeconds || ele.prevDelaySeconds === 0) {
                //开始时间
                screenList[index].beginTimeValue = 'b';
              } else {
                screenList[index].beginTimeValue = 'a';
              }
              // 跳转类型
              if (ele.jumpType === 2) {
                screenList[index].jumpTypeValue = 2;
              }
              if (ele.contentType === 1) {
                screenList[index].contentTypeValue = 1;
                screenList[index].imageUrl = ele.payloadUrl;
              } else if (ele.contentType === 2) {
                screenList[index].contentTypeValue = 2;
                screenList[index].videoBgPic = ele.videoPicUrl; //视频背景图片
                screenList[index].videoPreviewPic = ele.videoPreviewPicUrl; //视频预览图片
                if (ele.videoType === 1) {
                  //为视频上传
                  screenList[index].videoType = 1;
                  screenList[index].videoFileList = [
                    {
                      name: ele.fileName,
                      status: 'done',
                      url: ele.payloadUrl,
                      uid: index + 1000
                    }
                  ];
                } else if (ele.videoType === 2) {
                  screenList[index].videoType = 2;
                }
              } else {
                screenList[index].contentTypeValue = 3;
                if (ele.h5Type === 1) {
                  screenList[index].h5Type = 1;
                  screenList[index].h5FileList = [
                    {
                      name: ele.fileName,
                      status: 'done',
                      url: ele.payloadUrl,
                      uid: index + 100
                    }
                  ];
                } else {
                  screenList[index].h5Type = 2;
                }
              }
              // 表单数据
              let formobj = {};
              if (ele.prevDelaySeconds || ele.prevDelaySeconds === 0) {
                //开始时间
                formobj.beginTime = 'b';
                formobj.prevDelaySeconds = ele.prevDelaySeconds;
                formobj.expireSeconds = ele.expireSeconds;
              } else {
                formobj.beginTime = 'a';
                formobj.fireworkStartAt = moment(ele.startAt);
                formobj.fireworkEndAt = moment(ele.fireworkEndAt);
              }
              if (ele.contentType === 1) {
                formobj.imgUrl = {
                  file: {
                    response: {
                      imageUrl: ele.payloadUrl,
                      fileMd5: ele.payloadMd5
                    }
                  }
                };
              } else if (ele.contentType === 2) {
                if (ele.videoType === 1) {
                  formobj.videoFile = {
                    file: {
                      response: {
                        fileUrl: ele.payloadUrl,
                        fileMd5: ele.payloadMd5
                      },
                      name: ele.fileName
                    }
                  };
                  formobj.videoFileBgPic = {
                    file: {
                      response: {
                        imageUrl: ele.videoPicUrl,
                        fileMd5: ele.videoPicMd5
                      }
                    }
                  };
                  formobj.videoFilePreviewPic = {
                    file: {
                      response: {
                        imageUrl: ele.videoPreviewPicUrl,
                        fileMd5: ele.videoPreviewPicMd5
                      }
                    }
                  };
                } else {
                  formobj.videoUrl = ele.payloadUrl;
                  formobj.videoUrlBgPic = {
                    file: {
                      response: {
                        imageUrl: ele.videoPicUrl,
                        fileMd5: ele.videoPicMd5
                      }
                    }
                  };
                  formobj.videoUrlPreviewPic = {
                    file: {
                      response: {
                        imageUrl: ele.videoPreviewPicUrl,
                        fileMd5: ele.videoPreviewPicMd5
                      }
                    }
                  };
                }
              } else {
                if (ele.h5Type === 1) {
                  formobj.h5File = {
                    file: {
                      response: {
                        fileUrl: ele.payloadUrl,
                        fileMd5: ele.payloadMd5
                      },
                      name: ele.fileName
                    }
                  };
                } else {
                  formobj.h5Url = ele.payloadUrl;
                }
              }
              formobj.fireworkName = ele.name;
              formobj.httpCheckCallback = ele.httpCheckCallback;
              formobj.jumpType = ele.jumpType;
              formobj.jumpUrl = ele.jumpUrl;
              formobj.contentType = ele.contentType;
              screenList[index].formobj = formobj;
            });
            this.setState({
              screenList
            });
          });
        } else {
          let screenList = [
            {
              beginTimeValue: '',
              contentTypeValue: '',
              h5Type: '',
              h5FileList: [],
              videoFileList: [], //视频
              imageUrl: '',
              prevFireworkId: '',
              formobj: {},
              id: '',
              videoBgPic: '',
              videoPreviewPic: '',
              jumpTypeValue: ''
            }
          ];
          let formobj = {};
          formobj.name = '';
          formobj.beginTime = '';
          formobj.jumpUrl = '';
          formobj.jumpType = '';
          formobj.contentType = '';
          screenList[0].formobj = formobj;
          this.setState({
            screenList
          });
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
  }
  // 点击新增按钮添加新弹屏
  handleAddNewScreen = () => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList.push({
      beginTimeValue: '',
      contentTypeValue: '',
      h5Type: '',
      h5FileList: [], //h5文件
      videoFileList: [], //视频
      imageUrl: '', //图片
      prevFireworkId: '',
      formobj: {},
      id: '',
      videoBgPic: '', //视频背景图片
      videoPreviewPic: '', // 视频预览图片
      videoType: '',
      jumpTypeValue: ''
    });
    this.setState({
      screenList,
      couldAdd: false
    });
  };
  // 保存弹屏
  handleSaveScreen = (values, index) => {
    // console.log(this.state.screenList, '弹屏数据');
    let screenIndex = this.state.screenList[index];
    if (
      (screenIndex.contentTypeValue === 2 && screenIndex.videoType === '') ||
      (screenIndex.contentTypeValue === 3 && screenIndex.h5Type === '')
    ) {
      message.error('请将表单填写完整');
      return false;
    }
    if (values.jumpType === 1 && values.jumpUrl) {
      let startStr = values.jumpUrl.substring(0, 8);
      if (startStr !== 'iting://') {
        message.error('站内跳转地址须以 iting:// 开头'); // 校验未通过
        return false;
      }
    }
    // 图片
    if (screenIndex.contentTypeValue === 1) {
      if (!screenIndex.imageUrl) {
        message.error('请上传图片');
        return false;
      }
    }
    if (screenIndex.contentTypeValue === 2) {
      if (!screenIndex.videoPreviewPic || !screenIndex.videoBgPic) {
        message.error('请上传图片');
        return false;
      }
      if (screenIndex.videoType === 1 && !screenIndex.videoFileList[0]) {
        //视频上传
        message.error('请上传视频');
        return false;
      }
    }
    let data = {
      fireworkName: values.fireworkName, //名称
      httpCheckCallback: values.httpCheckCallback, //回掉地址
      contentType: values.contentType, //跳转类型
      jumpUrl: values.jumpUrl, //跳转url
      jumpType: values.jumpType //跳转类型
    };

    if (values.beginTime === 'a') {
      data.fireworkStartAt = moment(values.fireworkStartAt._d).format(
        'YYYY-MM-DD HH:mm:ss'
      ); //绝对时间的开始时间
      data.fireworkEndAt = moment(values.fireworkEndAt._d).format(
        'YYYY-MM-DD HH:mm:ss'
      ); //绝对时间的结束时间
    } else {
      data.expireSeconds = values.expireSeconds; //相对时间过期失效时间
      data.prevDelaySeconds = values.prevDelaySeconds; //相对时间间隔时间
    }
    if (values.contentType === 1) {
      //内容类型为图片
      data.payloadUrl = values.imgUrl.file.response.imageUrl;
      data.payloadMd5 = values.imgUrl.file.response.fileMd5;
    } else if (values.contentType === 2) {
      //内容类型为视频
      if (this.state.screenList[index].videoType === 1) {
        if (values.videoFile.file.response === '文件数据异常') {
          message.error('"请上传视频文件"');
          return false;
        }
        data.payloadUrl = values.videoFile.file.response.fileUrl; // 视频
        data.payloadMd5 = values.videoFile.file.response.fileMd5;
        data.fileName = values.videoFile.file.name;
        data.videoType = 1;
        data.videoPicUrl = values.videoFileBgPic.file.response.imageUrl; //视频背景图片
        data.videoPicMd5 = values.videoFileBgPic.file.response.fileMd5;
        data.videoPreviewPicUrl =
          values.videoFilePreviewPic.file.response.imageUrl; //视频预览图片
        data.videoPreviewPicMd5 =
          values.videoFilePreviewPic.file.response.fileMd5;
      } else {
        data.payloadUrl = values.videoUrl;
        data.videoType = 2;
        data.videoPicUrl = values.videoUrlBgPic.file.response.imageUrl; //视频背景图片
        data.videoPicMd5 = values.videoUrlBgPic.file.response.fileMd5;
        data.videoPreviewPicUrl =
          values.videoUrlPreviewPic.file.response.imageUrl; //视频预览图片
        data.videoPreviewPicMd5 =
          values.videoUrlPreviewPic.file.response.fileMd5;
      }
    } else {
      //内容类型为h5
      if (this.state.screenList[index].h5Type === 1) {
        //h5文件
        if (values.h5File.file.response === '文件数据异常') {
          message.error('请上传h5离线文件');
          return false;
        }
        data.payloadUrl = values.h5File.file.response.fileUrl;
        data.payloadMd5 = values.h5File.file.response.fileMd5;
        data.h5Type = 1;
        data.fileName = values.h5File.file.name;
      } else {
        data.payloadUrl = values.h5Url;
        data.h5Type = 2;
      }
    }
    // 创建弹屏 第一个弹屏的 firstFirework：true ;prevFireworkId: 0
    // 其他弹屏的 firstFirework：false ;prevFireworkId: 上一个弹屏的id
    if (index === 0) {
      data.prevFireworkId = '';
      data.firstFirework = true;
    } else {
      data.firstFirework = false;
      data.prevFireworkId = this.state.screenList[index - 1].id;
    }
    // 创建计划的firstFirework全为false
    if (!this.props.screen) data.firstFirework = false;
    data.appId = this.props.appId;
    // console.log(data, '提交的数据');
    // 保存弹屏： 此弹屏已经存在 -> 只是编辑 有id和planId；
    // 此弹屏不存在 ->  编辑计划新增的弹屏：有planId； 新建计划的弹屏： 没有planId
    if (this.state.screenList[index].id) {
      data.id = this.state.screenList[index].id;
      data.planId = this.props.planId;
      updateScreenInfo(data).then(() => {
        message.success('编辑成功');
        this.fetchSaveInfo(this.props.planId);
        this.setState({
          couldAdd: true
        });
      });
    } else {
      if (this.props.isEdit || !this.props.screen) {
        data.planId = this.props.planId;
      }
      saveNewScreen(data).then(res => {
        // console.log(res, '保存弹屏返回的结果');
        message.success('保存成功');
        this.fetchSaveInfo(res.data.planId);
        if (res.data.planId && this.props.screen) {
          this.props.changePlanId(res.data.planId);
        }
        this.setState({
          couldAdd: true,
          couldNext: true
        });
      });
    }
  };
  // 点击下一步
  handleNexType = () => {
    this.props.next(1);
  };
  // 上一步
  handlePrev = () => {
    this.props.prev(1);
  };
  // 改变开始时间类型
  changeTimeType = (val, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList[index].beginTimeValue = val.target.value;
    this.setState({
      screenList
    });
  };
  // // 改变跳转类型
  changeJumpType = (jumpType, index) => {
    // console.log(jumpType, index, '改变跳转类型');
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList[index].jumpTypeValue = jumpType;
    this.setState({ screenList });
  };
  // 改变内容类型
  changeContentType = (val, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList[index].contentTypeValue = val.target.value;
    screenList[index].imageUrl = ''; //重置图片
    screenList[index].videoBgPic = ''; //重置背景图片
    screenList[index].videoPreviewPic = ''; //重置预览图片
    screenList[index].h5Type = '';
    screenList[index].videoType = '';
    this.setState({
      screenList
    });
  };
  // 改变视频类型
  changeVideoType = (val, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList[index].videoType = val.target.value;
    screenList[index].videoFileList = []; //重置背景图片
    screenList[index].videoBgPic = ''; //重置背景图片
    screenList[index].videoPreviewPic = ''; //重置预览图片
    this.setState({
      screenList
    });
  };
  // h5类型改变
  changeH5Upload = (val, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    screenList[index].h5Type = val.target.value;
    screenList[index].h5FileList = [];
    this.setState({
      screenList
    });
  };
  // h5文件上传
  h5HandleChange = (file, index) => {
    // console.log(file, index, '文件上传');
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    if (!file) {
      screenList[index].h5FileList = [];
      this.setState({
        screenList
      });
      return false;
    }
    screenList[index].h5FileList = file;
    this.setState({
      screenList
    });

    if (file[0].response === '文件数据异常') {
      message.error('文件数据异常');
      screenList[index].h5FileList = [];
      this.setState({
        screenList
      });
    }
  };
  // 视频上传
  videoHandleChange = (file, index) => {
    // console.log(file, index, '视频上传');
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    if (!file) {
      screenList[index].videoFileList = [];
      this.setState({
        screenList
      });
      return false;
    }
    screenList[index].videoFileList = file;
    this.setState({
      screenList
    });
    if (file[0].response === '文件数据异常') {
      message.error('视频上传失败!');
      screenList[index].videoFileList = [];
      this.setState({
        screenList
      });
    }
  };
  // 图片上传
  imageChange = (files, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    if (!files) {
      screenList[index].imageUrl = '';
      this.setState({
        screenList
      });
      return false;
    }
    if (files[0].status === 'done') {
      if (files[0].response === '图片大小过大') {
        message.error('图片大小过大');
        return false;
      }
      screenList[index].imageUrl = files[0].response.imageUrl;
      this.setState({
        screenList
      });
    }
  };
  // 背景图片上传
  videoBgHandleChange = (files, index) => {
    // console.log(files, index, '背景图片上传');
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    if (!files) {
      screenList[index].videoBgPic = '';
      this.setState({
        screenList
      });
      return false;
    }
    if (files[0].status === 'done') {
      if (files[0].response === '图片大小过大') {
        message.error('图片大小过大');
        return false;
      }
      screenList[index].videoBgPic = files[0].response.imageUrl;
      this.setState({
        screenList
      });
    }
  };
  // 视频预览图片上传
  videoPreviewPicChange = (files, index) => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    if (!files) {
      screenList[index].videoPreviewPic = '';
      this.setState({
        screenList
      });
      return false;
    }
    if (files[0].status === 'done') {
      if (files[0].response === '图片大小过大') {
        message.error('图片大小过大');
        return;
      }
      screenList[index].videoPreviewPic = files[0].response.imageUrl;
      this.setState({
        screenList
      });
    }
  };
  // 删除弹屏
  handleDeleteScreen = index => {
    let screenList = JSON.parse(JSON.stringify(this.state.screenList));
    // console.log(index, screenList, '删除数据');
    // 点击新增，还没有保存的弹屏
    if (!screenList[index].id) {
      if (screenList.length > 1) {
        screenList.splice(index, 1);
        this.setState({
          screenList,
          couldAdd: true
        });
      } else {
        message.warning('至少保留一个弹屏');
      }
    } else {
      // 删除已经保存过的弹屏
      if (index === 0) {
        message.error('首个弹屏不能删除！');
        return;
      }
      let newArr = [];
      screenList.forEach(ele => {
        if (ele.id) {
          newArr.push(ele);
        }
      });
      if (newArr.length > 1) {
        deleteScreen({ fireworkId: newArr[index].id }).then(() => {
          let reqArr = [];
          newArr.splice(index, 1);
          message.success('删除成功');
          // console.log(screenList, '删除后的数据')
          for (let i = index; i < newArr.length; i++) {
            let data = {
              fireworkId: newArr[i].id,
              planId: this.props.planId,
              prevFireworkId: i > 0 ? newArr[i - 1].id : 0
            };
            reqArr.push(updateScreenId(data));
          }
          // 对剩余的弹屏prevFireworkId 重新设置，上一个的id是下一个的prevFireworkId， 第一个弹屏的prevFireworkId为0
          Promise.all(reqArr).then(() => {
            this.fetchSaveInfo(this.props.planId);
          });
        });
      } else {
        message.warning('弹屏至少为一个');
      }
    }
  };
  render() {
    let { readOnly } = this.props;
    return (
      <div className="basic-content newscreen-content">
        <div className="basci-title">弹屏基本信息</div>
        <Spin spinning={this.state.loading}>
          <div className="basci-contain">
            {this.state.screenList.map((ele, index) => {
              return (
                <Collapse
                  key={index}
                  className="screen-form-box"
                  defaultActiveKey={['1']}
                >
                  <Panel header={ele.name} key="1">
                    <ScreenForm
                      videoBgHandleChange={this.videoBgHandleChange}
                      videoPreviewPicChange={this.videoPreviewPicChange}
                      imageChange={this.imageChange}
                      changeH5Upload={this.changeH5Upload}
                      h5HandleChange={this.h5HandleChange}
                      videoHandleChange={this.videoHandleChange}
                      changeContentType={this.changeContentType}
                      changeJumpType={this.changeJumpType}
                      changeTimeType={this.changeTimeType}
                      index={index}
                      ele={ele}
                      handleSaveScreen={this.handleSaveScreen}
                      changeVideoType={this.changeVideoType}
                      isEdit={this.props.isEdit}
                      readOnly={this.props.readOnly}
                      handleDeleteScreen={this.handleDeleteScreen}
                      c
                    />
                  </Panel>
                </Collapse>
              );
            })}
            {readOnly ? null : (
              <div>
                {/* 创建弹屏时没有新增按钮，只能创建一个弹屏 */}
                {this.props.screen ? null : (
                  <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                    <div className="add-button">
                      <Button
                        type="primary"
                        onClick={this.handleAddNewScreen}
                        disabled={!this.state.couldAdd || this.props.readOnly}
                      >
                        新增
                      </Button>
                    </div>
                  </FormItem>
                )}
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <div className="next-button">
                    {this.props.screen ? (
                      <span />
                    ) : (
                      <Button type="primary" onClick={this.handlePrev}>
                        上一步
                      </Button>
                    )}
                    <Button
                      type="primary"
                      onClick={this.handleNexType}
                      disabled={!this.state.couldNext}
                    >
                      下一步
                    </Button>
                  </div>
                </FormItem>
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default NewScreen;
