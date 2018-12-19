import request from '../utils/request';

export async function queryResources() {
  return request('/api/v1/resources?resource_type=1');
}

export async function addResource(params) {
  return request('/api/v1/resources', {
    method: 'POST',
    body: {...params, resource_type: 1},
  });
}

export async function updateResource(params) {
  return request(`/api/v1/resources/${params.id}`, {
    method: 'PUT',
    body: {...params},
  });
}

export async function removeResource(id) {
  return request(`/api/v1/resources/${id}`, {
    method: 'DELETE',
  });
}
