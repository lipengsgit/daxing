import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import ProjectTree from 'components/ProjectTree';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Divider,
  Popconfirm,
  Radio,
  Select,
  Layout,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getTableParams } from '../../../utils/componentUtil';

import styles from './DeviceManager.less';

const FormItem = Form.Item;

@connect(({ deviceManager, loading }) => ({
  deviceManager,
  loading: loading.models.deviceManager,
}))
@Form.create()
export default class DeviceManager extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {},
      projectId: -1,
      positionId: -1,
      // defaultExpandAll: true,
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
      this.state.projectId = propState.projectId;
      this.state.positionId = propState.positionId;
      const { dispatch } = this.props;
      dispatch({
        type: 'deviceManager/setPagination',
        payload: propState.pagination,
      });
    }else{
      this.state.projectId = this.props.match.params.id;
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceManager/fetchTypes',
      payload: { page:1, per_page: 9999 },
    });

  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.deviceManager.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    const params = {
      ...tableParams,
      ...formValues,
      project_id: this.state.projectId,
    };
    if(this.state.positionId !== -1){
      params.position_id = this.state.positionId;
    }
    return params;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'deviceManager/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }, () => {
      const params = this.getFetchParams({current:1, page_size:10});
      dispatch({
        type: 'deviceManager/fetch',
        payload: params,
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      }, () => {
        const params = this.getFetchParams({current:1, page_size:10});
        dispatch({
          type: 'deviceManager/fetch',
          payload: params,
        });
      });
    });
  };

  handleAdd = () => {
    this.handleCommon('/settings/devices/add');
  };

  handleShow = (id, e) => {
    e.preventDefault();
    this.handleCommon(`/settings/devices/show/${id}`);
  };

  handleEdit = (id, e) => {
    e.preventDefault();
    this.handleCommon(`/settings/devices/edit/${id}`);
  };

  handleCommon = (url) => {
    const { projectId, positionId } = this.state;
    this.props.dispatch({
      type: 'deviceManager/getPositionName',
      payload: { positionId },
      callback: (data) => {
        const state = { projectId, positionId, positionName: data.name };
        this.goForward(url, state);
      },
    });
  };

  goForward = (url, params) => {
    const state = {
      formValues: this.state.formValues,
      pagination: this.props.deviceManager.data.pagination,
      ...params,
    };
    this.props.dispatch(routerRedux.push({
      pathname: url,
      state,
    }));
  };

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'deviceManager/delete',
      payload: {
        id,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');

          const params = this.getFetchParams();
          this.props.dispatch({
            type: 'deviceManager/fetch',
            payload: params,
          });
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  fetchPositionsCallback = (positionId) => {
    const { dispatch } = this.props;
    if (positionId){
      this.setState({
        positionId,
      }, () => {
        const params = this.getFetchParams();
        dispatch({
          type: 'deviceManager/fetch',
          payload: params,
        });
      })
    }else{
      const params = this.getFetchParams();
      dispatch({
        type: 'deviceManager/fetch',
        payload: params,
      });
    }
  };

  treeSelectCallback  = (posId) => {
    this.setState({
      positionId: posId,
    }, this.handleFormReset)
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const RadioGroup = Radio.Group;
    const { Option } = Select;

    const typeOptions = this.props.deviceManager.deviceTypeList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);
    const stateOptions = this.props.deviceManager.deviceStates.map(d => { return {label:d.name, value:d.id} });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name', { initialValue: this.state.formValues.name })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={10} sm={24} offset={4}>
            <FormItem label="设备类型">
              {getFieldDecorator('device_category_id', { initialValue: this.state.formValues.device_category_id })(
                <Select placeholder="请选择" showSearch optionFilterProp='title'>
                  {typeOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={14} sm={24}>
            <FormItem label="设备状态">
              {getFieldDecorator('status', { initialValue: this.state.formValues.status })(
                <RadioGroup options={stateOptions} />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
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
    const { deviceManager: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备类型',
        dataIndex: 'device_category_name',
      },
      {
        title: '项目',
        dataIndex: 'project_name',
      },
      {
        title: '代理',
        dataIndex: 'delegate_name',
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        render: (text) => {
          switch (text) {
            case 0:
              return '使用中';
            case 1:
              return '未使用';
            case 2:
              return '已报废';
            default:
              return '';
          }
        },
      },
      {
        title: '设备编号',
        dataIndex: 'device_no',
      },
      {
        title: '设备厂商',
        dataIndex: 'manufacturer',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <div style={{textAlign: 'right'}}>
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
    const { Content, Sider } = Layout;
    const projectParams = {
      projectId: this.state.projectId,
      positionId:this.state.positionId,
      dispatch: this.props.dispatch,
      fetchPositionsCallback: this.fetchPositionsCallback,
      treeSelectCallback: this.treeSelectCallback,
      defaultChecked: true,
    };
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
              <ProjectTree {...projectParams} />
            </Sider>
            <Content style={{ padding: '0 24px' }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                {
                  this.state.positionId !== -1 && (
                    <div className={styles.tableListOperator}>
                      <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                        新建
                      </Button>
                    </div>
                  )
                }
                {this.renderTable()}
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
