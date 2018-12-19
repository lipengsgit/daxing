import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTechniques(params) {
  return request(`/api/v1/techniques?${stringify(params)}`);
}

export async function addTechnique(params) {
  return request('/api/v1/techniques', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getTechniqueInfo(id) {
  return request(`/api/v1/techniques/${id}`);
}

export async function updateTechnique(params) {
  return request(`/api/v1/techniques/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteTechnique(id) {
  return request(`/api/v1/techniques/${id}`, {
    method: 'DELETE',
  });
}
