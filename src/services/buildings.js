import { stringify } from 'qs';
import request from '../utils/request';

export async function queryBuildings(params) {
  return request(`/api/v1/buildings?${stringify(params)}`);
}

export async function createData(params) {
  return request('/api/v1/buildings', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getDataInfo(id) {
  return request(`/api/v1/buildings/${id}`);
}

export async function updateData(params) {
  return request(`/api/v1/buildings/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(id) {
  return request(`/api/v1/buildings/${id}`, {
    method: 'DELETE',
  });
}
