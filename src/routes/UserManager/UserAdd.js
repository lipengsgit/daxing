import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Radio,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserAdd.less';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const { Option } = Select;


const sexOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
];

@connect(({ user,loading }) => ({
  editUserData: user.editUserData,
  submitting: loading.effects['user/addUser'],
}))
@Form.create()
export default class UserAdd extends PureComponent {

  state = {
    formValidate: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/addUser',
          payload: {
            userForm: values,
          },
        });
      }
    });
  };

  // 密码校验
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ formValidate: this.state.formValidate || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.formValidate) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  handleUserList = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/settings/user-manager/user-list`));
  };

  render() {
    const { submitting, editUserData } = this.props;
    const { getFieldDecorator } = this.props.form;
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="添加用户" >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }} className={styles.formRequired}>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('nickName', {
                initialValue: editUserData.nickName,
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('mobileNo', {
                initialValue: editUserData.mobileNo,
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                ],
              })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="座机号">
              {getFieldDecorator('phoneNo', {
                initialValue: editUserData.phoneNo,
                rules: [
                  {
                    required: true,
                    message: '请输入座机号',
                  },
                ],
              })(<Input placeholder="请输入座机号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator('sex', {
                initialValue: editUserData.sex,
              })(<Radio.Group options={sexOptions} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="部门">
              {getFieldDecorator('dept',{
                initialValue: editUserData.dept,
              })(
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
            <FormItem {...formItemLayout} label="角色">
              {getFieldDecorator('role')(
                <Select
                  showSearch
                  placeholder="请选择角色"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="1">管理员</Option>
                  <Option value="2">职员</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: '请再次输入密码',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" placeholder="请再次输入密码" onBlur={this.handleConfirmBlur} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleUserList}>返回</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
