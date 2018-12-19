import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DeviceInfoForm from '../../../components/Settings/Device/DeviceInfoForm';

const MyForm = Form.create()(DeviceInfoForm);

@connect(({ deviceManager, loading }) => ({
  deviceManager,
  loading: loading.models.deviceManager,
}))

export default class AddDevice extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceManager/fetchTypes',
      payload: { page:1, per_page: 9999 },
    });
    dispatch({
      type: 'deviceManager/fetchDelegates',
      payload: { page:1, per_page: 9999 },
    });
  }

  handleSave = (fieldsValue, positionName) => {
    this.props.dispatch({
      type: 'deviceManager/saveDevice',
      payload: fieldsValue,
      callback: (response) => {
        if(response.success === true){
          message.success('操作成功');
          this.goEdit(response.data.id, positionName);
        }else{
          message.success('操作失败');
        }
      },
    });
  }

  goEdit = (id, positionName) => {
    const { dispatch, location: {state} } = this.props;
    state.positionName = positionName;
    dispatch(routerRedux.push({
      pathname: `/settings/devices/edit/${id}`,
      state,
    }));
  }

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    const projectId = state === undefined ? null : state.projectId;
    dispatch(routerRedux.push({
      pathname: `/settings/devices/search/${projectId}`,
      state,
    }));
  }

  render() {
    const { location:{state}, deviceManager:{deviceTypeList, delegateList} } = this.props;
    const deviceInfo = {
      project_id: state === undefined ? null : state.projectId,
      position_id: state === undefined ? null : state.positionId,
      position_name: state === undefined ? null : state.positionName,
    }

    const stateOptions = this.props.deviceManager.deviceStates.map(d => { return {label:d.name, value:d.id} });

    return (
      <PageHeaderLayout title='新增设备' >
        <Card bordered={false}>
          <MyForm
            operate='add'
            onSubmitForm={this.handleSave}
            onBack={this.handleBack}
            deviceStatesOptions={stateOptions}
            deviceTypeOptions={deviceTypeList}
            delegateOptions={delegateList}
            deviceInfo={deviceInfo}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
