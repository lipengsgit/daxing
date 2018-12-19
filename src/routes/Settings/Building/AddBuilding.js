import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BuildingForm from '../../../components/Settings/Building/BuildingForm';

const MyForm = Form.create()(BuildingForm);

@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.models.buildings,
}))

export default class AddBuilding extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      zoneList: [],
    };
    this.props.dispatch({
      type: 'buildings/fetchZones',
      payload: { page: 1, per_page: 9999 },
      callback: (data) => {
        this.setState({
          zoneList: [...data],
        })
      },
    });
  }

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'buildings/create',
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
      pathname: '/settings/buildings/list',
      state,
    }));
  };

  render() {
    return (
      <PageHeaderLayout title='新建楼栋' >
        <Card bordered={false}>
          <MyForm
            operate='add'
            onSubmitForm={this.handleSave}
            onBack={this.handleBack}
            dataInfo={{}}
            zoneList={this.state.zoneList}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
