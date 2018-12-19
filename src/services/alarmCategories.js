import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAlarmCategories(params) {
  return request(`/api/v1/alarm_categories?${stringify(params)}`);
}

export async function addAlarmCategory(params) {
  return request('/api/v1/alarm_categories', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getAlarmCategoryInfo(id) {
  return request(`/api/v1/alarm_categories/${id}`);
}

export async function updateAlarmCategory(params) {
  return request(`/api/v1/alarm_categories/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteAlarmCategory(id) {
  return request(`/api/v1/alarm_categories/${id}`, {
    method: 'DELETE',
  });
}
