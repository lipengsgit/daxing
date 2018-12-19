import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Divider,
  Popconfirm,
  Modal,
  Input,
  Form,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const CreateForm = Form.create()(class ResourceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModalHandler = e => {
    if (e) {
      e.stopPropagation();
    }

    this.setState({
      visible: true,
    });
  };

  hideModalHandler = () => {
    this.setState({
      visible: false,
    })
  };

  okHandler = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      onOk(fieldsValue);
      this.hideModalHandler();
    });
  };

  render() {
    const { type, form, resource = {}, children } = this.props;
    return (
      <span>
        <span onClick={this.showModalHandler}>{children}</span>
        <Modal
          title={type === 'create' ? '新建资源' : '编辑资源'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父资源">
            {form.getFieldDecorator('pname', {
              initialValue: resource.pname,
            })(<Input placeholder="无" disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="资源名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入资源名称' }],
              initialValue: resource.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="资源URL">
            {form.getFieldDecorator('url', {
              rules: [{ required: true, message: '请输入资源URL' }],
              initialValue: resource.url,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
});

@connect(({ resources, loading }) => ({
  resources,
  loading: loading.models.resources,
}))
export default class ResourceList extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resources/fetch',
    });
  }

  handleDelete(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'resources/remove',
      payload: id,
      callback: (response) => {
        if (response.success === true){
          message.success('删除成功');
          this.refreshTable();
        }else{
          message.success('删除失败');
        }
      },
    });
  }

  createHandler(parentId, values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'resources/create',
      payload: { parent_id: parentId, ...values },
      callback: (response) => {
        if (response.success === true){
          message.success('创建成功');
          this.refreshTable();
        }else{
          message.success('创建失败');
        }
      },
    })
  }

  editHandler(id, values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'resources/update',
      payload: { id, ...values },
      callback: (response) => {
        if (response.success === true){
          message.success('编辑成功');
          this.refreshTable();
        }else{
          message.success('编辑失败');
        }
      },
    });
  }

  refreshTable() {
    this.props.dispatch({
      type: 'resources/fetch',
    });
  }

  render() {
    const { resources: { list: dataSource }, loading } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      width: '40%',
      key: 'name',
    }, {
      title: 'URL',
      dataIndex: 'url',
      key: 'age',
    }, {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '操作',
      render: (text, record) => (
        <span>
          <CreateForm
            type="create"
            resource={{pname: record.name}}
            onOk={(values) => {
              this.createHandler(record.id, values);
            }}
          >
            <a>创建子资源</a>
          </CreateForm>
          <Divider type="vertical" />
          <CreateForm
            type="edit"
            resource={record}
            onOk={(values) => {
              this.editHandler(record.id, values);
            }}
          >
            <a>编辑</a>
          </CreateForm>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => this.handleDelete(record.id)}
          >
            <a className="btn-delete">删除</a>
          </Popconfirm>
        </span>
      ),
    }];
    return (
      <PageHeaderLayout>
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          rowKey="id"
          defaultExpandAllRows
        />
      </PageHeaderLayout>
    );
  }
};
