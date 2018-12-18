import React, { Component } from 'react';
import './index.scss';
import {
  Form,
  Input,
  Select,
  Table,
  Divider,
  Checkbox,
  Row,
  Button,
  Col,
  message,
  Popconfirm,
  Tag
} from 'antd';
import { withRouter } from 'react-router-dom';
import {
  fetchApplyList,
  fetchStatus,
  fetchLocationList,
  fecthTableList,
  stopPlan,
  fetchApproval,
  discardPlan,
  updatePutInScreen,
  fetchAppApprovalUsers
} from '@/http/http.js';
import ApprovalModal from './approval-dialog';
import LookDialog from '../look_dialog';
import LineDialog from './line-dialog';

const Option = Select.Option;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appIdList: [],
      addresList: [],
      statusList: [],
      appId: '', //应用
      locationId: '', //地址
      status: '', //状态
      name: '', //名称
      owner: false, //只看我的

      tableData: [],
      loading: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      page: 1,
      pageSize: 10,
      visible: false, // 审批弹出框数据
      userList: [],
      planId: '',
      checkedUser: [],
      lookVisible: false, //查看计划的visible
      rowId: '', //点击行的id
      isScreen: false, //是否是弹屏
      lineVisible: false, //是否展示折线图
      isOpen: false //是否展示关闭量折线图
    };
  }
  componentDidMount() {
    this.initState();
  }
  initState = () => {
    Promise.all([fetchApplyList(), fetchStatus()]).then(res => {
      let appArr = res[0].data || [];
      let statusArr = res[1].data || [];
      let applyId = '';
      appArr.length ? (applyId = appArr[0].id) : (applyId = '');
      localStorage.setItem('applyId', applyId);
      this.setState(
        {
          appIdList: appArr,
          statusList: statusArr,
          appId: applyId
        },
        () => {
          if (this.state.appIdList.length) {
            this.getLocationList();
          } else {
            message.warning(
              '目前您还未被授予使用权限，请让应用管理员帮你赋予权限',
              [5]
            );
          }
        }
      );
    });
  };
  // 获取地址列表
  getLocationList = () => {
    fetchLocationList({ appId: this.state.appId, pageSize: 1000 }).then(res => {
      let list = res.data.list || [];
      this.setState({ addresList: list }, () => {
        this.getTableList();
      });
    });
  };
  // 应用改变
  applyChange = val => {
    localStorage.setItem('applyId', val);
    this.setState({ appId: val, locationId: '' }, () => {
      this.getLocationList();
    });
  };
  // 状态改变
  changeStatus = val => {
    this.setState({ status: val }, () => {
      this.getTableList();
    });
  };
  // 地址改变
  locationStatus = val => {
    this.setState({ locationId: val }, () => {
      this.getTableList();
    });
  };
  // 名称改变
  nameChange = e => {
    this.setState({
      name: e.target.value
    });
  };
  // 只看我的
  changeOnlyMe = val => {
    this.setState({ owner: val.target.checked }, () => {
      this.getTableList();
    });
  };
  // 获取列表数据
  getTableList = () => {
    this.setState({
      loading: true
    });
    let params = {
      appId: this.state.appId,
      locationId: this.state.locationId,
      status: this.state.status,
      name: this.state.name,
      owner: this.state.owner,
      page: this.state.page,
      pageSize: this.state.pageSize
    };
    fecthTableList(params)
      .then(res => {
        let pagination = JSON.parse(JSON.stringify(this.state.pagination));
        pagination.total = res.data.totalCount;
        pagination.pageSize = res.data.pageSizeCount;
        this.setState({
          tableData: res.data.list || [],
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
  // 创建计划
  handleCreatePlan = () => {
    this.props.history.push({
      pathname: '/page/create-plan',
      query: {
        appId: this.state.appId,
        isEdit: false,
        readOnly: false,
        screen: false
      }
    });
  };
  handleCreateScreen = () => {
    this.props.history.push({
      pathname: '/page/create-plan',
      query: {
        appId: this.state.appId,
        isEdit: false,
        readOnly: false,
        screen: true
      }
    });
  };
  // 中止计划
  stopPlan = row => {
    stopPlan({ planId: row.id }).then(res => {
      message.success('操作成功');
      this.getTableList();
    });
  };
  //  提交审批
  submitApp = row => {
    let params = {
      appId: this.state.appId
    };
    Promise.all([
      fetchAppApprovalUsers(params),
      fetchApproval({ planId: row.id })
    ]).then(res => {
      let checkedUser = [];
      res[1].data.forEach(ele => {
        checkedUser.push(ele.id);
      });
      this.setState({
        userList: res[0].data || [],
        visible: true,
        planId: row.id,
        checkedUser
      });
    });
  };
  closeModal = () => {
    this.setState({
      visible: false
    });
  };
  // 提交审批成功
  success = () => {
    this.setState({ visible: false }, () => {
      this.getTableList();
    });
  };
  // 编辑 审核成功 的数据， 先生成一条新的数据返回一个planId，
  updateSuccessPlan = row => {
    updatePutInScreen({ planId: row.id }).then(res => {
      this.handleUpdate({ id: res.data, type: row.type });
    });
  };
  handleUpdate = row => {
    this.props.history.push({
      pathname: '/page/create-plan',
      query: {
        appId: this.state.appId,
        id: row.id,
        isEdit: true,
        readOnly: false,
        screen: row.type ? true : false
      }
    });
  };
  changeTablePage = page => {
    let { current } = page;
    let pagination = this.state.pagination;
    pagination.current = current;
    this.setState({ page: current, pagination }, () => {
      this.getTableList();
    });
  };
  handleReadOnly = row => {
    this.setState({
      rowId: row.id,
      lookVisible: true,
      isScreen: row.type ? true : false
    });
  };
  closeLook = () => {
    this.setState({
      rowId: '',
      lookVisible: false
    });
  };
  // 废弃弹屏
  discardPlan = row => {
    discardPlan({ planId: row.id }).then(() => {
      message.success('操作成功');
      this.getTableList();
    });
  };
  showLine = (row, type) => {
    this.setState({
      lineVisible: true,
      rowId: row.clientId,
      isOpen: type ? true : false
    });
  };
  lineCancel = () => {
    this.setState({
      rowId: '',
      lineVisible: false,
      isOpen: false
    });
  };
  render() {
    const loginUser = localStorage.getItem('screenUser');
    // console.log(loginUser, '用户');
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator',
        align: 'center',
        render: (text, record) => <Tag color="blue">{record.creator}</Tag>
      },
      {
        title: '开始时间',
        key: 'startAt',
        dataIndex: 'startAt',
        align: 'center'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        align: 'center'
      },
      {
        title: '弹出-展示量',
        key: 'openCount',
        dataIndex: 'openCount',
        align: 'center',
        render: (text, record) => {
          return (
            <span
              className="num-span"
              onClick={() => this.showLine(record, true)}
            >
              {record.openCount}
            </span>
          );
        }
      },
      {
        title: '弹出-点击量',
        key: 'jumpCount',
        dataIndex: 'jumpCount',
        align: 'center',
        render: (text, record) => {
          return (
            <span
              className="num-span"
              onClick={() => this.showLine(record, false)}
            >
              {record.jumpCount}
            </span>
          );
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 240,
        render: (text, record) => (
          <span>
            {/* |init|创建中    1|查看 编辑 提交审批| 废弃|
            |audit|待审核     2|查看 编辑|
            |audit_success|审核成功，投放中    3|查看 停止计划| 编辑弹屏|
            |audit_fail|审核失败      4|查看编辑 提交审批| 废弃|
            |cancle|撤销     5|查看| 废弃|
            |suspend|投放中止    6|查看| 废弃|
            |expired|已过期    7|查看| 废弃|
            |modify|修改中    8|查看| 废弃|
            |discard|废弃    9|查看| 废弃|
             */}
            <span>
              <a
                className="table-operate"
                onClick={() => this.showLine(record, true)}
              >
                报表
              </a>
              <Divider type="vertical" />
              <a
                className="table-operate"
                onClick={() => this.handleReadOnly(record)}
              >
                查看
              </a>
            </span>
            {record.statusEn === 'init' ? (
              <span>
                <Divider type="vertical" />
                <a
                  className="table-operate"
                  onClick={() => this.handleUpdate(record)}
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <a
                  className="table-operate"
                  onClick={() => this.submitApp(record)}
                >
                  提交审批
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定废弃此弹屏？"
                  onConfirm={() => this.discardPlan(record)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a className="table-operate orange-color">废弃</a>
                </Popconfirm>
              </span>
            ) : null}
            {record.statusEn === 'audit' ? (
              <span>
                <Divider type="vertical" />
                <a
                  className="table-operate"
                  onClick={() => this.handleUpdate(record)}
                >
                  编辑
                </a>
              </span>
            ) : null}
            {record.statusEn === 'audit_success' ? (
              <span>
                <Divider type="vertical" />
                <Popconfirm
                  title="此操作将新生成一条数据并修改, 确定继续？"
                  onConfirm={() => this.updateSuccessPlan(record)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a
                    className="table-operate"
                    // onClick={() => this.handleUpdate(record)}
                  >
                    编辑
                  </a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定停止此弹屏计划？"
                  onConfirm={() => this.stopPlan(record)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a className="table-operate red-color">停止计划</a>
                </Popconfirm>
              </span>
            ) : null}
            {record.statusEn === 'audit_fail' ? (
              <span>
                <Divider type="vertical" />
                <a
                  className="table-operate"
                  onClick={() => this.handleUpdate(record)}
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <a
                  className="table-operate"
                  onClick={() => this.submitApp(record)}
                >
                  提交审批
                </a>
              </span>
            ) : null}

            {record.statusEn === 'expired' ||
            (record.statusEn === 'modify' && loginUser === 'admin') ? (
              <span>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定废弃此弹屏？"
                  onConfirm={() => this.discardPlan(record)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a className="table-operate orange-color">废弃</a>
                </Popconfirm>
              </span>
            ) : null}
          </span>
        )
      }
    ];
    return (
      <div className="homeContent">
        <div className="tableTitle">统一弹屏系统</div>
        <div className="applyContent">
          <div className="applyTitle">应用：</div>
          <div className="applyInput">
            <Select
              style={{ width: '100%' }}
              value={this.state.appId}
              onChange={this.applyChange}
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
        <Form layout="inline" className="home-page-form">
          <Row gutter={24}>
            <Col span="3">
              <Form.Item
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Checkbox onChange={this.changeOnlyMe}>只看我的</Checkbox>
              </Form.Item>
            </Col>
            <Col span="5" label="名称">
              <Form.Item
                label="名称"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
              >
                <Input
                  value={this.state.name}
                  onChange={this.nameChange}
                  onBlur={this.getTableList}
                />
              </Form.Item>
            </Col>
            <Col span="5">
              <Form.Item
                label="投放地址"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
              >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  value={this.state.locationId}
                  onChange={this.locationStatus}
                >
                  <Option value="" key="111">
                    所有
                  </Option>
                  {this.state.addresList.map(ele => {
                    return (
                      <Option value={ele.id} key={ele.id}>
                        {ele.disName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span="5">
              <Form.Item
                label="状态"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
              >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  value={this.state.status}
                  onChange={this.changeStatus}
                >
                  <Option value="" key="111">
                    所有
                  </Option>
                  {this.state.statusList.map(ele => {
                    return (
                      <Option value={ele.id} key={ele.id}>
                        {ele.desc}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span="6" className="button-create-plan">
              <Form.Item
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <div className="create-button-group">
                  <Button
                    type="primary"
                    disabled={this.state.appId === ''}
                    onClick={this.handleCreatePlan}
                  >
                    创建计划
                  </Button>
                  <Button
                    type="primary"
                    disabled={this.state.appId === ''}
                    onClick={this.handleCreateScreen}
                  >
                    创建弹屏
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="tableContent">
          <Table
            columns={columns}
            dataSource={this.state.tableData}
            bordered
            size="small"
            rowKey="id"
            onChange={this.changeTablePage}
            pagination={this.state.pagination}
            loading={this.state.loading}
          />
        </div>
        <ApprovalModal
          visible={this.state.visible}
          appId={this.state.appId}
          userList={this.state.userList}
          handleCancel={this.closeModal}
          planId={this.state.planId}
          success={this.success}
          checkedUser={this.state.checkedUser}
        />
        {this.state.lookVisible ? (
          <LookDialog
            visible={this.state.lookVisible}
            appId={this.state.appId}
            planId={this.state.rowId}
            isEdit={true}
            readOnly={true}
            handleCancel={this.closeLook}
            screen={this.state.isScreen}
          />
        ) : null}
        {this.state.lineVisible ? (
          <LineDialog
            handleCancel={this.lineCancel}
            isOpen={this.state.isOpen}
            planId={this.state.rowId}
          />
        ) : null}
      </div>
    );
  }
}
export default withRouter(Form.create()(Home));
