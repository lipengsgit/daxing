import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  Row,
  Col,
  Button,
  Divider,
} from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.models.buildings,
}))

export default class ShowBuilding extends React.Component {

  state = {
    dataInfo: {},
  };

  componentDidMount() {
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
  }

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    dispatch(routerRedux.push({
      pathname: '/settings/buildings/list',
      state,
    }));
  };

  render() {
    const { Description } = DescriptionList;
    const { dataInfo } = this.state;

    const rowLayout = { gutter: {xs: 8, sm: 16, md: 24} };
    return (
      <PageHeaderLayout title='楼栋信息' >
        <Card bordered={false}>
          <DescriptionList col='1' style={{ marginBottom: 32 }}>
            <Description term="名称">{dataInfo.name}</Description>
            <Description term="所属小区">{dataInfo.zon_name}</Description>
            <Description term="简介">{dataInfo.summary}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />

          <Row {...rowLayout}>
            <Col xs={24} sm={24} md={24}>
              <span>
                <Button type="primary" onClick={this.handleBack}>返回</Button>
              </span>
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
