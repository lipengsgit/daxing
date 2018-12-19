import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'mobile',
    phoneNumber: '',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = (beginCountFun) => {
    const { phoneNumber } = this.state;
    const phonePattern = /^1\d{10}$/;
    if(!phonePattern.test(phoneNumber)) return;

    this.props.dispatch({
      type: 'login/checkPhoneNumber',
      payload: {
        mobile_phone: phoneNumber,
      },
      callback: (data) => {
        if(data.present && data.present === true){
          this.props.dispatch({
            type: 'login/getVerificationCode',
            payload: {
              phone_number: phoneNumber,
            },
            callback: () => {
              beginCountFun();
              message.info('验证码已发送！');
            },
          });
        }else{
          message.error('用户不存在！');
        }
      },
    });
  };

  onMobileBlur = (e) => {
    this.setState({
      phoneNumber: e.target.value,
    })
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  renderError = (loginType) => {
    const { login } = this.props;
    return login.status === false &&
      login.type === loginType &&
      !login.submitting &&
      this.renderMessage(login.errorMessage)
  };

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {this.renderError('account')}
            <UserName name="username" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {this.renderError('mobile')}
            <Mobile name="mobile_phone" onBlur={this.onMobileBlur} />
            <Captcha name="verification_code" onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
