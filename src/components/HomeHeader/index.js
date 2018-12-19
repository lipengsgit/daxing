import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

// import moment from 'moment';
// import groupBy from 'lodash/groupBy';
// import NoticeIcon from '../NoticeIcon';
// import MessageIcon from '../MessageIcon'
import userAvatar from '../../assets/image/userAvatar.png'

export default class HomeHeader extends PureComponent {

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  // getNoticeData() {
  //   const { notices = [] } = this.props;
  //   if (notices.length === 0) {
  //     return {};
  //   }
  //   const newNotices = notices.map(notice => {
  //     const newNotice = { ...notice };
  //     if (newNotice.datetime) {
  //       newNotice.datetime = moment(notice.datetime).fromNow();
  //     }
  //     // transform id to item key
  //     if (newNotice.id) {
  //       newNotice.key = newNotice.id;
  //     }
  //     if (newNotice.extra && newNotice.status) {
  //       const color = {
  //         todo: '',
  //         processing: 'blue',
  //         urgent: 'red',
  //         doing: 'gold',
  //       }[newNotice.status];
  //       newNotice.extra = (
  //         <Tag color={color} style={{ marginRight: 0 }}>
  //           {newNotice.extra}
  //         </Tag>
  //       );
  //     }
  //     return newNotice;
  //   });
  //   return groupBy(newNotices, 'type');
  // }
  //
  // renderNotice = () => {
  //   const {
  //     currentUser,
  //     fetchingNotices,
  //     onNoticeVisibleChange,
  //     onNoticeClear,
  //   } = this.props;
  //   const noticeData = this.getNoticeData();
  //
  //   return (
  //     <NoticeIcon
  //       className={styles.action}
  //       count={currentUser.notifyCount}
  //       onItemClick={(item, tabProps) => {
  //         console.log(item, tabProps); // eslint-disable-line
  //       }}
  //       onClear={onNoticeClear}
  //       onPopupVisibleChange={onNoticeVisibleChange}
  //       loading={fetchingNotices}
  //       popupAlign={{ offset: [20, -16] }}
  //     >
  //       <NoticeIcon.Tab
  //         list={noticeData['通知']}
  //         title="通知"
  //         emptyText="你已查看所有通知"
  //         emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
  //       />
  //       <NoticeIcon.Tab
  //         list={noticeData['消息']}
  //         title="消息"
  //         emptyText="您已读完所有消息"
  //         emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
  //       />
  //       <NoticeIcon.Tab
  //         list={noticeData['待办']}
  //         title="待办"
  //         emptyText="你已完成所有待办"
  //         emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
  //       />
  //     </NoticeIcon>
  //   )
  // };

  render() {
    const {
      children,
      currentUser,
      onMenuClick,
    } = this.props;

    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={onMenuClick}
        theme="dark"
      >
        <Menu.Item key="/ucenter" >
          <Icon type="user" /><span className={styles.menu.text}>个人中心</span>
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" /><span className={styles.menu.text}>退出登录</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.header}>
        { children }

        <div className={styles.right}>
          {/*{this.renderNotice()}*/}
          {/*<MessageIcon
            className={styles.action}
          />*/}
          {currentUser.username ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={userAvatar} />
              <span className={styles.name}>{currentUser.full_name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
