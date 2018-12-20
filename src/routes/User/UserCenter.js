import React, { PureComponent,Fragment } from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import {Row, Col, Card, List, Avatar, Table} from 'antd';

import {Radar} from 'components/Charts';
import EditableLinkGroup from 'components/EditableLinkGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './UserCenter.less';

const links = [
  {
    title: '操作一',
    href: '',
  },
  {
    title: '操作二',
    href: '',
  },
  {
    title: '操作三',
    href: '',
  },
  {
    title: '操作四',
    href: '',
  },
  {
    title: '操作五',
    href: '',
  },
  {
    title: '操作六',
    href: '',
  },
];

const members = [
  {
    id: 'members-1',
    title: '科学搬砖组',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    link: '',
  },
  {
    id: 'members-2',
    title: '程序员日常',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
    link: '',
  },
  {
    id: 'members-3',
    title: '设计天团',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
    link: '',
  },
  {
    id: 'members-4',
    title: '中二少女团',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
    link: '',
  },
  {
    id: 'members-5',
    title: '骗你学计算机',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    link: '',
  },
];

@connect(({project, activities, tradeOrders,user,loading}) => ({
  project,
  activities,
  tradeOrders,
  user,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
export default class UserCenter extends PureComponent {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/queryUser',
    });
    // 查询代办任务
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });

    // 查询历史累计收费
    dispatch({
      type: 'tradeOrders/fetchHistoryPay',
    });
    // 查询实时现金 待对账 可归转
    dispatch({
      type: 'tradeOrders/fetchRealCash',
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  // 任务处理
  handle = (id) => {
    alert(id)
    this.props.dispatch(routerRedux.push('/workOrder/pc_form/openUp_list'));
  }

  renderActivities() {
    const {activities: {list}} = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  // 收费统计
  renderTableList() {
    const {tradeOrders: {historyData}} = this.props;
    const payType = ['cash','scan','pos','total'] // 现金，扫码，刷卡，总计
    const itemList=[];
    payType.map((key) =>{
      switch (key){
        case 'cash' : return itemList.push({
          paytype: '现金',
          receive: historyData.confirmed_cash,
          entered: historyData.entered_cash,
          percentage:historyData.cash_confirmed_percentage,
        })
        case 'scan' : return itemList.push({
          paytype: '扫码',
          receive: historyData.confirmed_scan,
          entered: historyData.entered_scan,
          percentage:historyData.scan_confirmed_percentage,
        });
        case 'pos' : return itemList.push({
          paytype: '刷卡',
          receive: historyData.confirmed_pos,
          entered: historyData.entered_pos,
          percentage:historyData.pos_confirmed_percentage,
        });
        case 'total' : return itemList.push({
          paytype: '总计',
          receive: historyData.confirmed_transfer,
          entered: historyData.entered_transfer,
          percentage:historyData.transfer_confirmed_percentage,
        });
        default:return false
      }
      }


    )
    const columns = [
      {
        title: '缴费方式',
        dataIndex: 'paytype',

      },
      {
        title: '实收合计',
        dataIndex: 'receive',

      },
      {
        title: '入账合计',
        dataIndex: 'entered',

      },
      {
        title: '比例',
        dataIndex: 'percentage',

      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={itemList}
          pagination={false}
          size="middle"

        />,
      </div>
    );
  }

render() {
    const {
      project: {notice},
      tradeOrders:{cashStatistics},
      projectLoading,
      activitiesLoading,
      user:{userSelf},
    } = this.props;


      const hour = new Date().getHours()
      let seeHello='早上好';
      if(hour < 6){seeHello="凌晨好"}
      else if (hour < 9){seeHello="早上好"}
      else if (hour < 12){seeHello="上午好"}
      else if (hour < 14){seeHello="中午好"}
      else if (hour < 18){seeHello="下午好"}
      else if (hour < 19){seeHello="傍晚好"}
      else if (hour < 22){seeHello="晚上好"}
      else {seeHello="夜里好"}


    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{seeHello}，{userSelf.full_name}，祝你开心每一天！</div>
          <div>{userSelf.full_name} | {userSelf.roles !== undefined ? userSelf.roles[0].name : ''}</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>账号状态</p>
          <p>{userSelf.lock_status === true ? '异常' : '正常'}</p>
        </div>
        <div className={styles.statItem}>
          <p>团队内排名</p>
          <p>
            {userSelf.rank !==undefined ? userSelf.rank.rank :''}
            <span> /{userSelf.rank !==undefined ? userSelf.rank.total :''}</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>收费次数</p>
          <p>{userSelf.order_count}</p>
        </div>
      </div>
    );


    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{marginBottom: 24}}
              title="任务代办"
              bordered={false}
              /* extra={<Link to="/">全部项目</Link>} */
              loading={projectLoading}
              bodyStyle={{padding: 0}}
            >
              {notice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{padding: 0}} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo}/>
                          {/*  <Link to={item.href}>{item.title} </Link> */}
                          <span style={{fontSize: 14, marginLeft: 12, verticalAlign: 'top'}}>{item.title}</span>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                    <div className={styles.u52}>
                      {item.status === '1' ?
                        (
                          <div>
                            <div className={styles.u53_img} />
                            <div className={styles.u52_text}>
                              <p><span>已完成</span></p>
                            </div>
                          </div>
                        )
                        : (
                          <div>
                            <div className={styles.u52_img} />
                            <div className={styles.u52_text}>
                              <p><span onClick={() => this.handle(item.id)}>处理</span></p>
                            </div>
                          </div>
                        )}
                    </div>

                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{padding: 0}}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{marginBottom: 24}}
              title="实时现金 （收费类）"
              bordered={false}
              bodyStyle={{padding: 0}}
            >

              <div style={{marginLeft: 20, marginTop: 20}}>
                <div id="u132_text">
                  <p style={{fontSize: 14}}><span>我的现金（待对账+可归转）</span></p>
                  <p style={{fontSize: 18}}><span>¥{cashStatistics.current_cash}</span></p>
                </div>

                <div id="u133_text">
                  <p><span>待对账</span></p>
                  <p style={{fontSize: 18}}><span style={{color: '#1890FF'}}>¥{cashStatistics.total_unchecked}</span></p>
                </div>

                <div id="u132_text">
                  <p style={{fontSize: 14}}><span>可归转/可入账</span></p>
                  <p style={{fontSize: 18}}><span>¥{cashStatistics.total_checked}</span></p>
                </div>

                <div id="u134_text">
                  <p style={{fontSize: 14}}><span>入账中（待财务审核入账）</span></p>
                  <p style={{fontSize: 18}}><span>¥{cashStatistics.total_entered}</span></p>
                </div>
              </div>

            </Card>
            <Card
              style={{marginBottom: 24}}
              bordered={false}
              title="历史累计(收费类)"
              //  loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                {this.renderTableList()}
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
