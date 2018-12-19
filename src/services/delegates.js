import { stringify } from 'qs';
import request from '../utils/request';

export async function getDelegates(params) {
  return request(`/api/v1/delegates?${stringify(params)}`);
}
