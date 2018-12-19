import { stringify } from 'qs';
import request from '../utils/request';

export async function queryUnits(params) {
  return request(`/api/v1/units?${stringify(params)}`);
}

export async function createData(params) {
  return request('/api/v1/units', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getDataInfo(id) {
  return request(`/api/v1/units/${id}`);
}

export async function updateData(params) {
  return request(`/api/v1/units/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(id) {
  return request(`/api/v1/units/${id}`, {
    method: 'DELETE',
  });
}
