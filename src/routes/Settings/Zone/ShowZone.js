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

@connect(({ zones, loading }) => ({
  zones,
  loading: loading.models.zones,
}))

export default class ShowZone extends React.Component {

  state = {
    projectInfo: {},
  };

  componentDidMount() {
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

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    dispatch(routerRedux.push({
      pathname: '/settings/zones/list',
      state,
    }));
  };

  render() {
    const { Description } = DescriptionList;
    const { projectInfo } = this.state;

    const rowLayout = { gutter: {xs: 8, sm: 16, md: 24} };
    return (
      <PageHeaderLayout title='小区信息' >
        <Card bordered={false}>
          <DescriptionList col='2' style={{ marginBottom: 32 }}>
            <Description term="小区名称">{projectInfo.name}</Description>

            <Description term="序号">{projectInfo.sequence}</Description>

            <Description term="地址">{projectInfo.address}</Description>
            <Description term="简介">{projectInfo.summary}</Description>
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
