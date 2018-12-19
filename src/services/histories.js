import {stringify} from "qs";
import request from '../utils/request';

// 后台交互  发送请求
// 首页查询
export async function queryHistoryOrder(params) {
  return request(`/api/v1/trade_orders?${stringify(params)}`);
}

// 小区
export async function queryAddressZones(params) {
  return request(`/api/v1/zones?${stringify(params)}`);
}
// 楼号
export async function queryAddressBuildings(params) {
    return request(`/api/v1/buildings?${stringify(params)}`);

}
// 单元
export async function queryAddressUnits(params) {
    return request(`/api/v1/units?${stringify(params)}`);

}
// 级联查询
export async function queryList(params) {
  return request(`/api/v1/trade_orders?${stringify(params)}`);
}

// 根据日期查询
export async function queryByDateSearch(params) {
  return request(`/api/v1/trade_orders?${stringify(params)}`);
}

// 根据业主，房间号，手机号查询
export async function queryBySearch(params) {
  return request(`/api/v1/trade_orders?${stringify(params)}`);

}

export async function queryMessage() {
  return request('/api/v1/histories');

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
// 查询发票信息
export async function queryInvoice() {
  return request('/api/v1/invoices');
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

// 短信Info
export  async function FormInfo(id){
  return request(`/api/v1/historiesInfo/${id}`)
}
export async function queryAddress() {
  return request('/api/v1/histories');

}


export async function queryByProprietor(value) {
  return request(`/api/v1/historiesSearch/${value.name}`);

}

