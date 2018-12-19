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

import styles from './Buildings.less';

const FormItem = Form.Item;

@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.models.buildings,
}))
@Form.create()
export default class Buildings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {},
      zoneList: [],
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
    }
  }

  componentWillMount(){
    this.props.dispatch({
      type: 'buildings/fetchZones',
      payload: { page: 1, per_page: 9999 },
      callback: (data) => {
        this.setState({
          zoneList: [...data],
        })
      },
    });
    this.refreshTable();
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.buildings.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);
    return {
      ...tableParams,
      ...formValues,
    };
  };

  refreshTable = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'buildings/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
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
        const { data: { pagination } } = this.props.buildings;
        this.refreshTable({current:1, page_size:pagination.page_size});
      });
    });
  };

  handleAdd = () => {
    this.pageForward('/settings/buildings/add');
  };

  handleShow = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/buildings/show/${id}`);
  };

  handleEdit = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/buildings/edit/${id}`);
  };

  pageForward = (url, params) => {
    const state = {
      formValues: this.state.formValues,
      pagination: this.props.buildings.data.pagination,
      ...params,
    };
    this.props.dispatch(routerRedux.push({
      pathname: url,
      state,
    }));
  };

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'buildings/delete',
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
    const { Option } = Select;
    const { zoneList } = this.state;
    const zoneOptions = zoneList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="小区">
              {getFieldDecorator('zone_id', { initialValue: this.state.formValues.zone_id })(
                <Select placeholder="请选择" showSearch optionFilterProp='title'>
                  {zoneOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24} offset={4}>
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
    const { buildings: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '小区名称',
        dataIndex: 'zone_name',
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
        onChange={this.refreshTable}
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
