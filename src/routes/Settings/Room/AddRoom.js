import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RoomForm from '../../../components/Settings/Room/RoomForm';

const MyForm = Form.create()(RoomForm);

@connect(({ rooms, zones, buildings, units, loading }) => ({
  rooms,
  zones,
  buildings,
  units,
  loading: loading.models.rooms,
}))

export default class AddRoom extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      zoneList: [],
    };
    this.props.dispatch({
      type: 'zones/fetch',
      payload: { page: 1, per_page: 9999 },
      callback: (data) => {
        this.setState({
          zoneList: [...data.list],
        })
      },
    });
  }

  handleSave = (fieldsValue) => {
    this.props.dispatch({
      type: 'rooms/create',
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
      pathname: '/settings/rooms/list',
      state,
    }));
  };

  render() {
    return (
      <PageHeaderLayout title='新建房间' >
        <Card bordered={false}>
          <MyForm
            operate='add'
            onSubmitForm={this.handleSave}
            onBack={this.handleBack}
            dataInfo={{}}
            zoneList={this.state.zoneList}
            dispatch={this.props.dispatch}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
