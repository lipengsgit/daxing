import request from '../utils/request';

// 统计总收费额
export async function getTotalIncomeData() {
  return request('/api/v1/statistic/income');
}
// 已支付户数和收费完成率
export async function getPaidRoomData() {
  return request('/api/v1/statistic/paid_room');
}
// 全额收费比例
export async function getFullPaidData() {
  return request('/api/v1/statistic/full_paid');
}
// 各小区缴费比例
export async function getPaidByZoneData() {
  return request('/api/v1/statistic/paid_by_zone');
}
// 收费方式构成
export async function getPaymentTypeData() {
  return request('/api/v1/statistic/amount_by_payment_type');
}
// 收费额区域占比
export async function getAmountByZoneData() {
  return request('/api/v1/statistic/amount_by_zone');
}
// 开通进度
export async function getOpenProgressData() {
  return request('/api/v1/statistic/open_progress');
}
