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

@connect(({ rooms, loading }) => ({
  rooms,
  loading: loading.models.rooms,
}))

export default class ShowRoom extends React.Component {

  state = {
    dataInfo: {},
  };

  componentDidMount() {
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
  }

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    dispatch(routerRedux.push({
      pathname: '/settings/rooms/list',
      state,
    }));
  };

  render() {
    const { Description } = DescriptionList;
    const { dataInfo } = this.state;

    const rowLayout = { gutter: {xs: 8, sm: 16, md: 24} };
    return (
      <PageHeaderLayout title='单元信息' >
        <Card bordered={false}>
          <DescriptionList col='2' style={{ marginBottom: 32 }}>
            <Description term="名称">{dataInfo.name}</Description>
            <Description term="完整地址">{dataInfo.address}</Description>
            <Description term="业主">{dataInfo.owner_name}</Description>
            <Description term="面积">{dataInfo.area}</Description>
            <Description term="业主电话">{dataInfo.owner_phone}</Description>
            <Description term="业主身份证">{dataInfo.owner_id_card_no}</Description>
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
