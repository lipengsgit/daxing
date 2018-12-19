import { isUrl } from '../utils/utils';
import { hasPermission } from '../utils/Authorized';

// const menuData = [
//   {
//     name: 'dashboard',
//     icon: 'dashboard',
//     path: 'dashboard',
//     children: [
//       {
//         name: '分析页',
//         path: 'analysis',
//       },
//       {
//         name: '监控页',
//         path: 'monitor',
//       },
//       {
//         name: '工作台',
//         path: 'workplace',
//         // hideInBreadcrumb: true,
//         // hideInMenu: true,
//       },
//     ],
//   },
//   {
//     name: '表单页',
//     icon: 'form',
//     path: 'form',
//     children: [
//       {
//         name: '基础表单',
//         path: 'basic-form',
//       },
//       {
//         name: '分步表单',
//         path: 'step-form',
//       },
//       {
//         name: '高级表单',
//         authority: 'admin',
//         path: 'advanced-form',
//       },
//     ],
//   },
//   {
//     name: '列表页',
//     icon: 'table',
//     path: 'list',
//     children: [
//       {
//         name: '查询表格',
//         path: 'table-list',
//       },
//       {
//         name: '标准列表',
//         path: 'basic-list',
//       },
//       {
//         name: '卡片列表',
//         path: 'card-list',
//       },
//       {
//         name: '搜索列表',
//         path: 'search',
//         children: [
//           {
//             name: '搜索列表（文章）',
//             path: 'articles',
//           },
//           {
//             name: '搜索列表（项目）',
//             path: 'projects',
//           },
//           {
//             name: '搜索列表（应用）',
//             path: 'applications',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: '详情页',
//     icon: 'profile',
//     path: 'profile',
//     children: [
//       {
//         name: '基础详情页',
//         path: 'basic',
//       },
//       {
//         name: '高级详情页',
//         path: 'advanced',
//         authority: 'admin',
//       },
//     ],
//   },
//   {
//     name: '结果页',
//     icon: 'check-circle-o',
//     path: 'result',
//     children: [
//       {
//         name: '成功',
//         path: 'success',
//       },
//       {
//         name: '失败',
//         path: 'fail',
//       },
//     ],
//   },
//   {
//     name: '异常页',
//     icon: 'warning',
//     path: 'exception',
//     children: [
//       {
//         name: '403',
//         path: '403',
//       },
//       {
//         name: '404',
//         path: '404',
//       },
//       {
//         name: '500',
//         path: '500',
//       },
//       {
//         name: '触发异常',
//         path: 'trigger',
//         hideInMenu: true,
//       },
//     ],
//   },
//   {
//     name: '系统设置',
//     icon: 'setting',
//     path: 'settings',
//     children: [
//       {
//         name: '资源管理',
//         path: 'resources',
//       },
//       {
//         name: '角色管理',
//         path: 'roles',
//       },
//       {
//         name: '设备配置',
//         path: 'devices',
//         children: [
//           {
//             name: '设备管理',
//             path: 'list',
//           },
//         ],
//       },
//       {
//         name: '人员技能管理',
//         path: 'techniques/list',
//       },
//       {
//         name: '公司管理',
//         path: 'companies/list',
//       },
//       {
//         name: '项目管理',
//         path: 'projects/list',
//       },
//     ],
//   },
//   {
//     name: '实时监控',
//     icon: 'dashboard',
//     path: 'monitor',
//     children: [
//       {
//         name: '实时监控',
//         path: 'index',
//       },
//       {
//         name: '视频实时监控',
//         path: 'video/playView/index',
//       },
//       {
//         name: '视频历史回放',
//         path: 'video/playBack/index',
//       },
//     ],
//   },
//   {
//     name: '用户管理',
//     icon: 'user',
//     path: 'user-manager',
//     children: [
//       {
//         name: '用户列表',
//         path: 'user-list',
//       },
//     ],
//   },
//   {
//     name: '消息管理',
//     icon: 'bell',
//     path: 'message',
//     children: [
//       {
//         name: '消息列表',
//         path: 'list',
//       },
//     ],
//   },
//   {
//     name: '账户',
//     icon: 'user',
//     path: 'user',
//     authority: 'guest',
//     children: [
//       {
//         name: '登录',
//         path: 'login',
//       },
//       {
//         name: '注册',
//         path: 'register',
//       },
//       {
//         name: '注册结果',
//         path: 'register-result',
//       },
//     ],
//   },
//
//
//   {
//     name: '个人中心',
//     icon: 'userinfo',
//     path: 'userinfo',
//     children: [
//       {
//         name: '个人信息',
//         path: 'info',
//       },
//
//     ],
//   },
//   {
//     name: '设备类型管理',
//     icon: ' device_management',
//     path: 'device_management',
//     children: [
//
//       {
//         name: '设备类型',
//         path: 'list',
//       },
//
//     ],
//   },
//   {
//     name: '子系统',
//     icon: 'subsystem',
//     path: 'subsystem',
//     children: [
//
//       {
//         name: '子系统配置',
//         path: 'list',
//       },
//
//     ],
//   },
//   {
//     name: '预警与报警',
//     icon: 'dashboard',
//     path: 'alarm',
//     children: [
//       {
//         name: '警告类型',
//         path: 'alarmCategories/list',
//       },
//       {
//         name: '警告列表',
//         path: 'alarms/list',
//       },
//     ],
//   },
// /*
//   {
//     name: '技能管理',
//     icon: 'skill',
//     path: 'skill',
//     children: [
//
//       {
//         name: '技能管理',
//         path: 'list',
//       },
//     ],
//   },
// */
//
//
// ];



const menuData = [
  {
    name: '首页',
    path: 'home/index',
  },
  {
    name: '收费',
    path: 'charge',
    icon: 'skill',
  },
  {
    name: '历史订单',
    path: 'tradeOrder/history',
  },
  {
    name: '工单',
    path: 'workOrder',
    children: [
      {
        name: '开通',
        path: 'pc_form/openUp_list',
      },
      {
        name: '报修',
        path: 'repairs/repairs_list',
      },
    ],
  },
  // {
  //   name: '统计',
  //   path: 'statistics',
  // },
  {
    name: '财务',
    path: 'finance',
    children: [
      {
        name: '个人对账',
        path: 'balance/personalBalance',
      },
      {
        name: '非现金入账',
        path: 'balance/recordBalance',
      },
      {
        name: '现金入账',
        path: 'cash/charge',
      },
      {
        name: '现金入账变动记录',
        path: 'cash/record',
      },
      {
        name: '现金入账审核',
        path: 'cash/audit',
      },
    ],
  },
  {
    name: '发票',
    path: 'pc_form/invoice_list',
  },
  {
    name: '系统设置',
    path: 'settings',
    icon: 'setting',
    children: [
      {
        name: '用户',
        path: 'user-manager/user-list',
      },
      {
        name: '角色',
        path: 'roles',
      },
      {
        name: '资源',
        path: 'resources',
      },
      {
        name: '系统参数',
        path: 'sysParams',
      },
      {
        name: '小区管理',
        path: 'zones/list',
      },
      {
        name: '楼栋管理',
        path: 'buildings/list',
      },
      {
        name: '单元管理',
        path: 'units/list',
      },
      {
        name: '房间管理',
        path: 'rooms/list',
      },
    ],
  },
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    } else {
      result.authority = hasPermission(path);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
