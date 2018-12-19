import {stringify} from "qs";
import request from '../utils/request';

/* 查询订单列表
 * params:
 *  zone_name: 小区名称
 *  zone_id: 小区id
 *  building_name: 楼栋名称
 *  building_id: 楼栋id
 *  unit_name: 单元名称
 *  unit_id: 单元id
 *  room_name: 房号
 *  room_id: 房间id
 *  keyword: 关键字(业主名称/房号/订单电话)
 *  owner_phone: 业主电话
 *  openid: 绑定微信
 *  status: 支付状态
 *  start_date: 创建起始时间
 *  end_date: 创建截止时间
 */
export async function queryTradeOrders(params) {
  return request(`/api/v1/trade_orders?${stringify(params)}`);
}
// 发短信
export async function sendMessage(params) {
  return request('/api/v1/order_notifications', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//  退款
export async function returnMoney(params) {
  return request(`/api/v1/trade_orders/${params.id}/refund`, {
    method: 'PUT',
  });
}
// 申请开发票
export async function addInvoiceInfo(params) {
  return request('/api/v1/invoices', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 创建订单
export async function createData(params) {
  return request('/api/v1/trade_orders', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询历史累计收费
export async function queryHistoryPay(){
  return request('/api/v1/users/orders_amount_statistic')
}
// 我的现金统计
export async function queryCashStatistics(params){
  return request(`/api/v1/cash_details/statistic?${stringify(params)}`)
}
