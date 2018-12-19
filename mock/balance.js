import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 100; i += 1) {
  tableListDataSource.push({
    id: i,
    trade_no: "TRADE_NO000000000001",
    created_at: "2018-08-30 11:11:11",
    amount: 2280,
    payment_type: i%3,
    reconciliation_status: i%2,
    amount_type: "1",
    payment_amount: 2000.45,
    receive_amount: 2000,
    service_charge: 0.0038,
    casher_name: `张三 ${i}`,
    address: `花园小区/a栋/1单元-${i}`,

    openid: "oCIlowF8h5uFK3LUmSTqUJFN00sQ",
    phone: "133",
    room_name: '1001',
    owner_name: "张三",
    owner_phone: "13388888888",
    area: 80.5,
    payment_type_label: '微信',
    amount_type_label: '全部',
    status: 0, // 支付状态
    status_label: '已付款',
    remark: null,
    reconciliation_status_label: '未对账',
    order_time: "2018-01-01 11:00:00",
    pay_in_back: 0,
  });
}

export function getPersonalBalanceList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  // if (params.reconciliation_date) {
  //   dataSource = dataSource.filter(data => data.alarm_category_id === parseInt(params.alarm_category_id, 10));
  // }

  if (params.payment_type) {
    dataSource = dataSource.filter(data => data.payment_type === parseInt(params.payment_type, 10));
  }

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  let start = 0;
  if (params.page) {
    page = parseInt(params.page, 10);
    start = (page-1) * pageSize;
  }

  const retData = dataSource.slice(start, start + pageSize);
  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: retData,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getLastUnBalancedDate(req, res) {
  const result = {
    success: true,
    data: {
      date: '2018-08-25',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getDayBalancedCount(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const result = {
    success: true,
    data: {
      total: 10000,
      reconciled_wechat: 0,  // 已对账微信支付
      unreconciled_wechat: 5, // 未对账微信支付
      reconciled_cash: 10, // 已对账现金支付
      unreconciled_cash: 20, // 未对账现金支付
      reconciled_pos: 30, // 已对账pos支付
      unreconciled_pos: 40, // 未对账pos支付
      reconciled_transfer: 50, // 已对账转账支付
      unreconciled_transfer: 60, // 未对账转账支付
      reconciled_scan: 70,   // 已对账扫码支付
      unreconciled_scan: 80, // 未对账扫码支付
      date_from: params.date_from, // 统计开始日期
      date_to: params.date_to,  // 统计截止日期
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getOrderById(req, res) {
  const { id } = req.params;
  const order = tableListDataSource.filter(data => data.id.toString() === id)[0];

  const result = {
    success: true,
    data: order,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function balancedConfirm(req, res) {
  const ids = req.body.order_ids;
  ids.forEach((id) => {
    const index = tableListDataSource.findIndex((data) => {
      return data.id === id
    });
    tableListDataSource[index].reconciliation_status = 1;
  });

  const result = {
    success: true,
    data: {
      confirm: true,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getPersonalBalanceList,
  getLastUnBalancedDate,
  getDayBalancedCount,
  getOrderById,
  balancedConfirm,
};
