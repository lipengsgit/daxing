import React, { PureComponent } from 'react';
import {
  Button, List,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import numeral from 'numeral';
import styles from '../../routes/List/CardList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;

export default class HistoryArrears extends PureComponent {

  renderListItem = (item) =>{
    const unpaidType = item.unpaid_type;
    let amount = item.thirty.payment_amount; // 往年补缴金额
    switch (unpaidType) {
      case 0: // 本年全额
        amount = item.full.payment_amount;
        break;
      case 1: // 本年补缴
        amount = item.seventy.payment_amount;
        break;
      default:
    }
    return (
      <List.Item
        key={item.year}
        actions={unpaidType === -1 ? [<Button type="primary" onClick={() => this.props.handlePay(item)}>{`补交${item.year}年空置暖气费`}</Button>] : []}
      >
        <List.Item.Meta
          title={`￥${numeral(amount).format('0,0.00')}`}
          description={`${item.year}年度暖气费`}
        />
      </List.Item>
    );
  };

  render() {
    const { list, room } = this.props;

    const content = (
      <DescriptionList col={2}>
        <Description term="业主">{room.owner_name}</Description>
        <Description term="面积">{`${room.area}㎡`}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderLayout title={room.address} content={content} >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            dataSource={list}
            renderItem={item => this.renderListItem(item)}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
