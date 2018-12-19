import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Alert,
  Button,
  Row,
  Col,
  Icon,
  Modal,
  Divider,
  message,
  Tabs,
} from 'antd';
import classNames from 'classnames';
import StandardTable from '../../components/StandardTable/index';
import { getTableParams } from '../../utils/componentUtil';
import { DateFormat, dateAdd, StringToDate, formatMoney } from '../../utils/utils';
import styles from '../Balance/PersonalBalance.less';

@connect(({ personalBalance, loading }) => ({
  personalBalance,
  loading: loading.models.personalBalance,
}))
export default class Alarms extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows:[],
      selectedUnBalanced: {},
      dateList: [],
      selectedDate: '',
      selectedType: '1',
      lastUnBalanceDate: '',
      canBalance: true,
      balanceAmount: {},
      currentOrder: {},
      modalVisible: false,
      confirmLoading: false,
      mModalVisible: false,
      mConfirmLoading: false,
    };

  }

  componentDidMount() {
    this.initDate();
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.personalBalance.data.pagination : pagination;
    const { selectedDate, selectedType } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    return {
      ...tableParams,
      reconciliation_date: selectedDate,
      payment_type: selectedType,
    };
  };

  initDate(){
    const { dispatch } = this.props;

    dispatch({
      type: 'personalBalance/fetchUnBalancedDate',
      payload: {casher_id: global.currentUser.id },
      callback: (result) => {
        if (result){
          const dateList = [];
          const lastUnBalancedDate = StringToDate(result);
          const currentDate = new Date();

          const maxDate = dateAdd(lastUnBalancedDate, 'd', 7);
          if(maxDate > currentDate){
            for(let i=-7; i<1; i+=1){
              const date = dateAdd(currentDate, 'd', i);
              if(date < currentDate){
                dateList.push(DateFormat(date, 'yyyy-MM-dd'))
              }else{
                break;
              }
            }
          }else{
            for(let i=-1; i<7; i+=1){
              const date = dateAdd(lastUnBalancedDate, 'd', i);
              if(date < currentDate){
                dateList.push(DateFormat(date, 'yyyy-MM-dd'))
              }else{
                break;
              }
            }
          }
          const lastDateStr = DateFormat(lastUnBalancedDate, 'yyyy-MM-dd');
          this.setState({
            dateList,
            selectedDate: lastDateStr,
            lastUnBalanceDate: lastDateStr,
            canBalance: true,
          }, () => {
            this.searchData();
          })
        }
      },
    });
  }

  searchAmountData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personalBalance/fetchDayBalancedAmount',
      payload: {
        date_from: this.state.selectedDate,
        date_to: this.state.selectedDate,
        casher_id: global.currentUser.id,
      },
      callback: (result) => {
        this.setState({
          balanceAmount: result,
        });
      },
    });
  };

  refreshTable = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'personalBalance/fetch',
      payload: params,
    });
    this.setState({
      currentOrder: {},
      selectedRows: [],
    });
  };

  searchData = () => {
    const { data: { pagination } } = this.props.personalBalance;
    this.refreshTable({current:1, page_size:pagination.page_size});
    this.searchAmountData();
  };

  refreshCurrentPage = () => {
    this.refreshTable();
    this.searchAmountData();
  };

  checkDate = (selectedDate) => {
    const { lastUnBalanceDate} = this.state;
    const selectedDateD = StringToDate(selectedDate);
    const lastUnBalanceDateD = StringToDate(lastUnBalanceDate);
    if(selectedDateD > lastUnBalanceDateD){
      return false;
    }
    return true;
  };

  showWarnMessage = () => {
    const { lastUnBalanceDate} = this.state;
    message.warn(`请按照日期顺序进行对账，当前对账起始日期：${lastUnBalanceDate}`);
  };

  handleClickDate = (date) => {
    this.setState({
      selectedDate: date,
      currentOrder: {},
      canBalance: this.checkDate(date),
    }, () => {
      this.searchData();
    })
  };

  handleSelectRow = (selectedRows) => {
    this.setState({
      selectedRows: [...selectedRows],
    })
  };

  changeTab = (activeKey) => {
    //  0:微信支付;1:现金收缴;2:pos收缴;3:转账
    this.setState({
      selectedType: activeKey,
    }, this.searchData)
  };

  goPreDate = () => {
    const dateList = [...this.state.dateList];
    const firstDate = DateFormat(dateAdd(StringToDate(dateList[0]), 'd', -1), 'yyyy-MM-dd');
    dateList.unshift(firstDate);
    dateList.pop();
    this.setState({
      dateList: [...dateList],
    })
  };

  goNextDate = () => {
    const dateList = [...this.state.dateList];
    const lastDate = dateAdd(StringToDate(dateList[dateList.length-1]), 'd', 1);
    if (lastDate > new Date()) return;
    const lastDateStr = DateFormat(lastDate, 'yyyy-MM-dd');
    dateList.push(lastDateStr);
    dateList.shift();
    this.setState({
      dateList: [...dateList],
    })
  };

  openCheckModal = (record, e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'personalBalance/fetchOrder',
      payload: { id:record.id },
      callback: (result) => {
        this.setState({
          currentOrder: {
            ...result,
          },
          modalVisible: true,
        });
      },
    });

  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  openMModal = (e) => {
    e.preventDefault();

    if(!this.state.canBalance){
      this.showWarnMessage();
      return;
    }

    const bList = this.state.selectedRows.filter((data) => {
      return data.reconciliation_status === 0
    });
    if(bList === undefined || bList.length < 1){
      message.warn('请选择未对账记录！');
      return
    }

    let paymentAmountTotal = 0;
    let receiveAmountTotal = 0;
    let tradeNos = '';
    bList.forEach((data) => {
      paymentAmountTotal += parseFloat(data.payment_amount);
      receiveAmountTotal += parseFloat(data.receive_amount);
      tradeNos += `${data.trade_no}、`;
    });
    paymentAmountTotal = paymentAmountTotal.toFixed(2);
    receiveAmountTotal = receiveAmountTotal.toFixed(2);
    tradeNos = tradeNos.substring(0, tradeNos.length - 1);

    this.setState({
      mModalVisible: true,
      selectedUnBalanced: {
        rows: bList,
        paymentAmountTotal,
        receiveAmountTotal,
        tradeNos,
      },
    });
  };

  closeMModal = () => {
    this.setState({
      mModalVisible: false,
      selectedUnBalanced: {},
    });
  };

  callBalance = (ids) => {
    this.setState({
      confirmLoading: true,
      mConfirmLoading: true,
    }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'personalBalance/balancedConfirm',
        payload: { order_ids:  ids},
        callback: (result) => {
          if(result.confirm){
            message.success('操作成功！');
            this.setState({
              modalVisible: false,
              confirmLoading: false,
              mModalVisible: false,
              mConfirmLoading: false,
              selectedRows: [],
              selectedUnBalanced: {},
            });
            this.refreshCurrentPage();
          }
        },
      });
    });
  };

  doCheckBalance = (e) => {
    e.preventDefault();

    if(this.state.canBalance){
      this.callBalance([this.state.currentOrder.id]);
    }else{
      this.showWarnMessage();
    }
  };

  doCheckBalanceAll = (e) => {
    e.preventDefault();
    const bList = this.state.selectedUnBalanced.rows.map((data) => {
      return data.id;
    });
    if(this.state.canBalance){
      this.callBalance(bList);
    }else{
      this.showWarnMessage();
    }
  };

  renderHeaderContent = () => {
    return (
      <div style={{width:'100%', paddingLeft:'32px', paddingRight:'32px', position:'relative'}}>
        <span className={styles.leftArrow}><Icon type="left" style={{cursor:'pointer'}} onClick={this.goPreDate} /></span>
        <span className={styles.rightArrow}><Icon type="right" style={{cursor:'pointer'}} onClick={this.goNextDate} /></span>
        <Row gutter={8} >
          { this.state.dateList.length > 0 ?
            this.state.dateList.map((item) => {
              let divClass = classNames(styles.dateDiv);
              if(this.state.selectedDate === item){
                divClass = classNames(styles.dateDiv, styles.selectedDate);
              }else if(this.state.lastUnBalanceDate > item ){
                divClass = classNames(styles.dateDiv, styles.finishedDate);
              }
              return <Col span={3} key={item}><div className={divClass} onClick={() => this.handleClickDate(item)}>{item}</div></Col>
            }) :
            <div /> }
        </Row>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;
    const { personalBalance: { data }, loading } = this.props;
    const { selectedRows, selectedUnBalanced, selectedDate, balanceAmount, modalVisible, confirmLoading, currentOrder, mModalVisible, mConfirmLoading, canBalance } = this.state;

    const unBalancedNum = selectedRows.filter((item) => {
      return item.reconciliation_status === 0
    }).length;
    const total = (selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.receive_amount);
    }, 0)).toFixed(2);

    const columns = [
      {
        title: '收据ID',
        dataIndex: 'trade_no',
        // width: '24%',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        // width: '10%',
        render: (text) => {
          return text.substring(11, text.length - 3);
        },
      },
      {
        title: '应收',
        dataIndex: 'payment_amount',
        // width: '10%',
      },
      {
        title: '实收',
        dataIndex: 'receive_amount',
        // width: '10%',
        needTotal: true,
      },
      {
        title: '物业地址',
        dataIndex: 'address',
        // width: '30%',
      },
      {
        title: '收费人',
        dataIndex: 'casher_name',
        // width: '8%',
      },
      {
        title: '操作',
        // width: '8%',
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              {
                record.reconciliation_status === 1 ? (
                  <div className={styles.balancedButton}>
                    <Button type="primary" onClick={(e) => this.openCheckModal(record, e)} size="small">已完成</Button>
                  </div>
                ) : (
                  <div className={styles.unbalancedButton}>
                    <Button type="primary" onClick={(e) => this.openCheckModal(record, e)} size="small">对账</Button>
                  </div>
                )
              }
            </span>
          );
        },
      },
    ];

    return (
      <Card bordered={false} style={{overflow:'auto', marginTop: '30px'}}>
        <div style={{fontSize:'16px', fontWeight:'700', marginBottom:'10px'}}>个人对账</div>
        {this.renderHeaderContent()}
        <Card style={{marginBottom: '15px'}}>
          <Row>
            <Col span={3} className={styles.amountCol}><span style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.647058823529412)'}}>日期</span></Col>
            <Col span={3} className={styles.amountCol}><span style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.647058823529412)'}}>经办总计</span></Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.647058823529412)', width:'16px'}}>现金：</span>
              <span style={{fontSize:'14px', color:'#1890FF', marginLeft: '5px'}}>待对账</span>
              <span style={{fontSize:'20px', color:'#1890FF', marginLeft: '10px'}}>{formatMoney(balanceAmount.unreconciled_cash, '¥ ')}</span>
            </Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.647058823529412)', width:'16px'}}>刷卡：</span>
              <span style={{fontSize:'14px', color:'#1890FF', marginLeft: '5px'}}>待对账</span>
              <span style={{fontSize:'20px', color:'#1890FF', marginLeft: '10px'}}>{formatMoney(balanceAmount.unreconciled_pos, '¥ ')}</span>
            </Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.647058823529412)', width:'16px'}}>扫码：</span>
              <span style={{fontSize:'14px', color:'#1890FF', marginLeft: '5px'}}>待对账</span>
              <span style={{fontSize:'20px', color:'#1890FF', marginLeft: '10px'}}>{formatMoney(balanceAmount.unreconciled_scan, '¥ ')}</span>
            </Col>

            <Col span={3} className={styles.amountCol}><span style={{fontSize:'20px', color:'rgba(0, 0, 0, 0.647058823529412)'}}>{selectedDate}</span></Col>
            <Col span={3} className={styles.amountCol}><span style={{fontSize:'20px', color:'rgba(0, 0, 0, 0.647058823529412)'}}>{formatMoney(balanceAmount.total_handle, '¥ ')}</span></Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '46px'}}>已完成</span>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '10px'}}>{formatMoney(balanceAmount.reconciled_cash, '¥ ')}</span>
            </Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '46px'}}>已完成</span>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '10px'}}>{formatMoney(balanceAmount.reconciled_pos, '¥ ')}</span>
            </Col>
            <Col span={6} className={styles.amountCol}>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '46px'}}>已完成</span>
              <span style={{fontSize:'14px', color:'#4CC2A7', marginLeft: '10px'}}>{formatMoney(balanceAmount.reconciled_scan, '¥ ')}</span>
            </Col>
          </Row>
        </Card>

        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="现金" key="1" />
          <TabPane tab="刷卡" key="2" />
          <TabPane tab="扫码" key="4" />
        </Tabs>

        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                <span>已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项</span>
                <span style={{ marginLeft: 15 }} >
                  待对账 <a style={{ fontWeight: 600 }}>{unBalancedNum}</a> 项
                </span>
                <span style={{ marginLeft: 15, marginRight: 15 }} >总计：&nbsp;¥{total}</span>
                <Button type="primary" onClick={(e) => this.openMModal(e)} size="small">批量对账</Button>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>

        <div className={styles.tableList}>
          <StandardTable
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.refreshTable}
            rowKey='id'
            needRowSelection
            needShowSelect={false}
            onSelectRow={this.handleSelectRow}
            selectedRows={selectedRows}
          />
        </div>
        <Modal
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={this.closeModal}
          footer={null}
          width={1024}
        >
          <Row>
            <Col span={24} className={styles.modalCol} style={{padding: '0 40px'}}><span className={styles.title}>{currentOrder.address}</span></Col>

            <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>业主：{currentOrder.owner_name}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}}><span className={styles.content}>手机：{currentOrder.owner_phone}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingRight: '40px'}}><span className={styles.content}>面积：{currentOrder.area}㎡</span></Col>

            <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}>
              <span className={styles.content}>应收：¥{currentOrder.payment_amount} </span>
              {( ()=>{
                  let percent = 0;
                  switch(currentOrder.payment_status){
                    case 1:percent = 30;break;
                    case 2:percent = 70;break;
                    case 3:percent = 30;break;
                    default: ;
                  }
                  return percent === 0 ? null : <Button type="primary" size="small" style={{backgroundColor:'#bd7b5a', borderColor:'#bd7b5a', cursor:'default'}}>{percent}%</Button>;
                }
              )()}
            </Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}}><span className={styles.content}>实收：¥{currentOrder.receive_amount}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingRight: '40px'}}><span className={styles.content}>状态：{currentOrder.payment_status_name}</span></Col>

            <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>收费员：{currentOrder.casher_name}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}}><span className={styles.content}>方式：{currentOrder.payment_type_label}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingRight: '40px'}}><span className={styles.content}>收据ID：{currentOrder.trade_no}</span></Col>

            <Col span={24} className={styles.modalCol} style={{padding: '0 40px'}}><span className={styles.content}>时间：{currentOrder.order_time}</span></Col>

            <Col span={24} style={{padding:'0 20px'}}><Divider style={{background:'rgba(0, 0, 0, 0.74901961)'}} /></Col>

            <Col span={24} className={styles.modalCol} style={{padding: '0 40px'}}><span className={styles.title2}>对账信息</span></Col>
            {
              currentOrder.reconciliation_status === 1 ? (
                <Fragment>
                  <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>经办人：{currentOrder.reconciliation_user}</span></Col>
                  <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}}><span className={styles.content}>对账时间：{currentOrder.reconciliation_at}</span></Col>
                  <Col span={8} className={styles.modalCol} style={{textAlign:'right', paddingRight:'40px'}}>
                    <Button type="primary" onClick={(e) => {e.preventDefault(); this.closeModal()}} size="small" className={styles.finishedButton} style={{cursor:'default'}}>已完成</Button>
                  </Col>
                </Fragment>
              ) : (
                <Fragment>
                  <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>经办人：{global.currentUser.full_name}</span></Col>
                  <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}} />
                  { canBalance && (
                    <Col span={8} className={styles.modalCol} style={{textAlign:'right', paddingRight:'40px'}}>
                      <Button type="primary" onClick={(e) => this.doCheckBalance(e)} size="small" className={styles.confirmButton}>确认</Button>
                    </Col>
                  )}
                </Fragment>
              )
            }
          </Row>
        </Modal>

        <Modal
          visible={mModalVisible}
          confirmLoading={mConfirmLoading}
          onCancel={this.closeMModal}
          footer={null}
          width={720}
        >
          <Row>
            <Col span={24} className={styles.modalCol} style={{padding: '0 40px'}}><span className={styles.title}>{selectedDate}</span></Col>

            <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>应收合计：¥{selectedUnBalanced.paymentAmountTotal}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}}><span className={styles.content}>实收合计：¥{selectedUnBalanced.receiveAmountTotal}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingRight: '40px'}}><span className={styles.content}>笔数：{selectedUnBalanced.rows ? selectedUnBalanced.rows.length : 0}</span></Col>

            <Col span={24} style={{padding: '0 40px'}}><span style={{fontWeight:600,fontSize:'14px',color:'rgba(0, 0, 0, 0.749019607843137)'}}>收据ID：{selectedUnBalanced.tradeNos}</span></Col>

            <Col span={24} style={{padding:'0 20px'}}><Divider style={{background:'rgba(0, 0, 0, 0.74901961)'}} /></Col>

            <Col span={24} className={styles.modalCol} style={{padding: '0 40px'}}><span className={styles.title2}>对账信息</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '40px'}}><span className={styles.content}>经办人：{global.currentUser.full_name}</span></Col>
            <Col span={8} className={styles.modalCol} style={{paddingLeft: '20px'}} />
            { canBalance && (
              <Col span={8} className={styles.modalCol} style={{textAlign:'right', paddingRight:'40px'}}>
                <Button type="primary" onClick={(e) => this.doCheckBalanceAll(e)} size="small" className={styles.confirmButton}>确认</Button>
              </Col>
            )}
          </Row>
        </Modal>
      </Card>
    );
  }
}
