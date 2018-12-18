import React, { Component } from 'react';
import './index.scss';
import '../home/index.scss';
import { Button, Table, Divider, message, Popconfirm, Tag } from 'antd';
import ModalLayer from './modal';
import { withRouter } from 'react-router-dom';
import { getAll, getById, save, delById, update } from '@/http/device';
import { device_pagination } from '@/config/pagination_info';
const { Column } = Table;

class DeviceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '',
      modalData: {
        deviceId: '',
        serialNumber: '',
        model: '',
        owner: '',
        userId: ''
      },
      listArr: [],
      pagination: device_pagination,
      loading: false,
      nowEditId: null
    };
  }
  componentDidMount() {
    this.initState();
  }
  initState = () => {
    this.initArr();
  };

  initArr = (current = 1) => {
    let params = {
      page: current,
      pageSize: device_pagination.pageSize
    };
    this.setState({ loading: true }, () => {
      getAll(params)
        .then(({ data: { list, totalCount } }) => {
          const pagination = { ...this.state.iosPagination };
          pagination.total = totalCount;
          list.map((item, key) => {
            return (item.key = key);
          });
          this.setState({
            loading: false,
            listArr: list,
            pagination: pagination
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            listArr: []
          });
        });
    });
  };
  handleTableChange = current => {
    // console.log(current, 99)
    this.initArr(current.current);
  };
  showModal = () => {
    this.setState({
      modalVisible: true,
      modalTitle: '添加设备',
      modalData: {
        deviceId: '',
        serialNumber: '',
        model: '',
        owner: '',
        userId: ''
      }
    });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { pagination, modalTitle, nowEditId } = this.state;
      pagination.current = 1;
      // console.log('Received values of form: ', values)
      let axios;
      if (modalTitle === '添加设备') {
        axios = save(values);
      } else {
        axios = update({ ...values, id: nowEditId });
      }
      axios.then(() => {
        message.success('操作成功!');
        this.initArr(pagination.current);
      });
      form.resetFields();

      this.setState({ modalVisible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleDelete = id => {
    const { pagination } = this.state;
    delById(id).then(() => {
      message.success('删除成功!');
      pagination.current = 1;
      this.setState({ pagination }, () => {
        this.initArr(pagination.current);
      });
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

  handleAndroidTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.androidPagination };
    pager.current = pagination.current;
    this.setState({ androidPagination: pager });
    this.initAndroidArr(pagination.current);
  };

  handleIosTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.iosPagination };
    pager.current = pagination.current;
    this.setState({ iosPagination: pager });
    this.initIosArr(pagination.current);
  };

  render() {
    const {
      listArr,
      loading,
      pagination,
      modalVisible,
      modalTitle,
      modalData
    } = this.state;

    return (
      <div className="homeContent mange-put-page">
        <div className="tableTitle">设备管理</div>
        <div className="radio-group">
          <Button
            type="primary"
            className="add-button"
            onClick={this.showModal}
          >
            新增
          </Button>
          <ModalLayer
            wrappedComponentRef={this.saveFormRef}
            visible={modalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            title={modalTitle}
            formData={modalData}
          />
        </div>
        <Table
          bordered
          size="small"
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
          dataSource={listArr}
        >
          <Column
            title="设备信息"
            dataIndex="deviceId"
            key="deviceId"
            align="center"
          />
          <Column
            title="公司唯一机器码"
            dataIndex="serialNumber"
            key="serialNumber"
            align="center"
          />
          <Column title="机型" dataIndex="model" key="model" align="center" />
          <Column
            title="设备持有者"
            dataIndex="owner"
            key="owner"
            align="center"
            render={(text, record) => {
              return record.owner !== '' ? (
                <Tag color="blue">{record.owner}</Tag>
              ) : (
                ''
              );
            }}
          />
          <Column
            title="用户id白名单"
            dataIndex="userId"
            key="userId"
            align="center"
          />
          <Column
            title="创建日期"
            dataIndex="createAt"
            key="createAt"
            align="center"
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
                  title="确定删除此条数据？"
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
      </div>
    );
  }
}
export default withRouter(DeviceManage);
