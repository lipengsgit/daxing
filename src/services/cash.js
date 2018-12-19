import {stringify} from "qs";
import request from '../utils/request';


// 查询现金余额变动记录
export async function queryCashRecordList(params) {
  return request(`/api/v1/cash_details?${stringify(params)}`);
}

// 查询我的现金
export async function queryMyCash(params) {
  return request(`/api/v1/cash_details/statistic?${stringify(params)}`);
}
// 查询现金入账记录
export async function queryCashChargeList(params) {
  return request(`/api/v1/cash_accounts?${stringify(params)}`);
}
// 发起现金入账
export async function addCashCharge(params) {
  return request('/api/v1/cash_accounts', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 现金入账审核确认
export async function cashConfirm(params) {
  return request('/api/v1/cash_accounts/confirm', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}



