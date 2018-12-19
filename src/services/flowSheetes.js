import {stringify} from "qs";
import request from '../utils/request';


// 查询流水单
export async function queryList(params) {
 return request(`/api/v1/trade_orders?${stringify(params)}`);
}
// 缴费筛选查询
export async function queryPayList(params){
  return request(`/api/v1/rooms?${stringify(params)}`);
};

// 查询待开发票的用户信息
 export async function queryInvoiceUserInfo(id){
  return request(`/api/v1/queryInvoiceUserInfo/${id}`)
 }

 // 缴费
export async function savePay(params){
  return request('/api/v1/trade_orders', {
    method: 'POST',
    body: {
      ...params,
         },
  });
}

// 缴费成功短息通知
export async function sendMessage(params){
  return request('/api/v1/order_notifications', {
    method: 'POST',
    body: {
      ...params,
        },
  });
}

// 更改订单绑定手机号
export async function updateMobile(params){
  return request(`/api/v1/trade_orders/${params.id}/modify_phone`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 开发票
export  async function saveInvoices(params){
    return request('/api/v1/invoices', {
    method: 'POST',
    body: {
      ...params,
    },
  });

}

// 查询订单详情
export async function queryOrderInfo(id){
  return request(`/api/v1/trade_orders/${id}`)
}

// 查询历史累计收费
export async function queryHistoryPay(){
  return request('/api/v1/trade_orders/reconciliation_orders')
}


// 查询首页 收费方式构成
export async function queryChargeMode(){
  return request('/api/v1/trade_orders/reconciliation_orders')
  // return request('/api/v1/chargeMode');
}

export  async function SubSystemInfo(id){

  return request(`/api/v1/delegates/${id}`)
}


 // 获取的代理类型
export  async function getProxyType(params){
  return request(`/api/v1/sys_params/value_name?${stringify(params)}`)
}
