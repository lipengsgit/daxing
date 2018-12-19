import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAlarm(params) {
  return request(`/api/v1/alarms?${stringify(params)}`);
}
