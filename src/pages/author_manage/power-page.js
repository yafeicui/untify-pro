import React, { Component } from 'react';
import './index.scss';
import { Select, message, Spin, Table, Button, Popconfirm, Tag } from 'antd';
import {
  fetchApplyList,
  fetchAllSelectedUsers,
  fetchAllUsers,
  giveUserAuthor,
  deleteUsersAuthor,
  fetchLocationList,
  fetchLocationTable,
  saveLocationUser,
  deleteLocationUser
} from '@/http/http.js';
const Option = Select.Option;
class AuthorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: '',
      appIdList: [],
      users: '',
      usersList: [], //管理员、审批人、创建者   三个下拉框使用一个数据
      tableData: [],
      powerList: [
        { label: '管理员', value: 'app_admin' },
        { label: '审批人', value: 'auditor' },
        { label: '创建者', value: 'creator' }
      ],
      power: '',
      loading: false,
      locationList: [],
      location: '',
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      locationTableData: []
    };
  }
  componentDidMount() {
    // console.log(this.props, '页面参数');
    this.setState({ loading: true }, () => {
      this.getAppIdList();
      this.getAllUsers();
    });
  }
  getAppIdList = () => {
    fetchApplyList()
      .then(res => {
        let appIdList = res.data || [];
        let appId = '';
        if (appIdList.length) appId = appIdList[0].id;
        this.setState({ appIdList, appId }, () => {
          if (this.props.pageKey === 2) {
            this.getLocationList();
            this.getLocationTable();
          } else if (this.props.pageKey === 1) {
            this.getAllSelectedUsers();
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          appIdList: []
        });
      });
  };
  // 获取用户的下拉框列表
  getAllUsers = () => {
    fetchAllUsers()
      .then(res => {
        let usersList = res.data || [];
        this.setState({
          usersList
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          usersList: []
        });
      });
  };
  // 获取位置下拉框列表
  getLocationList = () => {
    let params = {
      appId: this.state.appId,
      page: 1,
      pageSize: 1000
    };
    fetchLocationList(params).then(res => {
      this.setState({
        locationList: res.data.list || []
      });
    });
  };
  // 获取位置管理Table
  getLocationTable = () => {
    let pagination = JSON.parse(JSON.stringify(this.state.pagination));
    let params = {
      appId: this.state.appId,
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    fetchLocationTable(params).then(res => {
      let resp = res.data;
      pagination.total = resp.totalCount;
      pagination.current = resp.pageId;
      this.setState({
        locationTableData: resp.list || [],
        pagination,
        loading: false
      });
    });
  };
  // 获取 权限Table 列表
  getAllSelectedUsers = () => {
    let pagination = JSON.parse(JSON.stringify(this.state.pagination));
    let params = {
      appId: this.state.appId,
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    fetchAllSelectedUsers(params)
      .then(res => {
        let resp = res.data;
        pagination.total = resp.totalCount;
        pagination.current = resp.pageId;
        this.setState({
          tableData: resp.list || [],
          pagination,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          tableData: []
        });
      });
  };
  // 改变应用
  appIdChange = appId => {
    this.setState(
      {
        appId,
        users: '',
        power: '',
        location: '',
        loading: true
      },
      () => {
        if (this.props.pageKey === 1) {
          this.getAllSelectedUsers();
        } else {
          this.getLocationTable();
        }
      }
    );
  };
  // 改变权限
  powerChange = power => {
    this.setState({
      power
    });
  };
  // 选择用户
  choiceUser = users => {
    this.setState({
      users
    });
  };
  // 选择位置
  locationChange = location => {
    this.setState({
      location
    });
  };
  //  点击授权
  setAuthor = () => {
    let data = {
      userId: this.state.users,
      appId: this.state.appId
    };
    if (this.props.pageKey === 1) {
      data.type = this.state.power;
      giveUserAuthor(data).then(() => {
        message.success('授权成功');
        this.setState(
          {
            power: '',
            users: '',
            loading: true
          },
          () => {
            this.getAllSelectedUsers();
          }
        );
      });
    } else {
      data.locationId = this.state.location;
      saveLocationUser(data).then(() => {
        message.success('授权成功');
        this.setState(
          {
            location: '',
            users: '',
            loading: true
          },
          () => {
            this.getLocationTable();
          }
        );
      });
    }
  };
  // 删除用户
  deleteAuthor = val => {
    let data = {
      userId: val.id,
      appId: this.state.appId
    };
    let pagination = JSON.parse(JSON.stringify(this.state.pagination));
    deleteUsersAuthor(data).then(() => {
      pagination.current = 1;
      message.success('删除成功');
      this.setState({ loading: true, pagination }, () => {
        this.getAllSelectedUsers();
      });
    });
  };
  // 删除用户位置权限
  deleteLocationUser = row => {
    let pagination = JSON.parse(JSON.stringify(this.state.pagination));
    deleteLocationUser({ id: row.id }).then(() => {
      message.success('删除成功');
      pagination.current = 1;
      this.setState({ loading: true, pagination }, () => {
        this.getLocationTable();
      });
    });
  };
  // 分页
  tableChange = pagination => {
    this.setState({ pagination, loading: true }, () => {
      if (this.props.pageKey === 1) {
        this.getAllSelectedUsers();
      } else {
        this.getLocationTable();
      }
    });
  };
  render() {
    const columns = [
      {
        title: '用户',
        dataIndex: 'disName',
        key: 'disName',
        align: 'center',
        render: (text, record) => <Tag color="blue">{record.disName}</Tag>
      },
      {
        title: '英文名',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '权限',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, record) => <Tag color="#2db7f5">{record.type}</Tag>
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 100,
        render: (text, record) => (
          <Popconfirm
            title="确定删除此用户权限？"
            onConfirm={() => this.deleteAuthor(record)}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <a className="table-operate">删除</a>
          </Popconfirm>
        )
      }
    ];
    const locationColumns = [
      {
        title: '用户',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        render: (text, record) => <Tag color="blue">{record.userName}</Tag>
      },
      {
        title: '授权页面',
        dataIndex: 'locationName',
        key: 'locationName',
        align: 'center'
      },
      {
        title: '授权者',
        dataIndex: 'operatorName',
        key: 'operatorName',
        align: 'center',
        render: (text, record) => (
          <Tag color="#2db7f5">{record.operatorName}</Tag>
        )
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 100,
        render: (text, record) => (
          <Popconfirm
            title="确定删除此用户位置权限？"
            onConfirm={() => this.deleteLocationUser(record)}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <a className="table-operate">删除</a>
          </Popconfirm>
        )
      }
    ];
    return (
      <div className="homeContent author-manage">
        <div className="app-content">
          <div className="app-title">应用：</div>
          <div className="app-input">
            <Select
              style={{ width: '100%' }}
              value={this.state.appId}
              onChange={this.appIdChange}
              showSearch
              optionFilterProp="children"
            >
              {this.state.appIdList.map(ele => {
                return (
                  <Option value={ele.id} key={ele.id}>
                    {ele.desc}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="app-content">
          <div className="app-title">选择用户：</div>
          <div className="app-input">
            <Select
              style={{ width: '100%' }}
              value={this.state.users}
              onChange={this.choiceUser}
              showSearch
              optionFilterProp="children"
            >
              {this.state.usersList.map(ele => {
                return (
                  <Option value={ele.id} key={ele.id}>
                    {ele.disName}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>

        {this.props.pageKey === 1 ? (
          <div className="app-content">
            <div className="app-title">选择权限：</div>
            <div className="app-input">
              <Select
                style={{ width: '100%' }}
                value={this.state.power}
                onChange={this.powerChange}
                showSearch
                optionFilterProp="children"
              >
                {this.state.powerList.map(ele => {
                  return (
                    <Option value={ele.value} key={ele.value}>
                      {ele.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        ) : (
          <div className="app-content">
            <div className="app-title">选择位置：</div>
            <div className="app-input">
              <Select
                style={{ width: '100%' }}
                value={this.state.location}
                onChange={this.locationChange}
                showSearch
                optionFilterProp="children"
              >
                {this.state.locationList.map(ele => {
                  return (
                    <Option value={ele.id} key={ele.id}>
                      {ele.disName}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        )}
        <div className="ensure-button">
          {this.state.users && (this.state.power || this.state.location) ? (
            <Button type="primary" onClick={this.setAuthor}>
              确定授权
            </Button>
          ) : (
            <Button type="primary" disabled>
              确定授权
            </Button>
          )}
        </div>
        <Spin spinning={this.state.loading}>
          <Table
            columns={this.props.pageKey === 1 ? columns : locationColumns}
            dataSource={
              this.props.pageKey === 1
                ? this.state.tableData
                : this.state.locationTableData
            }
            bordered
            size="small"
            rowKey="id"
            onChange={this.tableChange}
            pagination={this.state.pagination}
          />
        </Spin>
      </div>
    );
  }
}
export default AuthorManage;
