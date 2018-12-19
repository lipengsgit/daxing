import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CompanyInfoForm from '../../../components/Settings/Company/CompanyInfoForm';

const MyForm = Form.create()(CompanyInfoForm);

@connect(({ companies, loading }) => ({
  companies,
  loading: loading.models.companies,
}))

export default class AddCompany extends React.Component {

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'companies/createCompany',
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
      pathname: '/settings/companies/list',
      state,
    }));
  };

  render() {
    return (
      <PageHeaderLayout title='新建物业公司' >
        <Card bordered={false}>
          <MyForm
            operate='add'
            onSubmitForm={this.handleSave}
            onBack={this.handleBack}
            companyInfo={{}}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
