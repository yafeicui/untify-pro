import React, { Component } from 'react';
import { Layout, Button, Menu, Dropdown, Icon, Carousel } from 'antd';
import { fetchLoginout } from '@/http/http';
import { withRouter } from 'react-router-dom';
import './index.scss';
import { noticeInfo } from '@/http/http.js';
const { Header } = Layout;
class ProHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSumbit: true,
      menuList: []
    };
  }
  componentDidMount() {
    if (sessionStorage.getItem('isLogin')) {
      noticeInfo().then(res => {
        this.setState({
          menuList: res.data || []
        });
      });
    }
  }
  loginout = () => {
    const { canSumbit } = this.state;
    if (!canSumbit) return;
    this.setState({ canSumbit: false }, () => {
      fetchLoginout()
        .then(() => {
          sessionStorage.setItem('isLogin', '');
          this.props.history.push({
            pathname: '/login'
          });
        })
        .catch(() => {
          this.setState({ canSumbit: true });
        });
    });
  };
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={() => this.loginout()} type="primary">
            退登
          </Button>
        </Menu.Item>
      </Menu>
    );
    let userName = localStorage.getItem('screenUser');
    const setting = {
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 25000,
      autoplaySpeed: 0,
      cssEase: 'linear'
    };
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className="header-inner">
          <div className="carousel-cont">
            {this.state.menuList.length ? (
              <Carousel autoplay {...setting}>
                {this.state.menuList.map((ele, index) => {
                  return (
                    <div key={index} className="notice-box">
                      <span>{ele.desc}</span>
                    </div>
                  );
                })}
              </Carousel>
            ) : null}
          </div>
          <div className="right-document">
            <a
              href="http://gitlab.ximalaya.com/x-fm/firework/blob/develop/doc/testCase/fireworkGuide.md"
              target="_blank"
              rel="noopener noreferrer"
              className="document-a"
            >
              使用文档
            </a>
            <div className="logout-button">
              <Dropdown overlay={menu} trigger={['click']}>
                <span className="ant-dropdown-link">
                  {userName} <Icon type="down" />
                </span>
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>
    );
  }
}
export default withRouter(ProHeader);
