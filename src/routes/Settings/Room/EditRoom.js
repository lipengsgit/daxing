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

export default class EditRoom extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      dataInfo: {},
      zoneList: [],
    };

    const { dispatch } = this.props;
    dispatch({
      type: 'rooms/fetchDataInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const dataInfo = {...response.data};
        this.setState({
          dataInfo,
        })
      },
    });
    dispatch({
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
      type: 'rooms/update',
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
    const {dataInfo, zoneList} = this.state;

    return (
      <PageHeaderLayout title='编辑房间' >
        <Card bordered={false}>
          { Object.keys(dataInfo).length > 0 && (
            <MyForm
              operate='edit'
              onSubmitForm={this.handleSave}
              onBack={this.handleBack}
              dataInfo={dataInfo}
              zoneList={zoneList}
              dispatch={this.props.dispatch}
            />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
