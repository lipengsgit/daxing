import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import logo from 'assets/image/logo.png';
import styles from './index.less';
import { getMenuData } from "../../common/menu";

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class HeaderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = getMenuData();
  }

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      // return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
      return <Menu.Item key={item.path}>{item.name}</Menu.Item>;
    }
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  render() {
    return (
      <div>
        <Menu
          className={styles.menu}
          selectedKeys={[]}
          onClick={this.props.onMenuClick}
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px', float:"left"}}
        >
          <Menu.Item key="app" disabled>
            <img style={{height: '60px'}} src={logo} target="_blank" rel="noopener noreferrer" alt='' />
          </Menu.Item>
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </div>
    );
  }
}
