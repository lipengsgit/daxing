import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import {
  Icon,
  Badge,
  Modal,
  Divider,
  Table,
  Button,
  Card,
} from 'antd';

import DescriptionList from 'components/DescriptionList';
import classNames from 'classnames';
import styles from './index.less';

const { Description } = DescriptionList;

export default class AlarmNotice extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,

      detailModalVisible: false,
      detailData: {},

    };

  };

  toggleAlarmListModal = (e) => {
    e.preventDefault();
    const { onAlarmModalVisibleChange } = this.props;
    this.setState({
      modalVisible: !this.state.modalVisible,
    }, ()=>{
      onAlarmModalVisibleChange(this.state.modalVisible)
    });

  };

  toggleAlarmDetailModal = (record, e) => {
    e.preventDefault();
    this.setState({
      detailModalVisible: !this.state.detailModalVisible,
      detailData: record,
    });

  };

  renderAlarmDetailModal = () => {
    const recordData  = this.state.detailData;
    return (
      <Modal
        key="modal3"
        title="告警详情"
        className={styles.detailModal}
        visible={this.state.detailModalVisible}
        onCancel={(e) => this.toggleAlarmDetailModal({},e)}
        footer={
          <Button type="primary" className={styles.detailModalButton} >设备节点</Button>
        }
      >
        <Card bordered={false}>
          <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
            <Description term="告警类型">{recordData.alarm_category_name}</Description>
            <Description term="告警时间">{recordData.alarm_time}</Description>
            <Description term="告警状态">{recordData.alarm_status_name}</Description>
            <Description term="设备名称">{recordData.device_name}</Description>
            <Description term="所属项目">{recordData.project_name}</Description>
            <Description term="设备位置">{recordData.position_name}</Description>
            <Description term="点名称">{recordData.device_item_name}</Description>
          </DescriptionList>
        </Card>

      </Modal>

    );
  };

  renderAlarmListModal = () => {
    return (
      <Modal
        key="modal1"
        title="告警信息"
        className={styles.detailModal}
        mask={false}
        style={{ top: 65, left: 100 }}
        width={880}
        visible={this.state.modalVisible}
        onCancel={(e) => this.toggleAlarmListModal(e)}
        onOk={(e) => this.toggleAlarmListModal(e)}
        footer={
          <Link to='alarm/alarms/list' className={styles.modalFooter}>
            查看所有告警...
          </Link>
        }
      >
        {this.renderAlarmTable()}
      </Modal>

    );
  };



  renderAlarmTable(){
    const { alarms, loading } = this.props;
    const columns = [
      {
        title: '告警类型',
        dataIndex: 'alarm_category_name',
        width: '15%',
      },
      {
        title: '告警时间',
        dataIndex: 'alarm_time',
        width: '15%',
      },
      {
        title: '告警状态',
        dataIndex: 'alarm_status_name',
        width: '10%',
      },
      {
        title: '设备名称',
        dataIndex: 'device_name',
        width: '15%',
      },
      {
        title: '所属项目',
        dataIndex: 'project_name',
        width: '15%',
      },
      {
        title: '设备位置',
        dataIndex: 'position_name',
        width: '15%',
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => {
          return (
            <span>
              <a className={styles.detailButton} onClick={(e) => this.toggleAlarmDetailModal(record, e)}>详情</a>
            </span>
          );
        },
      },
    ];

    return (
      <Table
        key="table1"
        dataSource={alarms}
        columns={columns}
        rowKey='id'
        loading={loading}
        pagination={false}
      />
    );
  };


  render() {
    const { className, alarmsCount } = this.props;
    const alarmButtonClass = classNames(className, styles.alarmButton);
    return (
      <span className={alarmButtonClass}>
        <span>{this.renderAlarmListModal()}</span>
        <span>{this.renderAlarmDetailModal()}</span>
        <Badge count={alarmsCount} className={styles.badge}>
          <Icon type="warning" style={{color: "red"}} className={styles.icon} onClick={(e) => this.toggleAlarmListModal(e)} />
        </Badge>
      </span>
    );
  }
}
