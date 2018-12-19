import React, { Fragment } from 'react';
import { Layout, message ,Icon} from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';

import HeaderMenu from '../components/HeaderMenu';
import GlobalFooter from '../components/GlobalFooter';
import HomeHeader from '../components/HomeHeader';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';

import styles from './HomeLayout.less';
import { getUserInfo } from '../utils/token';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;


/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class HomeLayout extends React.PureComponent {
  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'user/fetchCurrent',
  //   });
  // }

  onDashboardClick = () =>{
    this.props.dispatch(routerRedux.push(`/dashboard/index`))
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
    }else if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }else if(key==='home'){
      this.props.dispatch(routerRedux.push('/home/index'))
    }
    else{
      this.props.dispatch(routerRedux.push(key));
    }
  };

  render() {
    const {
      fetchingNotices,
      notices,
      routerData,
      // location,
      match,
    } = this.props;

    // 设置全局变量
    if(!global.currentUser) global.currentUser = getUserInfo() || {};

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className={styles.fixedHeader}>
          <HomeHeader
            currentUser={global.currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            onNoticeClear={this.handleNoticeClear}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            onDashboardClick={this.onDashboardClick}
            onMenuClick={this.handleMenuClick}
          >
            <HeaderMenu
              Authorized={Authorized}
              onMenuClick={this.handleMenuClick}
            />
          </HomeHeader>
        </Header>
        <Content style={{margin: '64px 24px 0', paddingTop: '24px'}}>
          <Switch>
            <Redirect exact from="/" to="/home/index" />
            {getRoutes(match.path, routerData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            ))}
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            links={[
            ]}
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> 2018 芯通科技出品
              </Fragment>
            }
          />
        </Footer>
      </Layout>
    );

    return (
      <DocumentTitle title="大兴供暖收费">
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ global, loading }) => ({
  // currentUser: user.currentUser,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  // notices: global.notices,
}))(HomeLayout);

