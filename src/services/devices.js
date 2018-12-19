import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCompnayList(params) {
  return request(`/api/v1/company?${stringify(params)}`);
}

export async function queryProjectByCompanyId(params) {
  return request(`/api/v1/projects?${stringify(params)}`);
}

