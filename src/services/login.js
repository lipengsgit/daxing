import { stringify } from 'qs';
import request from '../utils/request';

export async function accountLogin(params) {
  return request('/api/v1/user/login', {
    method: 'POST',
    body: {...params, user_type: 1},
  });
}

export async function checkPhoneNumber(params) {
  return request(`/api/v1//login/phone_validate?${stringify(params)}`);
}

export async function getVerificationCode(params) {
  return request('/api/v1/verification_codes', {
    method: 'POST',
    body: {...params},
  });
}
