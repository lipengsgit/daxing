import {stringify} from "qs";
import request from '../utils/request';

// 首页查询
export async function queryHistoryOrder(params) {
  return request(`/api/v1/invoices?${stringify(params)}`);
}

// 查询发票信息
export async function queryInvoice(id) {
  return request(`/api/v1/invoices/${id}`);
}
// 开票
export async function addInvoiceInfo(params) {
  return request(`/api/v1/invoices/${params.id}/complete`, {
    method: 'PUT',
  });
}



