import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
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
import ChargeForm from '../../components/ChargeForm';

import {getTableParams} from '../../utils/componentUtil';

const {Search} = Input;


@connect(({tradeOrders, zones, rooms, loading}) => ({
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
    const {dispatch} = this.props;

    dispatch({
      type: 'zones/fetch',
      payload: {per_page: 999},
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
      if (searchValues.length < 3) {
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


  // 选择房屋
  checkRoomInfo = (record) => {
    if (record && record.id !== '' && record.id !== null) {
    const  {selectData}=this.props
      const onChange = this.props.onChange;
      if (onChange) {
        onChange({...record});
      }
      selectData(record);
      /* this.props.dispatch({
        type: 'rooms/setRoomInfo',
        payload: record,
      });
      this.clearUnpaidInfo();
      this.clearUnpaidList();
      this.props.dispatch({
        type: 'rooms/fetchUnpaidRoomInfo',
        payload: {room_id: record.id},
      }); */
    }
  };



  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'tradeOrders/fetchOrders',
      payload: params,
    });
  };

  ;


  clearPayResult = () => {
    this.props.dispatch({
      type: 'tradeOrders/clearPayResult',
    });
  };



  renderRoomsTable() {
    const {rooms: {data: {list, pagination}}, roomsLoading} = this.props;
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
            <a onClick={() => this.checkRoomInfo(record)}>确认选择</a>
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
          scroll={{x: '100%', y: (this.state.tableScrollY - 68)}}
          onChange={this.handleRoomTableChange}
        />
      </div>
    );
  }

  render() {
    const {
      zones: {data: {list}},
      selectVisible,
      handleNewVisible,
    } = this.props;
    const {searchValue} = this.state;

    return (
      <Modal
        visible={selectVisible}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        footer={null}
        width={600}
        onCancel={handleNewVisible}
      //  onOk={this.handleSave}
      >

        <Card bordered={false} title="房源筛选" >
          <ZoneRadioGroup data={list} onChange={this.handleDomainSearch} defaultValue={this.state.roomParams.zone_id} />
          <Search
            placeholder="楼栋-单元-房号 回车"
            onSearch={value => this.handleSearch(value)}
            value={searchValue}
            onChange={this.searchChange}
          />
          <div>
            <div style={{marginTop: 10}}>{this.renderRoomsTable()}</div>
          </div>
        </Card>
      </Modal>
    );
  }
}
