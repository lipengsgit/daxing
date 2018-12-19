import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCompanies(params) {
  return request(`/api/v1/companies?${stringify(params)}`);
}

export async function createCompany(params) {
  return request('/api/v1/companies', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getCompanyInfo(id) {
  return request(`/api/v1/companies/${id}`);
}

export async function updateCompany(params) {
  return request(`/api/v1/companies/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteCompany(id) {
  return request(`/api/v1/companies/${id}`, {
    method: 'DELETE',
  });
}
