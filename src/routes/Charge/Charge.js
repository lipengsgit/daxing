import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Modal,
  Row,
  Col,
  Table,
  Input,
  message,
} from 'antd';
import moment from 'moment/moment';
import numeral from 'numeral';
import DescriptionList from 'components/DescriptionList';
import OrderTable from 'components/OrderTable';
import Result from 'components/Result';
import ZoneRadioGroup from '../../components/RadioButtonGroup';
import RoomArrears from '../../components/RoomArrears';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Charge.less';
import ChargeForm from '../../components/ChargeForm';
import InvoiceForm from '../../components/ApplyInvoice';
import { getTableParams } from '../../utils/componentUtil';

const { Search } = Input;
const { Description } = DescriptionList;

@connect(({tradeOrders, zones, rooms, loading }) => ({
  tradeOrders,
  zones,
  rooms,
  roomsLoading: loading.models.rooms,
  ordersLoading: loading.models.tradeOrders,
}))
export default class Charge extends PureComponent {

  state = {
    tableScrollY: window.innerHeight - 243 - 143 - 71,
    searchValue: '',
    roomParams: {
      zone_id: '',
      building_name: '',
      unit_name: '',
      room_name: '',
    },
  };

  componentWillMount() {
    const { dispatch } = this.props;
    this.queryTradeOrders();
    dispatch({
      type: 'zones/fetch',
      payload: { per_page: 999 },
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.tradeOrders.data.pagination : pagination;
    const tableParams = getTableParams(p, filtersArg, sorter);
    return {
      ...tableParams,
      per_page: '20',
      status: '1',
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    };
  };

  // 根据楼栋单元房号搜索
  handleSearch = (value) => {
    if (value !== '' && value !== undefined) {
      const searchValues = value.split('-');
      let nextValue = value;
      if(searchValues.length < 3){
        nextValue += '-';
      }
      const [building, unit, room] = searchValues;
      this.setState({
        searchValue: nextValue,
        roomParams: {
          ...this.state.roomParams,
          building_name: building === undefined ? '' : building,
          unit_name: unit === undefined ? '' : unit,
          room_name: room === undefined ? '' : room,
          page: 1,
        },
      }, () => this.queryRooms());
    }
  };

  searchChange = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  clearRoomParams = () => {
    this.setState({
      roomParams: {
        ...this.state.roomParams,
        building_name: '',
        unit_name: '',
        room_name: '',
        page: 1,
      },
    }, () => this.queryRooms());
  };

  // 根据小区名称搜索事件
  handleDomainSearch = (e) => {
    if (typeof e === 'object') {
      this.setState({
        roomParams: {
          ...this.state.roomParams,
          zone_id: e.target.value,
          page: 1,
        },
      }, () => this.queryRooms());
    }
  };

  // 分页事件
  handleRoomTableChange = (pagination) => {
    this.setState({
      roomParams: {
        ...this.state.roomParams,
        page: pagination.current,
      },
    }, () => this.queryRooms());
  };

  // 房间列表查询
  queryRooms = () => {
    this.props.dispatch({
      type: 'rooms/fetch',
      payload: this.state.roomParams,
    });
  };

  // 查询当天流水
  queryTradeOrders = () => {
    const params = {
      casher_id: global.currentUser.id,
      per_page: '20',
      status: '1',
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    };
    this.props.dispatch({
      type: 'tradeOrders/fetchOrders',
      payload: params,
    });
  };

  // 查询当前待缴费房屋信息
  unpaidRoomInfo = (record) => {
    if(record && record.id !== '' && record.id !==null) {
      this.props.dispatch({
        type: 'rooms/setRoomInfo',
        payload: record ,
      });
      this.clearUnpaidInfo();
      this.clearUnpaidList();
      this.props.dispatch({
        type: 'rooms/fetchUnpaidRoomInfo',
        payload: { room_id: record.id },
      });
    }
  };

  clearUnpaidList = () => {
    this.props.dispatch({
      type: 'rooms/clearUnpaidList',
    })
  };

  clearUnpaidInfo = () => {
    this.props.dispatch({
      type: 'rooms/clearUnpaidInfo',
    })
  };

  prePay = (unpaidInfo) => {
    this.props.dispatch({
      type: 'rooms/prePay',
      payload: unpaidInfo,
    })
  };

  pay = (formValues) => {
    this.props.dispatch({
      type: 'tradeOrders/create',
      payload: formValues,
    })
  };

  handleSendMessage = (selectedOrder) => {
    this.props.dispatch({
      type: 'tradeOrders/sendByPhone',
      payload: {
        order_id:selectedOrder.id,
        phone:selectedOrder.phone,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('发送短信成功');
        }else{
          message.success('发送短信失败')
        }
      },
    });
  };

  handleAddInvoice = (fields) => {
    this.props.dispatch({
      type: 'tradeOrders/applicationInvoice',
      payload: fields,
      callback: (response) => {
        if (response.success === true){
          message.success('申请发票成功');
        }else{
          message.success('申请发票失败');
        }
        this.clearPayResult();
        this.clearUnpaidInfo();
        this.clearUnpaidList();
        this.handleStandardTableChange();
      },
    });
  };

  handleRefund = (orderId) => {
    this.props.dispatch({
      type: 'tradeOrders/refundButton',
      payload: {
        id: orderId,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('退款成功');
        }else{
          const errorMessage = response.error_msg ? response.error_msg : '退款失败';
          message.error(errorMessage);
        }
        this.handleStandardTableChange();
      },
    })
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'tradeOrders/fetchOrders',
      payload: params,
    });
  };

  orderConfirm() {
    const {
      rooms: { roomInfo, hasUnpaid },
      tradeOrders: { payResult },
    } = this.props;
    const description = (
      <div style={{ textAlign: 'left' }}>
        <DescriptionList size="large" col={1}>
          <Description term="房屋地址">{payResult.name}</Description>
          <Description term="年度">{`${payResult.year}年度`}</Description>
        </DescriptionList>
        <DescriptionList size="large" col={2} style={{marginTop: '16px'}}>
          <Description term="手机号">{`${payResult.phone}`}</Description>
          <Description term="支付方式">{`${payResult.payment_type_label}`}</Description>
          <Description term="交费类型">{`${payResult.amount_type_label}`}</Description>
          <Description term="应收">{`￥${numeral(payResult.payment_amount).format('0,0.00')}`}</Description>
          <Description term="实收">{`￥${numeral(payResult.receive_amount).format('0,0.00')}`}</Description>
          <Description term="手续费">{`￥${numeral(payResult.service_charge).format('0,0.00')}`}</Description>
          <Description term="收费人">{`${payResult.casher === null ? '公众号' : payResult.casher.full_name}`}</Description>
        </DescriptionList>
        <DescriptionList size="large" col={1} style={{marginTop: '16px'}}>
          <Description term="备注">{`${payResult.remark}`}</Description>
        </DescriptionList>
      </div>
    );
    const content = (
      <Result
        type="success"
        title={`单号：${payResult.trade_no}`}
        description={description}
      />
    );
    const cancel = () => {
      this.clearPayResult();
      if(hasUnpaid) {
        this.unpaidRoomInfo(roomInfo);
      } else {
        this.clearUnpaidInfo();
      }
      this.queryRooms();
      this.queryTradeOrders();
    };
    return (
      <Modal
        title='缴费成功'
        visible
        onCancel={() => cancel()}
        onOk={()=>this.applyInvoiceModal(true)}
        okText='去开发票'
        cancelText='关闭'
        maskClosable={false}
        width={680}
      >
        {content}
      </Modal>
    );
  };

  // 设置发票form 状态
  applyInvoiceModal = (flag) =>{
     this.props.dispatch({
       type: 'rooms/setApplyInvoice',
       payload: flag,
     });
  };
  // 开发票表单
  invoiceForm = (payResult,roomInfo) => {
    return (
      <InvoiceForm
        roomInfo={roomInfo}
        payResult={payResult}
        handleModalVisible={() => this.applyInvoiceModal(false)}
        handleAdd={(values) => this.handleAddInvoice(values)}
      />
    )
  };

  clearPayResult = () => {
    this.props.dispatch({
      type: 'tradeOrders/clearPayResult',
    });
  };

  // 欠费列表
  roomArrearsModal(roomInfo, unpaidList) {
    return (
      <Modal
        visible
        onCancel={() => this.clearUnpaidList()}
        footer={null}
        maskClosable={false}
      >
        <RoomArrears list={unpaidList} room={roomInfo}  handlePay={(item) => this.prePay(item)} />
      </Modal>
    )
  }

  // 缴费表单
  roomPayModal = (roomInfo, unpaidInfo) =>{
    return (
      <ChargeForm
        payInfo={unpaidInfo}
        room={roomInfo}
        onCancel={() => this.clearUnpaidInfo()}
        handleSubmit={(values) => this.pay(values)}
      />
    )
  };

  renderRoomsTable() {
    const { rooms: { data: { list, pagination } }, roomsLoading } = this.props;
    const columns = [
      {
        title: '住址',
        dataIndex: 'address',
        width: '60%',
      },

      {
        title: '姓名',
        dataIndex: 'owner_name',
        width: '20%',
      },

      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            {record.has_unpaid_info ? <a onClick={() => this.unpaidRoomInfo(record)}>缴费</a> : <a>已缴费</a>}
          </Fragment>
        ),
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={pagination}
          loading={roomsLoading}
          rowKey='id'
          scroll={{ x: '100%', y: (this.state.tableScrollY - 68) }}
          onChange={this.handleRoomTableChange}
        />
      </div>
    );
  }

  render() {
    const {
      tradeOrders: { data: tradeOrdersData, payResult },
      zones: { data: { list } },
      rooms: { unpaidList, hasUnpaid, roomInfo, unpaidInfo ,applyInvoiceVisible},
      ordersLoading } = this.props;
    const { searchValue } = this.state;
    const hasPayResult = payResult !== undefined && payResult !== null && Object.keys(payResult).length !== 0;
    const hasUnpaidInfo = unpaidInfo !== undefined && unpaidInfo !== null && Object.keys(unpaidInfo).length !== 0;
    return (
      <PageHeaderLayout title="现场收费">
        <Row gutter={24}>
          <Col span={10}>
            <Card bordered={false} title="收费筛选" style={{ height: 'calc(100vh - 243px)' }}>
              <ZoneRadioGroup data={list} onChange={this.handleDomainSearch} defaultValue={this.state.roomParams.zone_id} />
              <Search
                className={styles.extraContentSearch}
                placeholder="楼栋-单元-房号 回车"
                onSearch={value => this.handleSearch(value)}
                value={searchValue}
                onChange={this.searchChange}
              />
              <div>
                <div style={{ marginTop: 10 }}>{this.renderRoomsTable()}</div>
              </div>
            </Card>
          </Col>
          <Col span={14}>
            <Card bordered={false} style={{ height: 'calc(100vh - 243px)' }} title="当日收费流水单">
              <OrderTable
                data={tradeOrdersData}
                loading={ordersLoading}
                onTableChange={this.handleStandardTableChange}
                simpleTable
                handleSendMessage={this.handleSendMessage}
                handleRefund={this.handleRefund}
                handleAddInvoice={this.handleAddInvoice}
                openInvoice
                scroll={{ x: '100%', y: (this.state.tableScrollY - 48) }}
              />
            </Card>
          </Col>
          { !hasPayResult && hasUnpaid && !hasUnpaidInfo && this.roomArrearsModal(roomInfo, unpaidList) }
          { !hasPayResult && hasUnpaidInfo && this.roomPayModal(roomInfo, unpaidInfo) }
          { hasPayResult && this.orderConfirm() }
          { applyInvoiceVisible && this.invoiceForm(payResult,roomInfo)}
        </Row>
      </PageHeaderLayout>
    );
  }
}
