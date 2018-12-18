import React, { Component } from 'react';
import { Radio, Table, Divider, Tag, Select, Popconfirm, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { getAudit, resolve, reject, fetchAudited } from '@/http/approve_manage';
import { fetchApplyList } from '@/http/http.js';
import { approve_pagination } from '@/config/pagination_info';
import LookDialog from '../look_dialog';
import '../home/index.scss';
import '../mange_put_page/index.scss';

const RadioGroup = Radio.Group;
const { Column } = Table;
const Option = Select.Option;
class ApproveManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeValue: 2,
      auditPlans: [],
      auditPagination: approve_pagination,
      auditloading: false,
      appIdList: [],
      appId: '',
      lookVisible: false,
      rowId: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      auditedData: [],
      auditedLoading: false
    };
  }
  componentDidMount() {
    this.getAppIdList();
  }
  getAppIdList = () => {
    fetchApplyList().then(res => {
      let appIdList = res.data || [];
      let appId = '';
      if (appIdList.length) appId = appIdList[0].id;
      this.setState(
        {
          appId,
          appIdList
        },
        () => {
          this.initAuditPlans();
        }
      );
    });
  };
  // 待审批
  initAuditPlans = (current = 1) => {
    let params = {
      page: current,
      pageSize: approve_pagination.pageSize,
      appId: this.state.appId
    };
    this.setState({ auditloading: true });
    getAudit(params)
      .then(({ data: { list, totalCount } }) => {
        const pagination = { ...this.state.auditPagination };
        pagination.total = totalCount;

        list.forEach((item, index) => {
          item.key = index;
          item.auditors = item.auditors.map(child => child.disName);
        });
        this.setState({
          auditloading: false,
          auditPlans: list,
          auditPagination: pagination
        });
      })
      .catch(() => {
        this.setState({
          auditloading: false,
          auditPlans: []
        });
      });
  };
  // 已审批
  getAudited = () => {
    let params = {
      pageSize: 10,
      appId: this.state.appId,
      page: this.state.pagination.current
    };
    this.setState({ auditedLoading: true });
    fetchAudited(params)
      .then(res => {
        let resp = res.data;
        let auditedData = resp.list || [];
        let pagination = JSON.parse(JSON.stringify(this.state.pagination));
        pagination.total = resp.totalCount;
        this.setState({
          auditedData,
          pagination,
          auditedLoading: false
        });
      })
      .catch(() => {
        this.setState({
          auditedLoading: false,
          auditedData: []
        });
      });
  };
  appIdChange = val => {
    this.setState({ appId: val }, () => {
      this.state.typeValue === 2 ? this.initAuditPlans() : this.getAudited();
    });
  };
  onChange = e => {
    this.setState({ typeValue: e.target.value }, () => {
      if (e.target.value === 2) {
        this.initAuditPlans();
      } else {
        this.getAudited();
      }
    });
  };
  // 确认投放
  resolvePlan = flowId => {
    resolve({ flowId }).then(() => {
      message.success('通过成功');
      this.initAuditPlans(this.state.auditPagination.current);
    });
  };
  // 拒绝
  rejectPlan = flowId => {
    reject({ flowId }).then(() => {
      message.success('拒绝成功');
      this.initAuditPlans(this.state.auditPagination.current);
    });
  };

  lookPlan = planId => {
    this.setState({
      rowId: planId,
      lookVisible: true
    });
  };
  closeLook = () => {
    this.setState({
      rowId: '',
      lookVisible: false
    });
  };
  // 待我审批分页
  handleAuditTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.auditPagination };
    pager.current = pagination.current;
    this.setState({ auditPagination: pager });
    this.initAuditPlans(pagination.current);
  };
  // 我已审批分页
  handleAuditedChange = current => {
    let pagination = { ...current };
    this.setState(
      {
        pagination
      },
      () => {
        this.getAudited();
      }
    );
  };
  render() {
    const { typeValue, auditPlans, auditPagination, auditloading } = this.state;

    return (
      <div className="homeContent mange-put-page">
        <div className="tableTitle">审批管理</div>
        <div className="applyContent">
          <div className="applyTitle">应用：</div>
          <div className="applyInput">
            <Select
              style={{ width: '300px' }}
              value={this.state.appId}
              onChange={this.appIdChange}
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
        <div className="radio-group">
          <RadioGroup onChange={this.onChange} value={typeValue}>
            <Radio value={2}>待我审批</Radio>
            <Radio value={3}>我已审核</Radio>
          </RadioGroup>
        </div>
        <Table
          bordered
          size="small"
          pagination={auditPagination}
          loading={auditloading}
          dataSource={auditPlans}
          onChange={this.handleAuditTableChange}
          style={{ display: typeValue === 2 ? 'block' : 'none' }}
        >
          <Column
            title="计划名称"
            dataIndex="planName"
            key="planName"
            align="center"
          />
          <Column
            title="申请人"
            dataIndex="creatorName"
            key="creatorName"
            align="center"
            render={(text, record) => (
              <Tag color="cyan">{record.creatorName}</Tag>
            )}
          />
          <Column
            title="申请日期"
            dataIndex="createAt"
            key="createAt"
            align="center"
          />
          <Column
            title="待审批页面"
            dataIndex="detail"
            key="detail"
            align="center"
          />
          <Column
            title="可审批人"
            dataIndex="auditors"
            key="auditors"
            align="center"
            render={tags => (
              <span>
                {tags.map(tag => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </span>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width="150px"
            render={(text, record) => (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => this.lookPlan(text.planId)}
                >
                  查看
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="审批通过后，弹屏将投放给用户，确认投放么？"
                  onConfirm={() => this.resolvePlan(text.id)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a href="javascript:;">通过</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定拒绝？"
                  onConfirm={() => this.rejectPlan(text.id)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a href="javascript:;">拒绝</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        {typeValue === 3 ? (
          <Table
            bordered
            size="small"
            rowKey="id"
            pagination={this.state.pagination}
            loading={this.state.auditedLoading}
            dataSource={this.state.auditedData}
            onChange={this.handleAuditedChange}
          >
            <Column
              title="计划名称"
              dataIndex="planName"
              key="planName"
              align="center"
            />
            <Column
              title="申请人"
              dataIndex="creatorName"
              key="creatorName"
              align="center"
              render={(text, record) => (
                <Tag color="cyan">{record.creatorName}</Tag>
              )}
            />
            <Column
              title="申请日期"
              dataIndex="createAt"
              key="createAt"
              align="center"
            />
            <Column
              title="审批日期"
              dataIndex="operateAt"
              key="operateAt"
              align="center"
            />
            <Column
              title="审批页面"
              dataIndex="detail"
              key="detail"
              align="center"
            />
            <Column
              title="审批结果"
              dataIndex="auditType"
              key="auditType"
              align="center"
            />
            <Column
              title="审批人"
              dataIndex="auditorName"
              key="auditorName"
              align="center"
              render={(text, record) => (
                <Tag color="blue">{record.auditorName}</Tag>
              )}
            />
            <Column
              title="操作"
              key="action"
              align="center"
              width="150px"
              render={(text, record) => (
                <span>
                  <a
                    href="javascript:;"
                    onClick={() => this.lookPlan(text.planId)}
                  >
                    查看
                  </a>
                </span>
              )}
            />
          </Table>
        ) : null}
        {this.state.lookVisible ? (
          <LookDialog
            visible={this.state.lookVisible}
            appId={this.state.appId}
            planId={this.state.rowId}
            isEdit={true}
            readOnly={true}
            handleCancel={this.closeLook}
          />
        ) : null}
      </div>
    );
  }
}
export default withRouter(ApproveManage);
