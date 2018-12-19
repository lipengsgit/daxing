import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询最早未对账日期
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryLastUnBalancedDate(params) {
  return request(`/api/v1/trade_orders/earliest_not_reconciled?${stringify(params)}`);
}

/**
 * 查询对账
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryList(params) {
  return request(`/api/v1/trade_orders/reconciliation_orders?${stringify(params)}`);
}

/**
 * 单日对账金额统计接口
 * @param params
 * @returns {Promise<Object>}
 */
export async function getDayBalancedCount(params) {
  return request(`/api/v1/trade_orders/reconciliation_amount_statistic?${stringify(params)}`);
}

/**
 * 根据订单id查询订单（对账记录）
 * @param id
 * @returns {Promise<Object>}
 */
export async function getOrderById(id) {
  return request(`/api/v1/trade_orders/${id}`);
}

/**
 * 对账确认
 * @param id
 * @returns {Promise<Object>}
 */
export async function balancedConfirm(params) {
  return request('/api/v1/trade_orders/reconciliation_confirm', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
