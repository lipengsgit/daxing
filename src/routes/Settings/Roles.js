import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTableParams } from '../../utils/componentUtil';

import styles from './Roles.less';

const FormItem = Form.Item;

// create role
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleCreate, handleUpdate, handleModalVisible, role, readOnly } = props;
  const title = role.id === undefined || role.id === null ? '新建角色' : '编辑角色';
  const okHandle = () => {
    if(readOnly){
      handleModalVisible();
    }else{
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (role.id !== null && role.id !== undefined) {
          handleUpdate(fieldsValue);
        }else{
          handleCreate(fieldsValue);
        }
      });
    }
  };
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: role.id,
      })(<Input type="hidden"  />)}
      {form.getFieldDecorator('role_type', {
        initialValue: role.role_type,
      })(<Input type="hidden"  />)}
      {form.getFieldDecorator('company_id', {
        initialValue: role.company_id,
      })(<Input type="hidden"  />)}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {readOnly ? role.name : form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称' }],
          initialValue: role.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色描述">
        {readOnly ? role.description : form.getFieldDecorator('description', {
          rules: [{ required: true, message: '请输入角色描述' }],
          initialValue: role.description,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ roles, loading }) => ({
  roles,
  loading: loading.models.roles,
}))
@Form.create()
export default class Roles extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      selectedRows: [],
      formValues: {},
      formReadOnly: false,
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'roles/fetch',
      payload: params,
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.roles.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    return {
      role_type: 1,
      ...tableParams,
      ...formValues,
    };
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'roles/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'roles/fetch',
      payload: {role_type: 1},
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

      const values = {
        role_type: 1,
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'roles/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = () => {
    this.props.dispatch({
      type: 'roles/add',
      callback: () => {
        this.setState({
          formReadOnly: false,
        });
        this.handleModalVisible(true);
      },
    });
  };

  handleCreate = fields => {
    this.props.dispatch({
      type: 'roles/create',
      payload: {
        name: fields.name,
        description: fields.description,
        role_type: 1,
      },
      callback: (response) => {
        if (response.success === true){
          this.setState({
            modalVisible: false,
          });
          message.success('添加成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  handleEdit = (roleId, e) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'roles/getInfo',
      payload: {
        id: roleId,
      },
      callback: () => {
        this.handleModalVisible(true);
        this.setState({
          formReadOnly: false,
        });
      },
    });
  };

  handleUpdate = fields => {
    this.props.dispatch({
      type: 'roles/update',
      payload: {
        id: fields.id,
        name: fields.name,
        description: fields.description,
      },
      callback: (response) => {
        if (response.success === true){
          this.setState({
            modalVisible: false,
          });
          message.success('操作成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  handleDelete = (roleId) => {
    this.props.dispatch({
      type: 'roles/delete',
      payload: {
        id: roleId,
      },
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

  refreshTable =  () => {
    const params = this.getFetchParams();
    this.props.dispatch({
      type: 'roles/fetch',
      payload: params,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('search_name', { initialValue: this.state.formValues.search_name })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色描述">
              {getFieldDecorator('search_description', { initialValue: this.state.formValues.search_description })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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

  render() {
    const { roles: { data, roleInfo }, loading } = this.props;
    const { selectedRows, modalVisible, formReadOnly, formValues } = this.state;
    const editRole = this.handleEdit;
    const deleteRole = this.handleDelete;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        width: '40%',
      },
      {
        title: '角色描述',
        dataIndex: 'description',
        width: '40%',
      },
      {
        title: '操作',
        render: (text, record) => {
          const resourcePath = '/settings/role/resource/';
          const url = resourcePath + record.id;
          const state = {formValues, pagination: data.pagination};
          return (
            <Fragment>
              <div style={{textAlign: 'right'}}>
                <a href="#" onClick={(e) => editRole(record.id, e)} >编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteRole(record.id)} >
                  <a href="#" style={{color: 'red'}} >删除</a>
                </Popconfirm>
                <Divider type="vertical" />

                <Link to={{pathname: url, state }} >
                  权限
                </Link>
              </div>
            </Fragment>
          )
        },
      },
    ];

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      role: roleInfo,
      readOnly: formReadOnly,
    };

    return (
      <PageHeaderLayout title="角色">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='id'
              needRowSelection={false}
              needShowSelect={false}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
