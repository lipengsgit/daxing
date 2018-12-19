import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Table,
  Radio,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniBar,
  Field,
  Bar,
  Pie,
  CustomPie,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';

import styles from './Index.less';


const rankingListData = {'wechat': '公众号收费',
                         'pos': '线下刷卡',
                         'scan': '线下扫码',
                         'cash': '现金收费'};


const Yuan = ({ children }) => (
  <span dangerouslySetInnerHTML={{ __html: children }} /> /* eslint-disable-line react/no-danger */
);

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Index extends Component {

  state = {
    salesType: 'full',
    Dates: new Date(),

  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }



  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      Dates: new Date(),
    });
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  // 转换已支付户数接口返回的数据
  transferPaidRoomData = (data) => {
    const arrObj = {};
    arrObj.paid_ratio = data.paid_ratio;
    arrObj.unpaid_room = data.unpaid_room;
    arrObj.total_room = data.total_room;
    arrObj.paid_room_count = data.paid_room_count;
    arrObj.paid_room = [];
    if(data.paid_room){
      data.paid_room.map(item => {
        arrObj.paid_room.push({
          x: item.date,
          y: item.count,
        });
      });
    }
    return arrObj;
  };

  // 收费构成数据排序
  sortPaymentTypeData = (data) => {
    const resObj = {};
    if(data){
      delete data.transfer;
      const resArr = Object.keys(data).sort((a, b) => {
        return parseFloat(data[b]) - parseFloat(data[a])
      });
      for(let i = 0; i < resArr.length; i += 1){
        resObj[resArr[i]] = `¥${numeral(data[resArr[i]]).format('0,0')}`;
      }

    }
    return resObj;
  };

  // 各小区缴费比例
  transferPaidByZoneData = (data) => {
    const arr = [];
    if(data){
      data.map(item => {
        arr.push({
          x: item.zone_name,
          y: Math.round(item.proportion*100),
        });
      });
    }
    return arr;
  };

  // 收费额区域占比
  transferAmountByZoneData = (data) => {
    const arrObj = {
      full: [],
      online: [],
      offline: [],
    };
    if(data.full){
      arrObj.full = this.transferDataToXYData(data.full.zones);
    }
    if(data.online){
      arrObj.online = this.transferDataToXYData(data.online.zones);
    }
    if(data.offline){
      arrObj.offline = this.transferDataToXYData(data.offline.zones);
    }
    return arrObj;
  };
  transferDataToXYData = (data) => {
    const resArr = [];
    if(data && data.length > 0){
      data.map(item => {
        resArr.push({
          x: item.name,
          y: item.total,
        });
      });
    }
    return resArr;
  };


  render() {
    const { salesType } = this.state;
    const { chart, loading } = this.props;
    const {
      totalIncomeData, // 统计总收费额
      paidRoomData, // 已支付户数和收费完成率
      fullPaidData, // 全额收费比例
      paidByZoneData, // 各小区缴费比例
      paymentTypeData, // 收费方式构成
      amountByZoneData, // 收费额区域占比
      openProgressData, // 开通进度
    } = chart;

    const transferPaidRoomData = this.transferPaidRoomData(paidRoomData);
    const sortPaymentTypeData = this.sortPaymentTypeData(paymentTypeData);
    const transferPaidByZoneData = this.transferPaidByZoneData(paidByZoneData);
    const transferAmountByZoneData = this.transferAmountByZoneData(amountByZoneData);


    const salesPieData =
      salesType === 'full'
        ? transferAmountByZoneData.full
        : salesType === 'online' ? transferAmountByZoneData.online : transferAmountByZoneData.offline;


    const columns = [
      {
        title: '小区',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: '已开通户数/㎡',
        dataIndex: 'opened_count',
        width: '40%',
        render(val,record) {
          return `${record.opened_count}/${record.opened_area}㎡`;
        },
      },
      {
        title: '待开通户数',
        width: '30%',
        dataIndex: 'to_open_count',
      },
    ];

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    function FormattedDate(props) {
      return <h2>现在是 {props.date.toLocaleTimeString()}</h2>;
    }
    return (
      <Fragment>
        <div>
          <FormattedDate date={this.state.Dates} />
        </div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="总收费额"
              total={() => <Yuan>{`￥${numeral(totalIncomeData.total).format('0,0')}`}</Yuan>}
              footer={<Field label="日均收费额" value={`￥${numeral(totalIncomeData.per_day).format('0,0')}`} />}
              contentHeight={46}
            >
              <Trend flag={totalIncomeData.week_ratio ? (parseFloat(totalIncomeData.week_ratio) > 0 ? "up" : "down") : ''} style={{ marginRight: 16 }}>
                周环比<span className={styles.trendText}>{totalIncomeData.week_ratio ? (`${totalIncomeData.week_ratio}%`) : '--'}</span>
              </Trend>
              <Trend flag={totalIncomeData.day_ratio ? (parseFloat(totalIncomeData.day_ratio) > 0 ? "up" : "down") : ''}>
                日环比<span className={styles.trendText}>{totalIncomeData.day_ratio ? (`${totalIncomeData.day_ratio}%`) : '--'}</span>
              </Trend>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="已支付户数"
              total={numeral(transferPaidRoomData.paid_room_count).format('0,0')}
              footer={
                <div className={styles.field}>
                  <span>未缴费户数约</span>
                  <span className={styles.value}>{transferPaidRoomData.unpaid_room}</span>
                  <span>户</span>
                </div>
              }
              contentHeight={46}
            >
              <MiniBar data={transferPaidRoomData.paid_room} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="收费完成率"
              total={transferPaidRoomData.paid_ratio ? `${parseInt(transferPaidRoomData.paid_ratio*100, 10)}%` : '0'}
              footer={
                <div className={styles.field}>
                  <span>本年度预计总户数</span>
                  <span className={styles.value}>{transferPaidRoomData.total_room ? parseInt(transferPaidRoomData.total_room,10) : ''}</span>
                  <span>户</span>
                </div>
              }
              contentHeight={46}
            >
              <Pie
                animate={false}
                percent={parseFloat(transferPaidRoomData.paid_ratio)*100}
                height={128}
                lineWidth={2}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="全额收费比率"
              total={fullPaidData.full_paid_proportion ? `${parseFloat(fullPaidData.full_paid_proportion)*100}%` : '0'}
              footer={
                <div className={styles.field}>
                  <span>全额</span>
                  <span className={styles.value}>{fullPaidData.full_paid_room ? fullPaidData.full_paid_room : ''}</span>
                  <span>户</span>
                  <span>空置</span>
                  <span className={styles.value}>{fullPaidData.thirty_paid_room ? fullPaidData.thirty_paid_room : ''}</span>
                  <span>户</span>
                </div>
              }
              contentHeight={46}
            >
              <Pie
                animate={false}
                percent={parseFloat(fullPaidData.full_paid_proportion)*100}
                height={128}
                lineWidth={2}
              />
            </ChartCard>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar height={295} title="收费额完成率(%)" data={transferPaidByZoneData} />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>收费方式构成</h4>
                  <ul className={styles.rankingList}>
                    {Object.keys(sortPaymentTypeData).map((item, i) => (
                      <li key={item}>
                        <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                        <span>{rankingListData[item]}</span>
                        <span>{sortPaymentTypeData[item]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{minHeight: 515}}>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title="收费额区域占比"
              bodyStyle={{ padding: 24 }}
              style={{ marginTop: 24, minHeight: 515 }}
            >
              <div className={styles.salesCardExtra}>
                <div className={styles.salesTypeRadio}>
                  <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                    <Radio.Button value="full">全部</Radio.Button>
                    <Radio.Button value="online">线上</Radio.Button>
                    <Radio.Button value="offline">线下</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <h4 style={{ marginTop: 8, marginBottom: 32 }}>销售额</h4>
              <CustomPie
                hasLegend
                subTitle="收费额"
                total={
                  () => <Yuan>{`￥${numeral(salesPieData.reduce((pre, now) => now.y + pre, 0)).format('0,0')}`}</Yuan>
                }
                data={salesPieData}
                valueFormat={value => <Yuan>{`￥${numeral(value).format('0,0')}`}</Yuan>}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{minHeight: 509}}>
            <Card
              loading={loading}
              bordered={false}
              className={styles.salesCard}
              title="开通进度"
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <Row>
                <Col sm={8} xs={24} style={{ marginBottom: 24 }} />
                <Col sm={8} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={<span>已开通</span>}
                    total={`${openProgressData.opened ? openProgressData.opened.count : ''}户`}
                    subTotal={openProgressData.opened ? `${(numeral(openProgressData.opened.proportion*100).format('0'))}%` : 0}
                    gap={8}
                  />
                  <span>{openProgressData.opened ? openProgressData.opened.area : 0}㎡</span>
                </Col>

                <Col sm={8} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={<span>待开通</span>}
                    total={`${openProgressData.to_open ? openProgressData.to_open.count : ''}户`}
                    subTotal={openProgressData.to_open ? `${(numeral(openProgressData.to_open.proportion*100).format('0,0'))}%` : 0}
                    gap={8}
                  />
                  <span>{openProgressData.to_open ? openProgressData.to_open.area : 0}㎡</span>
                </Col>
              </Row>
              <Table
                rowKey="name"
                size="small"
                columns={columns}
                dataSource={openProgressData.zones}
                pagination={false}
                scroll={{y:265}}
              />
            </Card>
          </Col>
        </Row>

      </Fragment>
    );
  }
}
