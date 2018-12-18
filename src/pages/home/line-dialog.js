import React, { Component } from 'react';
import { Modal, DatePicker, Spin, Button } from 'antd';
import CloseLine from '@/components/echart/line';
import JumpLine from '@/components/echart/line';
import { getOpenLineData, getJumpLineData } from '@/http/http';
import moment from 'moment';
import './modal.scss';

const { RangePicker } = DatePicker;
class LineEchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      visible: false,
      isOpen: false, // 点击的是否是展示量
      loading: false,
      openLineData: '',
      jumpLineData: '',
      timeRange: [] //时间范围
    };
  }
  componentDidMount() {
    let end = new Date().getTime();
    let start = end - 7 * 24 * 60 * 60 * 1000;
    this.setState(
      {
        visible: true,
        timeRange: [moment(start), moment(end)],
        isOpen: this.props.isOpen,
        title: this.props.isOpen ? '弹框展示-点击量' : '弹框点击-展示量'
      },
      () => {
        this.init();
      }
    );
  }
  init = () => {
    let params = {
      planId: this.props.planId,
      start: this.state.timeRange[0]._d.getTime(),
      end: this.state.timeRange[1]._d.getTime()
    };
    this.setState(
      {
        loading: true,
        jumpLineData: '',
        openLineData: ''
      },
      () => {
        Promise.all([getOpenLineData(params), getJumpLineData(params)])
          .then(res => {
            // console.log(res, '折线图数据');
            let openData = res[0].data || [];
            let jumpData = res[1].data || [];
            let openLineData = '';
            let jumpLineData = '';
            if (openData.length) {
              openLineData = this.handleLineData(openData, 'open');
            }
            if (jumpData.length) {
              jumpLineData = this.handleLineData(jumpData, 'jump');
            }
            this.setState({
              loading: false,
              openLineData,
              jumpLineData
            });
          })
          .catch(() => {
            this.setState({
              loading: false
            });
          });
      }
    );
  };
  handleLineData = (data, type) => {
    let xAxisData = [];
    let androidData = [];
    let iosData = [];
    let totalData = [];
    data.forEach(ele => {
      xAxisData.push(moment(ele.ts).format('YYYY-MM-DD HH:mm:ss'));
      androidData.push(ele.android);
      iosData.push(ele.ios);
      totalData.push(ele.total);
    });
    return {
      title: type === 'open' ? '弹框展示量' : '弹框点击量',
      xAxisData,
      androidData,
      iosData,
      totalData
    };
  };
  changeDate = timeRange => {
    this.setState({ timeRange });
  };
  handleSearch = () => {};
  render() {
    let {
      title,
      visible,
      isOpen,
      loading,
      timeRange,
      openLineData,
      jumpLineData
    } = this.state;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.props.handleCancel}
        destroyOnClose={true}
        footer={null}
        width="900px"
        className="line-dialig"
      >
        <div className="date-content">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['Start Time', 'End Time']}
            onChange={this.changeDate}
            onOk={this.changeDate}
            allowClear={false}
            value={timeRange}
          />
          <Button
            type="primary"
            onClick={this.init}
            className="search-echart"
            loading={loading}
          >
            搜索
          </Button>
        </div>
        {isOpen ? (
          <Spin spinning={loading}>
            <div className="line-box">
              {openLineData ? (
                <CloseLine lineData={openLineData} />
              ) : (
                <div className="no-message">暂无数据</div>
              )}
            </div>
            <div className="line-box">
              {jumpLineData ? (
                <JumpLine lineData={jumpLineData} />
              ) : (
                <div className="no-message">暂无数据</div>
              )}
            </div>
          </Spin>
        ) : (
          <Spin spinning={loading}>
            <div className="line-box">
              {jumpLineData ? (
                <JumpLine lineData={jumpLineData} />
              ) : (
                <div className="no-message">暂无数据</div>
              )}
            </div>
            <div className="line-box">
              {openLineData ? (
                <CloseLine lineData={openLineData} />
              ) : (
                <div className="no-message">暂无数据</div>
              )}
            </div>
          </Spin>
        )}
      </Modal>
    );
  }
}
export default LineEchart;
