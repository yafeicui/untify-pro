import React, { Component } from 'react';
import './index.scss';
import '../home/index.scss';
import {
  Button,
  Table,
  Divider,
  message,
  Select,
  Popconfirm,
  Tooltip
} from 'antd';
import ModalLayer from './modal';
import { getAll, getById, save, delById, update } from '@/http/put_page';
import { fetchApplyList } from '@/http/http.js';

const { Column } = Table;
const Option = Select.Option;
class ManagePut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '',
      modalData: {
        disName: '',
        name: '',
        fireworkCountOneDay: '',
        intervalSeconds: 3600
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      tableData: [],
      nowEditId: null,
      appIdList: [],
      appId: ''
    };
  }
  componentDidMount() {
    fetchApplyList().then(res => {
      let appIdList = res.data || [];
      let appId = '';
      if (appIdList.length) appId = appIdList[0].id;
      this.setState(
        {
          appIdList,
          appId
        },
        () => {
          this.initTable();
        }
      );
    });
  }
  initTable = (current = 1) => {
    const pagination = { ...this.state.pagination };
    let params = {
      page: current,
      pageSize: 10,
      appId: this.state.appId
    };
    this.setState({ loading: true }, () => {
      getAll(params)
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
    });
  };
  // 应用改变
  appIdChange = val => {
    this.setState({ appId: val }, () => {
      this.initTable();
    });
  };
  showModal = () => {
    let modalData = { ...this.state.modalData };
    for (var key in modalData) {
      modalData[key] = '';
    }
    modalData.intervalSeconds = 3600;
    this.setState({ modalData, modalVisible: true, modalTitle: '添加投放' });
  };
  handleCancel = () => {
    let modalData = { ...this.state.modalData };
    for (var key in modalData) {
      modalData[key] = '';
    }
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({ modalData, modalVisible: false });
  };
  // 新增投放页面
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { modalTitle, nowEditId } = this.state;
      let axios;
      if (modalTitle === '添加投放') {
        axios = save(values);
      } else {
        axios = update({ ...values, id: nowEditId });
      }
      axios.then(() => {
        message.success('保存成功!');
        this.initTable();
      });
      form.resetFields();
      this.setState({ modalVisible: false });
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  // 删除
  handleDelete = id => {
    delById(id).then(() => {
      message.success('删除成功!');
      this.initTable();
    });
  };
  handleEdit = id => {
    getById(id).then(({ data }) => {
      this.setState({
        modalData: data,
        modalVisible: true,
        modalTitle: '编辑投放',
        nowEditId: id
      });
    });
  };
  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({ androidPagination: pager });
    this.initTable(pagination.current);
  };
  render() {
    const { modalVisible, modalTitle, modalData } = this.state;
    return (
      <div className="homeContent mange-put-page">
        <div className="tableTitle">投放页面管理</div>
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
          <Button
            type="primary"
            className="button_right"
            onClick={this.showModal}
          >
            新增
          </Button>
        </div>
        <Table
          bordered
          size="small"
          rowKey="id"
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          dataSource={this.state.tableData}
        >
          <Column
            title="页面别名"
            dataIndex="disName"
            align="center"
            key="disName"
          />
          <Column
            title="android页面唯一id"
            dataIndex="androidValue"
            align="center"
            key="androidValue"
            width="300px"
            render={(text, records) => (
              <span>
                {records.androidValue ? (
                  records.androidValue.length < 18 ? (
                    <div className="width-limit">{records.androidValue}</div>
                  ) : (
                    <Tooltip title={records.androidValue}>
                      <div className="width-limit">{records.androidValue}</div>
                    </Tooltip>
                  )
                ) : (
                  ''
                )}
              </span>
            )}
          />
          <Column
            title="ios页面唯一id"
            dataIndex="iosValue"
            align="center"
            key="iosValue"
            width="300px"
            render={(text, records) => (
              <span>
                {records.iosValue ? (
                  records.iosValue.length < 18 ? (
                    <div className="width-limit">{records.iosValue}</div>
                  ) : (
                    <Tooltip title={records.iosValue}>
                      <div className="width-limit">{records.iosValue}</div>
                    </Tooltip>
                  )
                ) : (
                  ''
                )}
              </span>
            )}
          />
          <Column
            title="一天弹屏限制"
            dataIndex="fireworkCountOneDay"
            key="fireworkCountOneDay"
            align="center"
          />
          <Column
            title="弹屏间隔时间"
            align="center"
            dataIndex="intervalSeconds"
            key="intervalSeconds"
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width="100px"
            render={(text, record) => (
              <span>
                <a href="javascript:;" onClick={() => this.handleEdit(text.id)}>
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除此页面？"
                  onConfirm={() => this.handleDelete(text.id, 1)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <ModalLayer
          wrappedComponentRef={this.saveFormRef}
          visible={modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          title={modalTitle}
          formData={modalData}
          appIdList={this.state.appIdList}
        />
      </div>
    );
  }
}
export default ManagePut;
