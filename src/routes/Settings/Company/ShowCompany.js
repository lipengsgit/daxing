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

@connect(({ companies, loading }) => ({
  companies,
  loading: loading.models.companies,
}))

export default class ShowCompany extends React.Component {

  state = {
    companyInfo: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companies/fetchCompanyInfo',
      payload: { id: this.props.match.params.id },
      callback: (response) => {
        const companyInfo = {...response.data};
        this.setState({
          companyInfo,
        })
      },
    });
  }

  handleBack = () => {
    const { dispatch, location: {state} } = this.props;
    dispatch(routerRedux.push({
      pathname: '/settings/companies/list',
      state,
    }));
  }

  render() {
    const { Description } = DescriptionList;
    const { companyInfo } = this.state;

    const rowLayout = { gutter: {xs: 8, sm: 16, md: 24} };
    const title = (
      <div style={{color:'red'}}>基本信息</div>
    );

    return (
      <PageHeaderLayout title='物业公司信息' >
        <Card bordered={false}>
          <DescriptionList col='2' title={title} style={{ marginBottom: 32 }}>
            <Description term="公司名称">{companyInfo.name}</Description>
            <Description term="公司全称">{companyInfo.company_full_name}</Description>

            <Description term="邮编">{companyInfo.adcode}</Description>
            <Description term="地区">{companyInfo.adcode_name}</Description>

            <Description term="电话号码">{companyInfo.phone}</Description>
            <Description term="地址">{companyInfo.address}</Description>

            <Description term="负责人">{companyInfo.contact_person_name}</Description>
            <Description term="负责人电话">{companyInfo.contact_person_phone}</Description>

            <Description term="简介">{companyInfo.summary}</Description>
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
