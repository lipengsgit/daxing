import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
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
  Select,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getTableParams } from '../../../utils/componentUtil';

import styles from './Companies.less';

const FormItem = Form.Item;

@connect(({ companies, loading }) => ({
  companies,
  loading: loading.models.companies,
}))
@Form.create()
export default class Companies extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {},
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'companies/fetch',
      payload: params,
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.companies.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    return {
      company_type: 1,
      ...tableParams,
      ...formValues,
    };
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'companies/fetch',
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
        type: 'companies/fetch',
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
          type: 'companies/fetch',
          payload: params,
        });
      });
    });
  };

  handleAdd = () => {
    this.pageForward('/settings/companies/add');
  };

  handleShow = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/companies/show/${id}`);
  };

  handleEdit = (id, e) => {
    e.preventDefault();
    this.pageForward(`/settings/companies/edit/${id}`);
  };

  pageForward = (url, params) => {
    const state = {
      formValues: this.state.formValues,
      pagination: this.props.companies.data.pagination,
      ...params,
    };
    this.props.dispatch(routerRedux.push({
      pathname: url,
      state,
    }));
  };

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'companies/delete',
      payload: { id },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');

          const params = this.getFetchParams();
          this.props.dispatch({
            type: 'companies/fetch',
            payload: params,
          });
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="公司名称">
              {getFieldDecorator('name', { initialValue: this.state.formValues.name })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={10} sm={24} offset={4}>
            <FormItem label="公司类别">
              {getFieldDecorator('company_type', { initialValue: this.state.formValues.company_type })(
                <Select placeholder="请选择" showSearch optionFilterProp='title'>
                  <Option key='0' title='运营商'>运营商</Option>
                  <Option key='1' title='物业公司'>物业公司</Option>
                  <Option key='2' title='运维公司'>运维公司</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
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
    const { companies: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '公司名称',
        dataIndex: 'name',
      },
      {
        title: '地区',
        dataIndex: 'adcode_name',
      },
      {
        title: '电话号码',
        dataIndex: 'phone',
      },
      {
        title: '负责人',
        dataIndex: 'contact_person_name',
      },
      {
        title: '负责人电话',
        dataIndex: 'contact_person_phone',
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
      <PageHeaderLayout >
        <Card bordered={false}>
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
      </PageHeaderLayout>
    );
  }
}
