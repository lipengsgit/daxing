import {stringify} from "qs";
import request from '../utils/request';

// 列表查询
export async function queryOpenOrder(params) {
  return request(`/api/v1/repair_orders?${stringify(params)}`);
}
// 工单详情
export async function queryDetails(id) {
  return request(`/api/v1/repair_orders/${id}`);
}

// 负责人指派
export async function returnAssign(params) {
  return request(`/api/v1/repair_orders/${params.id}/assign`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 完成
export async function returnSuccess(params) {
  return request(`/api/v1/repair_orders/${params.id}/complete`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
