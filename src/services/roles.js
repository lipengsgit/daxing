import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRole(params) {
  return request(`/api/v1/roles?${stringify(params)}`);
}

export async function queryResource() {
  return request('/api/v1/resources');
}

export async function addRole(params) {
  return request('/api/v1/roles', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getRoleInfo(id) {
  return request(`/api/v1/roles/${id}`);
}

export async function updateRole(params) {
  return request(`/api/v1/roles/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteRole(id) {
  return request(`/api/v1/roles/${id}`, {
    method: 'DELETE',
  });
}
