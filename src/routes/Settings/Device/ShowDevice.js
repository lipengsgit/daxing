import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import {
  Card,
  Row,
  Col,
  Button,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CommonUpload from '../../../components/Uploader/CommonUpload';

@connect(({ deviceManager, loading }) => ({
  deviceManager,
  loading: loading.models.deviceManager,
}))

export default class ShowDevice extends React.Component {

  state = {
    deviceInfo: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
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

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    const projectId = state === undefined ? null : state.projectId;
    dispatch(routerRedux.push({
      pathname: `/settings/devices/search/${projectId}`,
      state,
    }));
  }

  render() {
    const { Description } = DescriptionList;
    const { deviceInfo } = this.state;

    const rowLayout = { gutter: {xs: 8, sm: 16, md: 24} };
    const title = (
      <div style={{color:'red'}}>设备信息</div>
    );

    return (
      <PageHeaderLayout title='查看设备' >
        <Card bordered={false}>
          <DescriptionList col='2' title={title} style={{ marginBottom: 32 }}>
            <Description term="设备名称">{deviceInfo.name}</Description>
            <Description term="设备类型">{deviceInfo.device_category_name}</Description>

            <Description term="代理">{deviceInfo.delegate_name}</Description>
            <Description term="设备型号">{deviceInfo.device_model}</Description>

            <Description term="设备状态">{deviceInfo.status}</Description>
            <Description term="设备编号">{deviceInfo.device_no}</Description>

            <Description term="设备厂家">{deviceInfo.manufacturer}</Description>
            <Description term="厂家电话">{deviceInfo.manufacturer_phone}</Description>

            <Description term="厂家地址">{deviceInfo.manufacturer_address}</Description>
            <Description term="安装日期">{deviceInfo.install_date}</Description>

            <Description term="安装单位">{deviceInfo.install_company}</Description>
            <Description term="设备位置">{deviceInfo.position_name}</Description>

            <Description term="使用年限">{deviceInfo.use_years}</Description>
            <Description term="使用日期">{deviceInfo.use_date}</Description>

            <Description term="质保开始日期">{deviceInfo.quality_start_date}</Description>
            <Description term="质保年限">{deviceInfo.quality_years}</Description>

            <Description term="质保结束日期">{deviceInfo.quality_end_date}</Description>
            <Description term="所属公司">{deviceInfo.company_id}</Description>

            { deviceInfo.folder_no && (
              <Description term="设备资料">
                <CommonUpload folderNo={deviceInfo.folder_no} disabled />
              </Description>
            )}
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
