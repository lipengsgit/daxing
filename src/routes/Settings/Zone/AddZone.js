import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProjectInfoForm from '../../../components/Settings/Project/ProjectInfoForm';

const MyForm = Form.create()(ProjectInfoForm);

@connect(({ zones, loading }) => ({
  zones,
  loading: loading.models.zones,
}))

export default class AddZone extends React.Component {

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'zones/create',
      payload: fieldsValue,
      callback: (response) => {
        if(response.success === true){
          message.success('操作成功');
          this.handleBack();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    dispatch(routerRedux.push({
      pathname: '/settings/zones/list',
      state,
    }));
  };

  render() {
    return (
      <PageHeaderLayout title='新建小区' >
        <Card bordered={false}>
          <MyForm
            operate='add'
            onSubmitForm={this.handleSave}
            onBack={this.handleBack}
            projectInfo={{}}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
