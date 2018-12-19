import { stringify } from 'qs';
import request from '../utils/request';

export async function getDevices(params) {
  return request(`/api/v1/devices?${stringify(params)}`);
}

export async function getTypes(params) {
  return request(`/api/v1/devices/types?${stringify(params)}`);
}

export async function getDeviceInfo(id) {
  return request(`/api/v1/devices/${id}`);
}

export async function addDevice(params) {
  return request('/api/v1/devices', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateDevice(params) {
  return request(`/api/v1/devices/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteDevice(id) {
  return request(`/api/v1/devices/${id}`, {
    method: 'DELETE',
  });
}

export async function saveDevice(params) {
  return request('/api/v1/devices', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
