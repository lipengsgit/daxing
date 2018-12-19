import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { setAccessToken, getAccessToken } from './token';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * 服务器返回错误信息统一处理
 * @param response
 */
function checkServerSuccess(response){
  if(!response.success){
    let errorText = '服务器错误，请稍后再试！';
    if(response.error_msg) errorText = response.error_msg;

    notification.error({
      message: '操作失败',
      description: errorText,
    });

    const error = new Error(errorText);
    error.name = '-100';
    throw error;
  }
  return response;
}

/**
 * 是否刷新token校验
 * @param tokenInfo
 * @returns {number} 0 刷新 1 不刷新
 */
function checkToken(tokenInfo) {
  let ret = 1;
  if (!(tokenInfo && tokenInfo.access_token)) return ret;

  // 提前5分钟刷新token
  const aheadMin = 5;
  const expireTime = tokenInfo.clientCreateTime + tokenInfo.expires_in * 1000;
  const diff = expireTime - new Date().getTime();
  const ahead = aheadMin * 60 * 1000;
  if(diff > 0  && diff <= ahead){
    ret = 0;
  }
  return ret;
}

/**
 * 刷新token
 * @param loginType 登录方式
 * @param then_method 刷新后执行的回调
 */
async function refreshToken(tokenInfo) {
  const url = '/api/v1/oauth/token';
  const options = {
    method: 'POST',
    body: {
      grant_type: 'refresh_token',
      refresh_token: tokenInfo.refresh_token,
    },
  };
  const urlOptions = getUrlOptions(url, options);
  const ret = await fetch(urlOptions.urlWithToken, urlOptions.newOptions)
    .then(checkStatus)
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.info(e.message);
      const { dispatch } = store;
      dispatch({
        type: 'login/logout',
      });
      dispatch(routerRedux.push('/user/login'));
    });
  return ret;
}

function getUrlOptions(url, options){
  const defaultOptions = {
    credentials: 'include',
  };
  const accessToken = getAccessToken().access_token;
  let urlWithToken = url;
  if (urlWithToken && urlWithToken.indexOf('?') !== -1) {
    urlWithToken = `${urlWithToken}&access_token=${accessToken}`;
  } else {
    urlWithToken = `${urlWithToken}?access_token=${accessToken}`;
  }
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  return {
    urlWithToken,
    newOptions,
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  if(url !== '/api/v1/user/login'){
    const tokenInfo = getAccessToken();
    if(checkToken(tokenInfo) === 0){
      const response = await refreshToken(tokenInfo);
      setAccessToken(response);
    }
  }

  const urlOptions = getUrlOptions(url, options);
  return fetch(urlOptions.urlWithToken, urlOptions.newOptions)
    .then(checkStatus)
    .then(response => {
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      //   return response.text();
      // }
      return response.json();
    })
    .then(checkServerSuccess)
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
      if(status === '-100'){
        const error = new Error('-100 promise throw');
        throw error;
      }
    });
}
