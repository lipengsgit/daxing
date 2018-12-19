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

export default class EditZone extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      projectInfo: {},
    };

    const { dispatch } = this.props;
    dispatch({
      type: 'zones/fetchDataInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const projectInfo = {...response.data};
        this.setState({
          projectInfo,
        })
      },
    });
  }

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'zones/update',
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
    const { projectInfo } = this.state;

    return (
      <PageHeaderLayout title='编辑小区' >
        <Card bordered={false}>
          { Object.keys(projectInfo).length > 0 && (
            <MyForm
              operate='edit'
              onSubmitForm={this.handleSave}
              onBack={this.handleBack}
              projectInfo={projectInfo}
            />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
