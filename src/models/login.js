import { routerRedux } from 'dva/router';
import { accountLogin, checkPhoneNumber, getVerificationCode } from '../services/login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { setAccessToken, setUserInfo } from '../utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    errorMessage: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          ...response,
          submitType: payload.type,
        },
      });
      // Login successfully
      if (response.status === 'ok') {
        // 重新加载权限
        reloadAuthorized();
        // 跳转首页
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        setAuthority('-1');
        setAccessToken({});
        setUserInfo({});
        reloadAuthorized();
        global.currentUser = {};
        yield put(routerRedux.push('/user/login'));
      }
    },
    *checkPhoneNumber({ payload, callback }, { call }){
      const response = yield call(checkPhoneNumber, payload);
      if(callback) callback(response.data);
    },
    *getVerificationCode({ payload, callback }, { call }){
      const response = yield call(getVerificationCode, payload);
      if(callback) callback(response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.status === 'ok') {
        const userInfo = {...payload.data.user};
        // 设置全局变量
        global.currentUser = userInfo;
        setAuthority(userInfo.resources);
        setAccessToken(payload.data.token);
        setUserInfo(userInfo);
      }
      const status = payload.status === 'ok';
      const errorMessage = !status && payload.error_message ? payload.error_message : '登录失败！';
      return {
        ...state,
        status,
        errorMessage,
        type: payload.submitType,
      };
    },
  },
};
