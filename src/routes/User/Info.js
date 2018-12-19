import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Card,
  Button,
  Form,
  Input,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const { Description } = DescriptionList;
@Form.create()
// connect  如果说你的ui里面需要用到model里面的数据的话 那么就可以直接用这个 将model里面的元素 当做props的方式 传递进来
@connect(({ userinfo, loading }) => ({
  userinfo,
  loading: loading.models.userinfo,
}))

export default  class UserInfo extends PureComponent {

  state = {
    visible: false,
    confirmDirty: false,
  };

 // 没有使用系统当前用户 currentUser 重新查询了一次
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userinfo/fetchUser',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'userinfo/submit_change_pwd',
          payload: values,
       // 提交后隐藏
        }).then(() => {
          this.setState({
          visible: false,
        });
        });
      }
    });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码输入不一致!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    const reg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if(value===undefined ||value===''){
      callback()
    }
   else if(value.match(reg)){
      form.validateFields(['confirm'], { force: true });
      callback();
    }else{
      callback('密码不符合规则')
    }
  };


  handleConfirmBlur = (e) => {
    const values = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!values });
  };

  // 取消修改
  cancelForm=()=>{
    this.setState({
      visible:false,
    })
  }

  showModal = () => {
    this.setState({
      visible: true,

    });
  };

  render() {
    const { visible  } = this.state;
    const { form,  loading } = this.props;
    const { getFieldDecorator } = form;
    const { userinfo  } = this.props.userinfo;
    const formItemLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 5 }, // 控制form 输入框长度
      },
    };
    const submitFormLayout = {
      wrapperCol: {
         xs: { span: 24, offset: 0 },
         sm: { span: 10, offset: 3},
      },
    };


    if(visible){
      return (
        <div>
          <PageHeaderLayout
            title="个人信息"
          >
            <Show userinfo={userinfo} />
            <Card  title="修改密码"  bordered >
              <Form onSubmit={this.handleSubmit}  style={{ marginLeft: 8 }}>
                <FormItem {...formItemLayout}  label="用户名" >
                  {getFieldDecorator('username', {
                    initialValue: {userinfo}.username,
                  })(<Input disabled   placeholder={userinfo.username} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="旧密码" >
                  {getFieldDecorator('old_password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入旧密码',
                      },
                    ],
                  })(<Input placeholder="请输入旧密码" />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="新密码"
                >

                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '请输入新密码!',
                    }, {
                     validator: this.checkConfirm,

                    }],
                  })(
                    <Input type="password" placeholder="密码由6-12位字母和数字组成"  onBlur={this.handleConfirmBlur} />
                  )  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="确认新密码"
                >
                  {getFieldDecorator('password_confirmation', {
                    rules: [{
                      required: true, message: '请输入确认密码!',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input type="password"   placeholder="请输入确认密码" onBlur={this.handleConfirmBlur} />
                  )}
                </FormItem>
                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button  type="primary"   loading={loading}  htmlType="submit" >
                    保存
                  </Button>
                  <Button   onClick={this.cancelForm} style={{marginLeft :5}}   >
                    取消
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </PageHeaderLayout>
        </div>
      )
    };
    return (
      <div>
        <PageHeaderLayout
          title="个人信息"
        >
          <Show userinfo={userinfo} />
          <Button  style={{ marginLeft: 10,marginTop:20 }} onClick={this.showModal} type="primary"  >
            修改密码
          </Button>
        </PageHeaderLayout>
      </div>
    );

    function Show(attr){
      const user=attr.userinfo;
      if(user.id !=null){
        return (
          <Card title="基本信息" bordered={false}>
            <DescriptionList col={2} size="large" title="" style={{ marginBottom: 32 }}>
              <Description term="用户名">{user.username}</Description>
              <Description term="性别">{user.sex}</Description>
              <Description term="角色">{user.roles[0].name}</Description>
              <Description term="手机号">{user.mobile_phone}</Description>
              <Description term="座机号">{user.telephone}</Description>
              <Description term="通讯地址">{user.address}</Description>
            </DescriptionList>
          </Card>
        )
      }else{
        return (
          <Card title="基本信息" bordered={false}>
            <DescriptionList col={2} size="large" title="" style={{ marginBottom: 32 }}>
              <Description term="用户名" />
              <Description term="性别" />
              <Description term="角色" />
              <Description term="手机号" />
              <Description term="座机号" />
              <Description term="通讯地址" />
            </DescriptionList>
          </Card>
        )
      }

    }
  }

}




