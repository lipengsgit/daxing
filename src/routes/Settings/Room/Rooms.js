import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  message,
  Divider,
  Popconfirm,
  Select,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import { getTableParams } from '../../../utils/componentUtil';
import RoomCascader from "../../../components/RoomCascader";

import styles from './Rooms.less';

const FormItem = Form.Item;

const convertLocation = (value) => {
  const param = {};
  if(value !== undefined && value !== null ){
    Object.keys(value).forEach((key) => {
      switch (key) {
        case 'zoneId':
          param.zone_id = value.zoneId;
          break;
        case 'buildingId':
          param.building_id = value.buildingId;
          break;
        case 'unitId':
          param.unit_id = value.unitId;
          break;
        default:
      }
    });
  }
  return param;
};


@connect(({ rooms, zones, buildings, loading }) => ({
  rooms,
  zones,
  buildings,
  loading: loading.models.rooms,
}))
@Form.create()
export default class Rooms extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {},
      zoneList: [],
      buildingList: [],
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
    }
  }

  componentWillMount(){
    this.props.dispatch({
      type: 'zones/fetch',
      payload: { page: 1, per_page: 9999 },
      callback: (data) => {
        this.setState({
          zoneList: [...data.list],
        })
      },
    });

    const zoneId = this.state.formValues.zone_id;
    if(zoneId){
      this.props.dispatch({
        type: 'buildings/fetch',
        payload: { page: 1, per_page: 9999, zone_id: parseInt(zoneId, 10) },
        callback: (data) => {
          this.setState({
            buildingList: [...data.list],
          })
        },
      });
    }
    this.refreshTable();
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.rooms.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);
    return {
      ...tableParams,
      ...formValues,
      ...convertLocation(formValues.location),
    };
  };

  refreshTable = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'rooms/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.refreshTable(pagination, filtersArg, sorter);
  };

  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'roomCascader/initial',
    });
    this.setState({
      formValues: {},
    }, () => {
      this.refreshTable({current:1, page_size:10});
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      }, () => {
        this.refreshTable({current:1, page_size:10});
      });
    });
  };

  handleAdd = () => {
    this.pageForward('/settings/rooms/add');
  };

  handleShow = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/rooms/show/${id}`);
  };

  handleEdit = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/rooms/edit/${id}`);
  };

  pageForward = (url, params) => {
    const state = {
      formValues: this.state.formValues,
      pagination: this.props.rooms.data.pagination,
      ...params,
    };
    this.props.dispatch(routerRedux.push({
      pathname: url,
      state,
    }));
  };

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'rooms/delete',
      payload: { id },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="位置">
              {getFieldDecorator('location')(
                <RoomCascader />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderTable() {
    const { rooms: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '小区',
        dataIndex: 'zone_name',
      },
      {
        title: '楼栋',
        dataIndex: 'building_name',
      },
      {
        title: '单元',
        dataIndex: 'unit_name',
      },
      {
        title: '业主',
        dataIndex: 'owner_name',
      },
      {
        title: '操作',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          return (
            <Fragment>
              <div>
                <a href="#" onClick={(e) => this.handleEdit(record.id, e)} >编辑</a>
                <Divider type="vertical" />
                <a href="" onClick={(e) => this.handleShow(record.id, e)} >查看</a>
                <Divider type="vertical" />
                <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDelete(record.id)} >
                  <a href="#" style={{color: 'red'}}>删除</a>
                </Popconfirm>
              </div>
            </Fragment>
          )
        },
      },
    ];
    return (
      <StandardTable
        selectedRows={selectedRows}
        loading={loading}
        data={data}
        columns={columns}
        onSelectRow={this.handleSelectRows}
        onChange={this.handleStandardTableChange}
        rowKey='id'
      />
    );
  }

  render() {
    return (
      <Card bordered={false} style={{overflow:'auto', marginTop: '30px'}}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
              新建
            </Button>
          </div>
          {this.renderTable()}
        </div>
      </Card>
    );
  }
}
