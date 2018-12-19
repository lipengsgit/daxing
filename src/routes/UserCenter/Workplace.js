import React, { PureComponent,Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {Link, routerRedux} from 'dva/router';
import { Row, Col, Card, List, Avatar,Table } from 'antd';

import { Radar } from 'components/Charts';
import EditableLinkGroup from 'components/EditableLinkGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Workplace.less';

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

@connect(({ project, activities, flowSheet, loading }) => ({
  project,
  activities,
  flowSheet,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
export default class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;


    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });

      // 查询历史累计收费
      dispatch({
      type: 'flowSheet/fetchHistoryPay',

    });

    // 查询实时现金 待对账 可归转
     dispatch({
       type:'flowSheet/FetchRealCash',
     });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  // 任务处理
  handle=(id)=>{
  alert(id)
    this.props.dispatch(routerRedux.push('/pc_form/openUp_list'));
}

  renderActivities() {
    const { activities: { list } } = this.props;
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


  renderTableList() {
    const { flowSheet: {historyPayData}, loading } = this.props;
    const columns = [
      {
        title: '缴费方式',
        dataIndex: 'paytype',

      },
      {
        title: '实收合计',
        dataIndex: 'total_receive',

      },
      {
        title: '入账合计',
        dataIndex: 'total_record',

      },
      {
        title: '比例',
        dataIndex: 'bi_column',

  },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={historyPayData.list}
          pagination={false}
          size="middle"

        />,
      </div>
    );
  }


  render() {
    const {
      project: { notice },
      projectLoading,
      activitiesLoading,

    } = this.props;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>

        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，曲丽丽，祝你开心每一天！</div>
          <div>交互专家 | 蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>账号状态</p>
          <p>正常</p>
        </div>
        <div className={styles.statItem}>
          <p>团队内排名</p>
          <p>
            8<span> / 24</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>收费次数</p>
          <p>2,223</p>
        </div>
      </div>
    );



    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="任务代办"
              bordered={false}
             /* extra={<Link to="/">全部项目</Link>} */
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {notice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo} />
                          <Link to={item.href}>{item.title} </Link>

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
                      {item.status==='1' ?
                        (
                          <div>
                            <div  className={styles.u53_img} />
                            <div className={styles.u52_text}>
                              <p><span>已完成</span></p>
                            </div>
                          </div>
                        )
                        :(
                          <div>
                            <div  className={styles.u52_img} />
                            <div className={styles.u52_text}>
                              <p><span onClick={()=>this.handle(item.id)}>处理</span></p>
                            </div>
                          </div>
                        )}

                    </div>


                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
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
              style={{ marginBottom: 24}}
              title="实时现金 （收费类）"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >

              <div style={{marginLeft:20,marginTop:20}}>
                <div id="u132_text" >
                  <p style={{fontSize:14}}><span>我的现金（待对账+可归转）</span></p>
                  <p style={{fontSize:18}}> <span>¥56,877.24</span> </p>
                </div>

                <div id="u133_text">
                  <p ><span>待对账</span></p>
                  <p style={{fontSize:18}}><span style={{color:'#1890FF'}}>¥500.00</span></p>
                </div>

                <div id="u134_text">
                  <p style={{fontSize:14}}><span>可归转（已对账完成的现金）</span></p>
                  <p style={{fontSize:18}}><span>¥40,000.00</span></p>
                </div>
              </div>

            </Card>
            <Card
              style={{ marginBottom: 24 }}
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
