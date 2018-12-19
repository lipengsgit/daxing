import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login','chart'], () => import('../layouts/HomeLayout')),
    },
    '/home/index': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Home/Index')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/settings/resources': {
      component: dynamicWrapper(app, ['resources'], () => import('../routes/Settings/Resources')),
    },
    '/settings/roles': {
      component: dynamicWrapper(app, ['roles'], () => import('../routes/Settings/Roles')),
    },
    '/settings/role/resource/:id': {
      component: dynamicWrapper(app, ['roles'], () => import('../routes/Settings/RoleResource')),
    },


    // 2018-05-09 add by: 运营商用户列表
    '/settings/user-manager/user-list': {
      component: dynamicWrapper(app, ['user', 'roles'], () => import('../routes/UserManager/UserList')),
    },
    '/settings/user-manager/user-add': {
      name: 'user-add',
      component: dynamicWrapper(app, ['user'], () => import('../routes/UserManager/UserAdd')),
    },

    // 2018-05-28 add by: 设备管理
    '/settings/devices/list': {
      component: dynamicWrapper(app, ['devices'], () => import('../routes/Settings/Device/Devices')),
    },

    // 2018-06-21 add by: 人员技能管理
    '/settings/techniques/list': {
      component: dynamicWrapper(app, ['techniques'], () => import('../routes/Settings/Techniques')),
    },

    '/settings/devices/search/:id': {
      component: dynamicWrapper(app, ['deviceManager'], () => import('../routes/Settings/Device/DeviceManager')),
    },
    '/settings/devices/add': {
      component: dynamicWrapper(app, ['deviceManager'], () => import('../routes/Settings/Device/AddDevice')),
    },
    '/settings/devices/edit/:id': {
      component: dynamicWrapper(app, ['deviceManager'], () => import('../routes/Settings/Device/EditDevice')),
    },
    '/settings/devices/show/:id': {
      component: dynamicWrapper(app, ['deviceManager'], () => import('../routes/Settings/Device/ShowDevice')),
    },

    // 实时监控
    '/monitor/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Monitor/MonitorIndex')),
    },
    '/monitor/project/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Monitor/MonitorProject')),
    },

    // 实时监控-视频
    '/monitor/video/playView/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Monitor/MonitorVideo/PlayViewIndex')),
    },
    // 实时监控-视频
    '/monitor/video/playView/show/:id': {
      component: dynamicWrapper(app, ['monitorVideo'], () => import('../routes/Monitor/MonitorVideo/PlayView')),
    },
    // 历史回放-视频
    '/monitor/video/playBack/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Monitor/MonitorVideo/PlayBackIndex')),
    },
    // 历史回放-视频
    '/monitor/video/playBack/show/:id': {
      component: dynamicWrapper(app, ['monitorVideo'], () => import('../routes/Monitor/MonitorVideo/PlayBack')),
    },

    // 警告类型管理
    '/alarm/alarmCategories/list': {
      component: dynamicWrapper(app, ['alarmCategories'], () => import('../routes/alarm/AlarmCategories')),
    },
    // 警告列表
    '/alarm/alarms/list': {
      component: dynamicWrapper(app, ['alarms'], () => import('../routes/alarm/Alarms')),
    },

    // 2018 05 个人中心
    '/userinfo/info':{
      component: dynamicWrapper(app, ['userinfo'] ,() => import('../routes/User/Info')),
    },
    // 2018 05 29 设置类型管理
 /*   '/device_management/old':{
      component: dynamicWrapper(app,['equipmentes'] ,()=>import('../routes/Equipment/Test1')),
    }, */
    '/device_management/list':{
      component: dynamicWrapper(app,['equipmentes'] ,()=>import('../routes/Equipment/Equipmentes')),
    },
    '/device_mangement/configure/:id':{
      name: '设备列表名称-配置',
      component: dynamicWrapper(app,['equipmentes'] ,()=>import('../routes/Equipment/ConfigureList')),
    },
    // 2018 05 28 子系统配置
    '/subsystem/list':{
      component: dynamicWrapper( app ,['subsystem'] ,()=>import('../routes/Subsystem/Subsystem')),
    },
    // 2018 09 29 历史订单
    '/tradeOrder/history':{
      component: dynamicWrapper(app,['tradeOrders'] ,()=>import('../routes/HistoryOrder/HistoryOrders')),
    },
    // 9.10 发票页面
    '/pc_form/invoice_list':{
      component: dynamicWrapper(app,['InvoiceColumns'] ,()=>import('../routes/Invoice/InvoiceColumn')),
    },
    // 9.10 工单开通页面
    '/workOrder/pc_form/openUp_list':{
      component: dynamicWrapper(app,['openUp'] ,()=>import('../routes/WorkOrder/OpenUp')),
    },
    //  工单维修页面
    '/workOrder/repairs/repairs_list':{
      component: dynamicWrapper(app,['repairsList','selectHouse'] ,()=>import('../routes/WorkOrder/RepairsList')),
    },
    // 消息管理
    '/message/list': {
      component: dynamicWrapper(app, ['messages'], () => import('../routes/Message/MessageList')),
    },

    // 物业公司管理
    '/settings/companies/list': {
      component: dynamicWrapper(app, ['companies'], () => import('../routes/Settings/Company/Companies')),
    },
    '/settings/companies/add': {
      component: dynamicWrapper(app, ['companies'], () => import('../routes/Settings/Company/AddCompany')),
    },
    '/settings/companies/edit/:id': {
      component: dynamicWrapper(app, ['companies'], () => import('../routes/Settings/Company/EditCompany')),
    },
    '/settings/companies/show/:id': {
      component: dynamicWrapper(app, ['companies'], () => import('../routes/Settings/Company/ShowCompany')),
    },

    // 项目管理
    '/settings/zones/list': {
      component: dynamicWrapper(app, ['zones'], () => import('../routes/Settings/Zone/Zones')),
    },
    '/settings/zones/add': {
      component: dynamicWrapper(app, ['zones'], () => import('../routes/Settings/Zone/AddZone')),
    },
    '/settings/zones/edit/:id': {
      component: dynamicWrapper(app, ['zones'], () => import('../routes/Settings/Zone/EditZone')),
    },
    '/settings/zones/show/:id': {
      component: dynamicWrapper(app, ['zones'], () => import('../routes/Settings/Zone/ShowZone')),
    },
    // 楼栋管理
    '/settings/buildings/list': {
      component: dynamicWrapper(app, ['buildings'], () => import('../routes/Settings/Building/Buildings')),
    },
    '/settings/buildings/add': {
      component: dynamicWrapper(app, ['buildings'], () => import('../routes/Settings/Building/AddBuilding')),
    },
    '/settings/buildings/edit/:id': {
      component: dynamicWrapper(app, ['buildings'], () => import('../routes/Settings/Building/EditBuilding')),
    },
    '/settings/buildings/show/:id': {
      component: dynamicWrapper(app, ['buildings'], () => import('../routes/Settings/Building/ShowBuilding')),
    },
    // 单元管理
    '/settings/units/list': {
      component: dynamicWrapper(app, ['units'], () => import('../routes/Settings/Unit/Units')),
    },
    '/settings/units/add': {
      component: dynamicWrapper(app, ['units'], () => import('../routes/Settings/Unit/AddUnit')),
    },
    '/settings/units/edit/:id': {
      component: dynamicWrapper(app, ['units'], () => import('../routes/Settings/Unit/EditUnit')),
    },
    '/settings/units/show/:id': {
      component: dynamicWrapper(app, ['units'], () => import('../routes/Settings/Unit/ShowUnit')),
    },
    // 房间管理
    '/settings/rooms/list': {
      component: dynamicWrapper(app, ['rooms', 'zones', 'buildings'], () => import('../routes/Settings/Room/Rooms')),
    },
    '/settings/rooms/add': {
      component: dynamicWrapper(app, ['rooms', 'zones', 'buildings', 'units'], () => import('../routes/Settings/Room/AddRoom')),
    },
    '/settings/rooms/edit/:id': {
      component: dynamicWrapper(app, ['rooms', 'zones', 'buildings', 'units'], () => import('../routes/Settings/Room/EditRoom')),
    },
    '/settings/rooms/show/:id': {
      component: dynamicWrapper(app, ['rooms'], () => import('../routes/Settings/Room/ShowRoom')),
    },

    '/finance/balance/personalBalance': {
      component: dynamicWrapper(app, ['personalBalance'], () => import('../routes/Balance/PersonalBalance')),
    },
    '/finance/balance/recordBalance': {
      component: dynamicWrapper(app, ['recordBalance'], () => import('../routes/Balance/RecordBalance')),
    },
    '/charge': {
      component: dynamicWrapper(app, ['user', 'zones', 'rooms', 'tradeOrders'], () => import('../routes/Charge/Charge')),
    },

    // 财务-现金入账
    '/finance/cash/charge': {
      component: dynamicWrapper(app, ['cash'], () => import('../routes/Cash/CashCharge')),
    },
    // 财务-现金归转记录
    '/finance/cash/record': {
      component: dynamicWrapper(app, ['cash'], () => import('../routes/Cash/CashChargeRecord')),
    },
    // 财务-现金入账审核
    '/finance/cash/audit': {
      component: dynamicWrapper(app, ['cash', 'user'], () => import('../routes/Cash/CashAudit')),
    },
    // 个人中心
    '/ucenter': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart','tradeOrders','user'], () =>
        import('../routes/User/UserCenter')
      ),
    },

    // 系统设置--系统参数
    '/settings/sysParams': {
      component: dynamicWrapper(app, ['sysParams'], () => import('../routes/Settings/SysParams')),
    },

  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
