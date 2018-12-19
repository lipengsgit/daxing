import request from '../utils/request';

export async function query() {
  return request('/api/v1/user');

}

export async function queryCurrent() {
  return request('/api/v1/current_user');
}

export  async function changePassWord(params){
   return request('/api/v1/user/password', {
    method: 'PUT',
    body: params,
  });

}
