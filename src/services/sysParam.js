import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysParam(params) {
  return request(`/api/v1/sys_params?${stringify(params)}`);
}


export async function addSysParam(params) {
  return request('/api/v1/sys_params', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateSysParam(params) {
  return request(`/api/v1/sys_params/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteSysParam(id) {
  return request(`/api/v1/sys_params/${id}`, {
    method: 'DELETE',
  });
}
