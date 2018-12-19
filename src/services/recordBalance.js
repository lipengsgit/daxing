import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询最早未入账日期
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryLastUnRecordDate(params) {
  return request(`/api/v1/noncash_accounts/earliest_not_confirmed?${stringify(params)}`);
}

/**
 * 查询入账
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryList(params) {
  return request(`/api/v1/noncash_accounts?${stringify(params)}`);
}

/**
 * 单日入账金额统计接口
 * @param params
 * @returns {Promise<Object>}
 */
export async function getDayRecordAmount(params) {
  return request(`/api/v1/noncash_accounts/statistic?${stringify(params)}`);
}

/**
 * 根据id查询入账记录
 * @param id
 * @returns {Promise<Object>}
 */
export async function getOrderById(id) {
  return request(`/api/v1/trade_orders/${id}`);
}

/**
 * 入账确认
 * @param id
 * @returns {Promise<Object>}
 */
export async function recordConfirm(params) {
  return request('/api/v1/noncash_accounts/confirm', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
