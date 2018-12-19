import request from '../utils/request';
import {stringify} from "qs";

export async function query() {
  return request('/api/v1/users');
}

export async function queryUser() {
  return request('/api/v1/users/show_self');
}

export async function queryCurrent() {
  return request('/api/v1/current_user');
}

export async function queryById(id) {
  return request(`/api/v1/users/${id}`);
}

export async function queryUserList(params) {
  return request(`/api/v1/users?${stringify(params)}`);
}

export async function addUser(params) {
  return request('/api/v1/users', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeUser(params) {
  return request(`/api/v1/users/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateUser(params) {
  return request(`/api/v1/users/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function resetPassword(params) {
  return request(`/api/v1/users/${params.id}/password`, {
    method: 'PUT',
  });
}

export async function switchLockStatus(params) {
  return request(`/api/v1/users/${params.id}/switch_lock_status`, {
    method: 'PUT',
  });
}

