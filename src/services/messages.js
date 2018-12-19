import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMessagesList(params) {
  return request(`/api/v1/message?${stringify(params)}`);
}

export async function deleteMessage(params) {
  return request(`/api/v1/message?${stringify(params)}`, {
    method: 'DELETE',
  });
}

