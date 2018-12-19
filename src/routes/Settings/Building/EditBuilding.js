import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProjectInfoForm from '../../../components/Settings/Building/BuildingForm';

const MyForm = Form.create()(ProjectInfoForm);

@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.models.buildings,
}))

export default class EditBuilding extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      dataInfo: {},
      zoneList: [],
    };

    const { dispatch } = this.props;
    dispatch({
      type: 'buildings/fetchDataInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const dataInfo = {...response.data};
        this.setState({
          dataInfo,
        })
      },
    });
    dispatch({
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
      type: 'buildings/update',
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
    const {dataInfo, zoneList} = this.state;

    return (
      <PageHeaderLayout title='编辑楼栋' >
        <Card bordered={false}>
          { Object.keys(dataInfo).length > 0 && (
            <MyForm
              operate='edit'
              onSubmitForm={this.handleSave}
              onBack={this.handleBack}
              dataInfo={dataInfo}
              zoneList={zoneList}
            />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
