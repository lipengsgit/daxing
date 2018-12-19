import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Layout,
  List,
  Menu,
  Input,
  Button,
} from 'antd';

import styles from './index.less';
import { routerRedux } from 'dva/router';

const {Sider, Content} = Layout;



@Form.create()
@connect(({ devices, loading }) => ({
  devices,
  loading: loading.models.devices,
}))
export default class ProjectTable extends PureComponent {

  state = {
    companyId: 0,
    companyName: '',
    searchText: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'devices/fetchCompanyList',
    });
  }


  // 点击公司查询公司下所有项目
  handleItemClick = (company, e) => {
    e.preventDefault();
    this.setState({
      companyId: company.id,
      companyName: company.company_name,
    });
    this.props.dispatch({
      type: 'devices/queryProjectList',
      payload: {
        company_id: company.id,
      },
    });
  };
  // 分页事件
  handleOnChange = (page, pageSize) => {
    const params = {
      page: page,
      per_page: pageSize,
      company_id: this.state.companyId,
      name: this.state.searchText,
    };
    this.searchFun(params)

  };
  handleOnSizeChange = (page, pageSize) => {
    const params = {
      page: page,
      per_page: pageSize,
      company_id: this.state.companyId,
      name: this.state.searchText,
    };
    this.searchFun(params)

  };
  // 搜索事件
  handleSearch = (value) =>{
    this.setState({
      searchText: value,
    });
    const params = {
      page: 1,
      per_page: 4,
      company_id: this.state.companyId,
      name: value,
    };
    this.searchFun(params)

  };
  searchFun = (params) => {
    this.props.dispatch({
      type: 'devices/queryProjectList',
      payload: params,
    });
  };

  // Card中图片错误事件
  handleImageError = (e) => {
    e.preventDefault();
    e.target.src = 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
  };

  handleClick = (id, e) => {
    e.preventDefault();
    const {redirectUrl} = this.props;
    this.props.dispatch(routerRedux.push(redirectUrl + id))
    // this.props.dispatch(routerRedux.push(`/settings/devices/search/`+id))
  };



  // 项目列表内容渲染
  renderListHeader() {
    return (
      <div className={styles.listHeader}>
        <div>{this.state.companyName}</div>
        <div>
          <Input.Search
            placeholder="请输入项目名称"
            enterButton="搜索"
            onSearch={value => this.handleSearch(value)}
            style={{ width: 300 }}
          />
        </div>
      </div>

    );
  };
  renderCardMetaTitle = (item) => {
    return (
      <div className={styles.cardHeader}>
        <div>{item.name}</div>
        <div>{item.adcode_name}</div>
      </div>

    );
  };
  renderCardMetaDesc = (item) => {
    return (
      <div className={styles.cardMetaDesc}>
        <div>
          {item.summary}
        </div>
        <div className={styles.cardDiv}>
          <span>电话</span>
          <span>{item.phone}</span>
        </div>
        <div className={styles.cardDiv}>
          <span>地址</span>
          <span>{item.address}</span>
        </div>
      </div>

    );
  }


  render() {
    const { devices: { companyList, projectList }, loading } = this.props;

    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      pageSize: projectList.page_size? projectList.page_size: 0,
      total: projectList.total ? projectList.total : 0,
      current: projectList.current,
      onChange: (page, pageSize) => {
        this.handleOnChange(page, pageSize);
      },
      onShowSizeChange:(current, size)=>{
        this.handleOnSizeChange(current, size);
      },
    };




    return (
      <div className={styles.companyList}>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff'}}>
              <Menu
                mode="inline"
              >
                {companyList.map((company) => (
                  <Menu.Item key={company.id}>
                    <div onClick={(e) => this.handleItemClick(company, e)}>{company.company_name}</div>
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }} className={styles.cardList}>
              <List
                header={this.renderListHeader()}
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 4 }}
                dataSource={projectList.rows}
                pagination={pagination}
                loading={loading}
                renderItem={item => (
                  <List.Item>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        <Button className={styles.cardButton} onClick={(e)=>this.handleClick(item.id,e)}>查看</Button>,
                        <Button className={styles.cardButton} onClick={(e)=>this.handleClick(item.id,e)}>详情</Button>,
                      ]}
                    >
                      <Card.Meta
                        avatar={<img alt="" onError={(e)=>this.handleImageError(e)} className={styles.cardAvatar} src={item.logo} />}
                        title={this.renderCardMetaTitle(item)}
                        description={this.renderCardMetaDesc(item)}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Card>

      </div>
    );

  }
}
