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

export default class EditCompany extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      companyInfo: {},
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'companies/fetchCompanyInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const companyInfo = {...response.data};
        this.setState({
          companyInfo,
        })
      },
    });
  }

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'companies/updateCompany',
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
    const {companyInfo} = this.state;

    return (
      <PageHeaderLayout title='编辑物业公司' >
        <Card bordered={false}>
          { Object.keys(companyInfo).length > 0 && (
            <MyForm
              operate='edit'
              onSubmitForm={this.handleSave}
              onBack={this.handleBack}
              companyInfo={companyInfo}
            />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
