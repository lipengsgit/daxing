import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getEquipment, postEquipment ,getEquipmentInfo,updateEquipement,deleteEquipement,getConfigureList,config_insection,config_maintenance,updateInspection,updateMaintenance,delete_inspection,delete_maintenance} from './mock/equipment';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { getRole, getAllResources, postRole, getRoleInfo, updateRole, deleteRole } from './mock/role';
import { getDevices, saveDevice, getDeviceInfo, updateDevice, deleteDevice, getDeviceTypes } from './mock/deviceManager';
import { getPositionByProject, getPositionName } from './mock/position';
import { getDelegates } from './mock/delegate';
import * as resources from './mock/resources';
import * as data from './mock/flowsheet';

import { queryUserList,postUser, deleteUser, updateUser, resetUserPassword, switchUserLockStatus } from './mock/user';
import { queryCompanyList, queryProjectByCompanyId } from './mock/device';

import { getAlarms } from './mock/alarms';
import { getTechniques, getTechniqueInfo, saveTechnique, updateTechnique, deleteTechnique } from './mock/technique';
import { getAlarmCategories, getAlarmCategoryInfo, saveAlarmCategory, updateAlarmCategory, deleteAlarmCategory } from './mock/alarmCategory';
import { getCompanies, getCompanyInfo, createCompany, updateCompany, deleteCompany } from './mock/company';
import { queryMessagesList, deleteMessage } from './mock/messages';
import { getProjects, getProjectInfo, createProject, updateProject, deleteProject } from './mock/project';

import { getPersonalBalanceList, getLastUnBalancedDate, getDayBalancedCount, getOrderById, balancedConfirm } from './mock/balance';
import { getOpenUpList, getSearchNameInfo,getSearchPhoneInfo} from './mock/openUp';
import { getCashRecordList } from './mock/cash';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {


  'POST /api/v1/': 'http://192.168.1.51:3210/',
  'GET /api/v1/': 'http://192.168.1.51:3210/',
  'PUT /api/v1/': 'http://192.168.1.51:3210/',
  'DELETE /api/v1/': 'http://192.168.1.51:3210/',




  // 'POST /api/v1/': 'http://192.168.1.51:3310/',
  // 'GET /api/v1/': 'http://192.168.1.51:3310/',
  // 'PUT /api/v1/': 'http://192.168.1.51:3310/',
  // 'DELETE /api/v1/': 'http://192.168.1.51:3310/',



   // 'POST /api/v1/': 'http://192.168.1.136:3000/',
   // 'GET /api/v1/': 'http://192.168.1.136:3000/',
   // 'PUT /api/v1/': 'http://192.168.1.136:3000/',
   // 'DELETE /api/v1/': 'http://192.168.1.136:3000/',





  'POST /api/v1/user/login': (req, res) => {
    const { password, username, user_type } = req.body;
    if (password === '123456' && username === 'superuser') {
      res.send({
        success: true,
        data: {
          token: {access_token: 'ac713f6d22e5d7d48f4dd60aa6d1b64e9dd8ff28a9196c3b4852e926f265b787'},
          user: {
            menus: [{}],
            resources: ['/dashboard/monitor', '/dashboard/analysis']
          },
        },
      });
      return;
    }
    res.send({
      success: false,
    });
  },



  // 2018 0813 查询流水单
  'GET /api/v1/flowSheet': data.getEquipment,
  // 缴费筛选
  'POST /api/v1/rooms' :data.getEquipment,
  // 查询用户缴费信息
  'GET /api/v1/queryUserPayInfo/:id':data.getEquipmentInfo,
  //待开发票的用户信息
  'GET /api/v1/queryInvoiceUserInfo/:id' :data.getEquipmentInfo,
  // 开发票
  'POST /api/v1/saveInvoice' :{ $body: data.postEquipment,},
  // 查询历史收费
  'GET /api/v1/historyPay' :data.getHistoryPay,
  // 查询首页 收费方式构成
  'GET /api/v1/chargeMode' : data.getChargeMode,


  //'GET /api/v1/device_categories' : 'http://192.168.1.138:3010/api/v1/device_categories',

  'GET /api/v1/resources': resources.queryResources,
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'GET /api/v1/roles': getRole,
  'GET /api/v1/resources': getAllResources,
  'GET /api/v1/roles/:id': getRoleInfo,
  'DELETE /api/v1/roles/:id': deleteRole,
  'POST /api/v1/roles': {
    $body: postRole,
  },
  'PUT /api/v1/roles/:id': {
    $body: updateRole,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/v1/users': queryUserList,
  'POST /api/v1/users': {
    $body: postUser,
  },
  'PUT /api/v1/users': {
    $body: updateUser,
  },
  'DELETE /api/v1/users/:id': deleteUser,
  'PUT /api/v1/users/:id/password': resetUserPassword,
  'PUT /api/v1/users/:id/switch_lock_status': switchUserLockStatus,

  'GET /api/v1/devices': getDevices,
  'GET /api/v1/devices/types': getDeviceTypes,
  'GET /api/v1/devices/:id': getDeviceInfo,
  'DELETE /api/v1/devices/:id': deleteDevice,
  'POST /api/v1/devices': {
    $body: saveDevice,
  },
  'PUT /api/v1/devices/:id': {
    $body: updateDevice,
  },
  'GET /api/v1/positions': getPositionByProject,
  'GET /api/v1/positions/:id/name': getPositionName,
  'GET /api/v1/delegates': getDelegates,


  'GET /api/v1/company': queryCompanyList,
  'GET /api/v1/projects': queryProjectByCompanyId,




  //查询设备类型
  'GET /api/v1/device_categories' :getEquipment,
  //新增设备类型
  'POST /api/v1/device_categories': {
    $body: postEquipment,
  },
  //修改设备类型
  'PUT /api/v1/device_categories/:id': {
    $body: updateEquipement,
  },
  //查询维护 巡检项目
  'GET /api/v1/device_categories/:id/items':{
    $body :getConfigureList,
  },

  'DELETE /api/v1/device_categories/:id' : deleteEquipement,

  //配置巡检项目
  'POST /api/v1/device_categories/:id/inspection_items':{
    $body :config_insection,
  },
  //配置维护项目
  'POST /api/v1/device_categories/:id/maintenance_items':{
    $body :config_maintenance,
  },
  //修改巡检项目
  'PUT /api/v1/inspection_items/:id' :{
    $body :updateInspection,
  },
  //修改维护项目
  'PUT /api/v1/maintenance_items/:id':{
    $body :updateMaintenance,
  },
  //删除巡检项目
  'DELETE /api/v1/inspection_items/:id':{
    $body :delete_inspection,
  },
  //删除维护项目
  'DELETE /api/v1/maintenance_items/:id':{
    $body :delete_maintenance,
  },




  //子系统列表
  'GET /api/v1/delegates':getEquipment,
  //创建子系统
  'POST /api/v1/delegates'  :postEquipment,
  //查询子系统详情
  'GET /api/v1/delegates/:id':getEquipmentInfo,

  //修改子系统
  'PUT /api/v1/delegates/:id': {
    $body: updateEquipement,
  },
  'PUT /api/v1/projects/:id': {
    $body: updateProject,
  },

  'GET /api/v1/trade_orders/earliest_not_reconciled': getLastUnBalancedDate,
  'GET /api/v1/trade_orders/reconciliation_orders': getPersonalBalanceList,
  'GET /api/v1/trade_orders/reconciliation_amount_statistic': getDayBalancedCount,
  'GET /api/v1/trade_orders/:id': getOrderById,
  'PUT /api/v1/trade_orders/reconciliation_confirm': balancedConfirm,

  //  工单开通接口
  'GET /api/v1/openUp': getOpenUpList,
  'GET /api/v1/openUpSearch/:name': getSearchNameInfo,
  'GET /api/v1/openUpPhone/:id':getSearchPhoneInfo,
  'GET /api/v1/cash/record': getCashRecordList,
  'GET /api/v1/cash/charge': getCashRecordList,
};

export default (noProxy ? {} : delay(proxy, 1000));
