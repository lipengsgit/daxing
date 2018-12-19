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
import DeviceItemTable from '../../../components/Settings/DeviceItemTable';

const MyForm = Form.create()(DeviceInfoForm);

@connect(({ deviceManager, loading }) => ({
  deviceManager,
  loading: loading.models.deviceManager,
}))

export default class EditDevice extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      deviceInfo: {},
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'deviceManager/fetchTypes',
      payload: { page:1, per_page: 9999 },
    });
    dispatch({
      type: 'deviceManager/fetchDelegates',
      payload: { page:1, per_page: 9999 },
    });
    dispatch({
      type: 'deviceManager/fetchDeviceInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const deviceInfo = {...response.data};
        this.setState({
          deviceInfo,
        })
      },
    });
  }



  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'deviceManager/updateDevice',
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
    const { deviceManager:{deviceTypeList, delegateList, positions} } = this.props;
    const stateOptions = this.props.deviceManager.deviceStates.map(d => { return {label:d.name, value:d.id} });
    const {deviceInfo} = this.state;

    return (
      <PageHeaderLayout title='编辑设备' >
        <Card bordered={false}>
          { Object.keys(deviceInfo).length > 0 && (
            <MyForm
              operate='edit'
              onSubmitForm={this.handleSave}
              onBack={this.handleBack}
              deviceStatesOptions={stateOptions}
              deviceTypeOptions={deviceTypeList}
              delegateOptions={delegateList}
              deviceInfo={deviceInfo}
              positions={positions}
            />
          )}
        </Card>

        <Card bordered={false}>
          <DeviceItemTable data={deviceInfo} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
