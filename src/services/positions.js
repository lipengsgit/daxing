import { stringify } from 'qs';
import request from '../utils/request';

export async function getPositionByProject(params) {
  return request(`/api/v1/positions?${stringify(params)}`);
}

export async function getPositionName(id) {
  return request(`/api/v1/positions/${id}/name`);
}
