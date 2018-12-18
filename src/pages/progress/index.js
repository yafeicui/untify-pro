import React, { Component } from 'react';
import { Spin } from 'antd';
import './index.scss';

class ProgressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { stepsItem, progressLoading } = this.props;
    let result = true;
    stepsItem.forEach(ele => {
      if (ele.status === '等待审批') {
        result = false;
      }
    });
    // console.log(progressLoading, '加载');
    return (
      <div className="basic-content ">
        <div className="basci-title">审批进度</div>
        <Spin spinning={progressLoading}>
          <div className="appro-progress-cont">
            <div
              className={[
                'progress-content',
                stepsItem.length <= 1 ? 'padding-pro' : ''
              ].join(' ')}
            >
              <div
                className={[
                  'start-item',
                  stepsItem.length <= 1 ? 'step-item' : ''
                ].join(' ')}
              >
                <div className="step-circle before-item">1</div>
                <div className="step-title">开始</div>
                <div className="step-line" />
              </div>
              {stepsItem.map((ele, index) => {
                return (
                  <div
                    className={[
                      // index === stepsItem.length - 1 ? 'step-app' : 'step-item'
                      'step-item'
                    ]}
                    key={index}
                  >
                    <div
                      className={[
                        'step-circle',
                        ele.status === '待审核' || ele.status === '审核通过'
                          ? 'before-item'
                          : '',
                        ele.status === '审核不通过' ? 'error-item' : ''
                      ].join(' ')}
                    >
                      {index + 2}
                    </div>
                    {/* 步骤名称 */}
                    <div className="step-title">{ele.locationName}</div>
                    {/* 如果不是最后一步要加  ------- */}
                    {/* {index === stepsItem.length - 1 ? null : (
                  <div className="step-line" />
                )} */}
                    <div className="step-line" />
                    {/* 下部的内容展示区域 */}
                    <div className="show-cont">
                      {/* 展示状态 */}
                      <div className="status-cont">
                        <span className="status-title">状态:</span>
                        <span
                          className={[
                            'status-value',
                            ele.status === '审核不通过' ? 'reject-item' : '',
                            ele.status === '审核通过' ? 'pass-item' : ''
                          ].join(' ')}
                        >
                          {ele.status}
                        </span>
                      </div>
                      {/*  审批通过展示审批人和审批时间*/}
                      {ele.status === '审核通过' ||
                      ele.status === '审核不通过' ? (
                        <div>
                          <div className="status-cont">
                            <span>审批人:</span>
                            <span>{ele.operatorName}</span>
                          </div>
                          <div className="status-cont">
                            <span>审批时间:</span>
                            <span>{ele.operateAt}</span>
                          </div>
                        </div>
                      ) : null}
                      {/* 带审批， 展示可审批人 */}
                      {ele.status === '等待审批' ? (
                        <div>
                          <div className="appro-user-cont">
                            <div className="user-name">可审批人:</div>
                            <div className="user-value">
                              {ele.auditorVOS.map(item => {
                                return (
                                  <span key={item.id} className="appro-user">
                                    {item.disName}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div className="status-cont">
                            <span>申请时间:</span>
                            <span>{ele.operateAt}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div className={['start-item', 'end-item'].join(' ')}>
                <div
                  className={['step-circle', result ? 'before-item' : ''].join(
                    ' '
                  )}
                >
                  {stepsItem.length + 2}
                </div>
                <div className="step-title">结束</div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default ProgressPage;
