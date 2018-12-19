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

import styles from './SysParams.less';

const FormItem = Form.Item;

// create role
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleCreate, handleUpdate, handleModalVisible, sysParam } = props;
  const title = sysParam.id === undefined || sysParam.id === null ? '新建系统参数' : '编辑系统参数';
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (sysParam.id !== null && sysParam.id !== undefined) {
        handleUpdate(fieldsValue);
      }else{
        handleCreate(fieldsValue);
      }
    });
  };
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: sysParam.id,
      })(<Input type="hidden"  />)}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数键">
        {form.getFieldDecorator('param_type', {
          rules: [{ required: true, message: '请输入参数键' }],
          initialValue: sysParam.param_type,
        })(<Input placeholder="请输入参数键" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数值">
        {form.getFieldDecorator('param_value', {
          rules: [{ required: true, message: '请输入参数值' }],
          initialValue: sysParam.param_value,
        })(<Input placeholder="请输入参数值" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数名称">
        {form.getFieldDecorator('param_name', {
          rules: [{ required: true, message: '请输入参数名称' }],
          initialValue: sysParam.param_name,
        })(<Input placeholder="请输入参数名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数描述">
        {form.getFieldDecorator('param_desc', {
          rules: [{ required: true, message: '请输入参数描述' }],
          initialValue: sysParam.param_desc,
        })(<Input placeholder="请输入参数描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数排序">
        {form.getFieldDecorator('param_sort', {
          rules: [{ required: true, message: '请输入参数排序' }],
          initialValue: sysParam.param_sort,
        })(<Input placeholder="请输入参数排序" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ sysParams, loading }) => ({
  sysParams,
  loading: loading.models.sysParams,
}))
@Form.create()
export default class SysParams extends PureComponent {

  state = {
    modalVisible: false,
    formValues: {},
  };

  componentDidMount() {
    this.querySysParamsList()

  }

  querySysParamsList = () =>{
    const params = {
      ...this.state.formValues,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'sysParams/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filters, sorter) => {
    const values = {
      ...this.state.formValues,
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({
      formValues: values,
    },()=>{
      this.querySysParamsList();
    });

  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    },()=>{
      this.querySysParamsList();
    });
  };


  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      },()=>{
        this.querySysParamsList();
      });
    });
  };


  // ====================== 添加 =============================

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleCreate = fields => {
    this.props.dispatch({
      type: 'sysParams/create',
      payload: fields,
      callback: (response) => {
        if (response.success === true){
          message.success('系统参数添加成功');
          this.querySysParamsList();
        }else{
          message.success('系统参数添加失败');
        }
      },
    });
  };

  // ====================== 编辑 =============================
  handleEdit = (item, e) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'sysParams/getInfo',
      payload: item,
      callback: () => {
        this.handleModalVisible(true);
      },
    });
  };

  handleUpdate = fields => {
    this.props.dispatch({
      type: 'sysParams/update',
      payload: fields,
      callback: (response) => {
        if (response.success === true){
          this.setState({
            modalVisible: false,
          });
          message.success('系统参数修改成功');
          this.querySysParamsList();
        }else{
          message.success('系统参数修改失败');
        }
      },
    });
  };

  // ====================== 删除 =============================
  handleDelete = (paramId) => {
    this.props.dispatch({
      type: 'sysParams/delete',
      payload: {
        id: paramId,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('系统参数删除成功');
          this.querySysParamsList();
        }else{
          message.success('系统参数删除失败');
        }
      },
    });

  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="参数键">
              {getFieldDecorator('param_type')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="参数描述">
              {getFieldDecorator('param_desc')(<Input placeholder="请输入" />)}
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
    const { sysParams: { data, sysParamInfo }, loading } = this.props;
    const { modalVisible } = this.state;
    const editSysParam = this.handleEdit;
    const deleteSysParam = this.handleDelete;

    const selectedRows = [];

    const columns = [
      {
        title: '参数键',
        dataIndex: 'param_type',
      },
      {
        title: '参数值',
        dataIndex: 'param_value',
      },
      {
        title: '参数名称',
        dataIndex: 'param_name',
      },
      {
        title: '参数描述',
        dataIndex: 'param_desc',
      },
      {
        title: '参数排序',
        dataIndex: 'param_sort',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a href="#" onClick={(e) => editSysParam(record, e)} >编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除吗？" onConfirm={() => deleteSysParam(record.id)} >
                <a href="#" style={{color: 'red'}} >删除</a>
              </Popconfirm>
            </Fragment>
          )
        },
      },
    ];
    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      sysParam: sysParamInfo,
    };

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListTitle}>
            系统参数
          </div>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div style={{marginBottom: '20px'}}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowKey='id'
            needRowSelection={false}
            needShowSelect={false}
          />
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </Card>
    );
  }
}
