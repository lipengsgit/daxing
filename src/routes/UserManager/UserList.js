import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Radio,
  Modal,
  Switch,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserList.less';
import { patternRule } from '../../utils/asyncValidatorHelper';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const statusOptions = [
  { label: '启用', value: false },
  { label: '禁用', value: true },
];

const sexOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
];


const CreateUserForm = Form.create()(props => {
  const { modalVisible, form, handleCreate, handleUpdate, handleModalVisible, userData, roleList } = props;
  const { getFieldDecorator } = form;
  const title = userData.id === undefined || userData.id === null ? '新建用户' : '编辑用户';
  const defaultPassword = '123456';
  const roleOptions = roleList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);
  const roleIds = userData ? userData.roles.map((role) => {
    return role.id.toString();
  }) : [];
  let formValidate = false;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (userData.id !== null && userData.id !== undefined) {
        handleUpdate(fieldsValue);
      }else{
        handleCreate(fieldsValue);
      }
    });
  };

  // 密码校验
  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    formValidate = formValidate || !!value;
  };
  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };
  const validateToNextPassword = (rule, value, callback) => {
    if (value && formValidate) {
      form.validateFields(['password_confirmation'], { force: true });
    }
    callback();
  };

  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form >
        <FormItem>
          {form.getFieldDecorator('id', {
            initialValue: userData.id,
          })(<Input type="hidden"  />)}
        </FormItem>
        <FormItem {...formItemLayout} label="帐号">
          {getFieldDecorator('username', {
            initialValue: userData.username,
            rules: [
              {
                required: true,
                message: '请输入帐号',
              },
            ],
          })(<Input placeholder="请输入帐号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('full_name', {
            initialValue: userData.full_name,
            rules: [
              {
                required: true,
                message: '请输入姓名',
              },
            ],
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('mobile_phone', {
            initialValue: userData.mobile_phone,
            rules: [
              {
                required: true,
                message: '请输入手机号',
              },
              patternRule('mobile'),
            ],
          })(<Input placeholder="请输入手机号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="性别">
          {getFieldDecorator('sex', {
            initialValue: userData.sex,
          })(<Radio.Group options={sexOptions} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="角色">
          {getFieldDecorator('role', {
            initialValue: roleIds,
          })(
            <Select
              mode="multiple"
              showSearch
              placeholder="请选择角色"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {roleOptions}
            </Select>
          )}
        </FormItem>
        {(userData.id === undefined || userData.id === null) && (
          <Fragment>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
                initialValue: defaultPassword,
              })(<Input type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('password_confirmation', {
                rules: [
                  {
                    required: true,
                    message: '请再次输入密码',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
                initialValue: defaultPassword,
              })(<Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} />)}
            </FormItem>
          </Fragment>
        )}
      </Form>
    </Modal>
  );
});



@connect(({ user, roles, loading }) => ({
  user,
  roles,
  loading: loading.models.user,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    expandSearchForm: false,
    formValues: {},
    createModalVisible: false,
    detailModal: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/queryUserList',
    });
    dispatch({
      type: 'roles/fetch',
      payload: {current:1, page_size:99999, role_type: 1},
    });
  }

  // --------------  新增用户  -------------//
  handleAdd = () => {
    this.props.dispatch({
      type: 'user/setEmptyEditUserData',
      payload: {roles: []},
      callback: () => {
        this.handleUserAddModalVisible();
      },
    });
  };
  handleUserAddModalVisible = () => {
    this.setState({
      createModalVisible: !this.state.createModalVisible,
    });
  };

  handleSubmit = (fields) => {
    this.props.dispatch({
      type: 'user/addUser',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功');
        this.setState({
          createModalVisible: false,
        });
        this.refreshTable();
      },
    });
  };
  handleUpdate = fields => {
    this.props.dispatch({
      type: 'user/updateUser',
      payload: {
        ...fields,
      },
      callback: () => {
        this.setState({
          createModalVisible: false,
        });
        message.success('修改成功');
        this.refreshTable();
      },
    });
  };
  refreshTable = () => {
    const { pagination } = this.props.user.userList;
    const { formValues } = this.state;
    const values = {
      ...formValues,
      page: pagination.current,
      per_page: pagination.page_size,
    };
    this.props.dispatch({
      type: 'user/queryUserList',
      payload: values,
    });
  };

  // --------------  用户详情  -------------//
  toggleUserDetailModal = (record, e) => {
    if(e) e.preventDefault();
    if(record){
      this.props.dispatch({
        type: 'user/fetchEditUserData',
        payload: {
          id: record.id,
        },
        callback: () => {
          this.setState({
            detailModal: !this.state.detailModal,
          });
        },
      });
    }else{
      this.setState({
        detailModal: !this.state.detailModal,
      });
    }
  };

  handleResetPassword = (uid)=>{
    this.props.dispatch({
      type: 'user/resetPassword',
      payload: {
        id: uid,
      },
      callback: () => {
        message.success('用户密码重置成功！');
      },
    });
  };
  handleLockStatusChange = ()=>{
    const { user: { editUserData } } = this.props;
    this.props.dispatch({
      type: 'user/switchLockStatus',
      payload: {
        id: editUserData.id,
      },
      callback: () => {
        this.refreshTable();
        message.success('用户启用状态更改成功！');
      },
    });
  };

  // --------------  删除用户   -------------//
  handleUserDeleteConfirm = (uid) =>  {
    this.props.dispatch({
      type: 'user/removeUser',
      payload: {
        id: uid,
      },
      callback: () => {
        this.refreshTable();
        message.success('用户删除成功！');
      },
    });
  };

  // --------------  编辑用户信息   -------------//
  handleEditUser = (record, e) => {
    if(e) e.preventDefault();
    this.props.dispatch({
      type: 'user/fetchEditUserData',
      payload: {
        id: record.id,
      },
      callback: () => {
        this.handleUserAddModalVisible();
      },
    });
    // this.props.dispatch(routerRedux.push(`/settings/user-manager/user-add`));

  };


  // --------------  查询Form   -------------//
  handleSearchFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/queryUserList',
      payload: {},
    });
  };

  toggleSearchForm = () => {
    this.setState({
      expandSearchForm: !this.state.expandSearchForm,
    });
  };
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form, user: { userList: {pagination} } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        username: fieldsValue.search_username,
        mobile_phone: fieldsValue.search_mobile_phone,
        per_page: pagination.page_size,
      };
      delete values.search_username;
      delete values.search_mobile_phone;

      this.setState({
        formValues: values,
      }, () => {
        dispatch({
          type: 'user/queryUserList',
          payload: values,
        });
      });
    });
  };

  // --------------  查询Form   -------------//

  // 分页事件
  handleTableChange = (pagination) => {
    const { formValues } = this.state;
    const values = {
      ...formValues,
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.props.dispatch({
      type: 'user/queryUserList',
      payload: values,
    });
  };

  transSex = (value) => {
    switch (value){
      case 0: return '男';
      case 1: return '女';
      default: return '';
    }
  };

  renderUserDetail = () => {
    const { user: { editUserData } } = this.props;
    const roleNames = editUserData.roles.map((role) => {
      return role.name;
    })
    return (
      <Modal
        title="用户详情"
        className={styles.detailModal}
        visible={this.state.detailModal}
        onCancel={() => this.toggleUserDetailModal()}
        onOk={() => this.toggleUserDetailModal()}
        footer={[
          <Button key="resetButton" type="primary" onClick={(e)=>this.handleResetPassword(editUserData.id,e)}>重置密码</Button>,
          <Switch
            key="statusSwitch"
            checkedChildren='启用'
            unCheckedChildren='禁用'
            checked={!editUserData.lock_status}
            onChange={()=>this.handleLockStatusChange(editUserData)}
          />,

        ]}
      >
        <p>帐号：{editUserData.username}</p>
        <p>姓名：{editUserData.full_name}</p>
        <p>性别：{this.transSex(editUserData.sex)}</p>
        <p>手机号：{editUserData.mobile_phone}</p>
        <p>角色：{roleNames.join('、')}</p>
      </Modal>
    );
  };

  renderSimpleSearchForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('search_username')(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('lock_status')(
                <RadioGroup options={statusOptions} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('search_mobile_phone')(<Input placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSearchFormReset}>
                重置
              </Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleSearchForm}>*/}
                {/*展开 <Icon type="down" />*/}
              {/*</a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedSearchForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('search_username')(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('lock_status')(
                <RadioGroup options={statusOptions} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('search_mobile_phone')(<Input placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('department_id')(
                <Select
                  showSearch
                  placeholder="请选择部门"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="1">运营部</Option>
                  <Option value="2">人事部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSearchFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleSearchForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderSearchForm() {
    return this.state.expandSearchForm ? this.renderAdvancedSearchForm() : this.renderSimpleSearchForm();
  }

  render() {
    const { user: { userList, editUserData }, loading, roles: {data: { list }} } = this.props;
    const selectedRows = [];

    // 用户新建
    const parentMethods = {
      userData: editUserData,
      handleCreate: this.handleSubmit,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUserAddModalVisible,
      roleList: list,
    };

    const columns = [
      {
        title: '帐号',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'full_name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render:(val) => {
          return this.transSex(val);
        },
      },
      {
        title: '手机号',
        dataIndex: 'mobile_phone',
      },
      {
        title: '状态',
        dataIndex: 'lock_status',
        render(val) {
          return <Switch checkedChildren='启用' unCheckedChildren='禁用' checked={!val} />
        },
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a href="" onClick={(e) => this.handleEditUser(record, e)}>编辑</a>
            <Divider type="vertical" />
            <a href="" onClick={(e) => this.toggleUserDetailModal(record, e)}>查看</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该用户吗?" onConfirm={()=>this.handleUserDeleteConfirm(record.id)}>
              <a className={styles.tableListDelete} href="#">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="运营商用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              needRowSelection={false}
              needShowSelect={false}
              loading={loading}
              data={userList}
              columns={columns}
              onChange={this.handleTableChange}
              rowKey="id"
            />
          </div>
          <div className={styles.tableListForm}>{this.renderUserDetail()}</div>
          <CreateUserForm {...parentMethods} modalVisible={this.state.createModalVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
