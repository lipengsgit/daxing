import request from '../utils/request';


// 进行中查询
export async function queryRepairsGoing() {
  return request('/api/v1/repair_orders');
}
// 创建报修工单
export async function addRepairs(params) {
  return request('/api/v1/repair_orders', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 驳回消息
export async function rejectNews(params) {
  return request(`/api/v1/repair_orders/${params.id}/close`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 评价详情查询
export async function queryAppraise(id) {
  return request(`/api/v1/repair_orders/${id}/comment`);
}
