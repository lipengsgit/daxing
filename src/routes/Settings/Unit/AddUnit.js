import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  message,
  Form,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UnitForm from '../../../components/Settings/Unit/UnitForm';

const MyForm = Form.create()(UnitForm);

@connect(({ units, loading }) => ({
  units,
  loading: loading.models.units,
}))

export default class AddUnit extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      zoneList: [],
    };
    this.props.dispatch({
      type: 'units/fetchZones',
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
      type: 'units/create',
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
      pathname: '/settings/units/list',
      state,
    }));
  };

  render() {
    return (
      <PageHeaderLayout title='新建单元' >
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
