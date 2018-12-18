import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import QRCode from 'qrcode.react';
import './index.scss';

class QRCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: '',
      time: 20,
      footer: null
    };
  }
  componentDidMount() {
    this.init();
    setTimeout(() => {
      let footer = (
        <div>
          <Button type="danger" onClick={() => this.props.cancelVisible(false)}>
            配置有误
          </Button>
          <Button type="primary" onClick={() => this.props.cancelVisible(true)}>
            配置无误
          </Button>
        </div>
      );
      clearInterval(this.state.timer);
      this.setState({
        footer
      });
    }, 20000);
  }
  init = () => {
    let timer = setInterval(() => {
      this.setState({
        time: this.state.time - 1
      });
    }, 1000);
    this.setState({
      timer
    });
  };
  render() {
    let { visible, qRCodeUrl } = this.props;
    let { footer, time } = this.state;
    return (
      <Modal
        title="跳转地址确认"
        visible={visible}
        footer={footer}
        closable={false}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        width="620px"
      >
        <div className="qr-content">
          <div className="qr-title">
            请打开喜马拉雅APP, 点击右下角 [ 账号 ] 进入 [ 扫一扫 ] ,
            扫码确定跳转页面的正确性 !
          </div>
          <div className="qr-title">
            如若跳转地址配置不正确, 导致影响用户, 责任由创建者承担 !
          </div>
          {time > 0 ? (
            <div className="qr-time">
              <span className="qr-date">{time}</span>
              <span>秒后显示操作栏 !</span>
            </div>
          ) : null}

          <QRCode size={150} value={qRCodeUrl} />
        </div>
      </Modal>
    );
  }
}

export default QRCodeModal;
