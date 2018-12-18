import React, { Component } from 'react';
import { Checkbox, Table, Select, Button, message, Spin } from 'antd';
import './index.scss';
import {
  fetchLocationSelectList,
  fetchPositionAllTable,
  saveOrUpdatePosition,
  fetchSavedLocationList
} from '@/http/http.js';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTableData: [], //所有页面表格数据
      positionSelectList: [], //下拉框所有数据
      positionList: [{ tableData: [], value: '' }],
      loading: false
    };
  }
  componentDidMount() {
    this.setState(
      {
        loading: true
      },
      () => {
        this.init();
      }
    );

    // console.log(this.props, '位置');
  }
  init = () => {
    // 获取保存的列表
    if (this.props.isEdit) {
      let params = {
        planId: this.props.planId
      };
      let positionList = JSON.parse(JSON.stringify(this.state.positionList));
      fetchSavedLocationList(params).then(res => {
        // console.log(res, '位置列表');
        let resp = res.data || [];
        resp.forEach((ele, index) => {
          positionList[index] = { tableData: [], value: '' };
          positionList[index].value = ele.locationId;
          positionList[index].tableData = ele.planPlusDTOList;
        });
        this.setState({
          positionList,
          loading: false
        });
      });
    }
    let paramsSelect = {
      appId: this.props.appId,
      page: 1,
      pageSize: 300
    };
    fetchLocationSelectList(paramsSelect)
      .then(res => {
        this.setState({
          positionSelectList: res.data.list || [],
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          positionSelectList: []
        });
      });
  };
  handleFetchTableList = (locationId, index) => {
    let positionList = JSON.parse(JSON.stringify(this.state.positionList));
    positionList[index].value = locationId;
    let params = {
      appId: this.props.appId,
      planId: this.props.planId,
      locationId
    };
    fetchPositionAllTable(params).then(res => {
      positionList[index].tableData = res.data[0].planPlusDTOList || [];
      this.setState({
        positionList
      });
    });
  };

  deletePosition = index => {
    let positionList = JSON.parse(JSON.stringify(this.state.positionList));
    if (positionList.length > 1) {
      positionList.splice(index, 1);
      this.setState({
        positionList
      });
    } else {
      message.error('最少有一个位置');
    }
  };
  addPositionList = () => {
    let positionList = JSON.parse(JSON.stringify(this.state.positionList));
    positionList.push({
      tableData: [],
      value: ''
    });
    this.setState({
      positionList
    });
  };
  handleNextStep = () => {
    let params = {
      appId: this.props.appId,
      planId: this.props.planId
    };
    let locationId = [];
    this.state.positionList.forEach(ele => {
      if (ele.value !== '') locationId.push(ele.value);
    });
    locationId = Array.from(new Set(locationId)); //数组去重
    if (locationId.length < 1) {
      message.warning('请至少选择一个位置');
    } else {
      params.locationId = locationId;
      saveOrUpdatePosition(params).then(res => {
        this.props.next(3);
      });
    }
  };
  handlePrevStep = () => {
    this.props.prev(3);
  };
  render() {
    const columns = [
      { title: '计划名称', dataIndex: 'name', key: 'name', align: 'center' },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
        align: 'center'
      },
      { title: '状态', dataIndex: 'status', key: 'status', align: 'center' },
      {
        title: '优先级',
        dataIndex: 'locationOrder',
        key: 'locationOrder',
        align: 'center'
      }
    ];
    const { readOnly } = this.props;
    return (
      <div className="basic-content">
        <div className="basci-title">位置</div>
        <Spin spinning={this.state.loading}>
          <div className="basci-contain loaction-content">
            <CheckboxGroup>
              {this.state.positionList.map((ele, index) => {
                return (
                  <div key={index} className="table-box">
                    <div className="select-box">
                      <Select
                        style={{ width: 200 }}
                        onChange={val => this.handleFetchTableList(val, index)}
                        value={ele.value}
                        disabled={readOnly}
                        showSearch
                        optionFilterProp="children"
                      >
                        {this.state.positionSelectList.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.disName}
                            </Option>
                          );
                        })}
                      </Select>
                      {readOnly ? null : (
                        <Button
                          onClick={() => this.deletePosition(index)}
                          disabled={readOnly}
                          type="danger"
                        >
                          删除该位置
                        </Button>
                      )}
                    </div>
                    <Table
                      bordered
                      dataSource={ele.tableData}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  </div>
                );
              })}
            </CheckboxGroup>
            {readOnly ? null : (
              <div>
                <div className="button-position">
                  <Button
                    type="primary"
                    onClick={this.addPositionList}
                    disabled={readOnly}
                  >
                    添加位置
                  </Button>
                </div>
                <div className="next-button">
                  <Button type="primary" onClick={this.handlePrevStep}>
                    上一步
                  </Button>
                  <Button type="primary" onClick={this.handleNextStep}>
                    下一步
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default Location;
