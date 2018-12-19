import { queryNotices, queryAlarms } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    alarmCount: 0,
    alarms: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *fetchAlarms(_, { call, put }) {
      const data = yield call(queryAlarms);
      yield put({
        type: 'saveAlarms',
        payload: data.data.rows,
      });
      yield put({
        type: 'changeAlarmsCount',
        payload: data.length,
      });
    },
    *clearAlarms(_, { put }) {
      yield put({
        type: 'saveClearedAlarms',
        payload: [],
      });
      yield put({
        type: 'changeAlarmsCount',
        payload: 0,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveAlarms(state, { payload }) {
      return {
        ...state,
        alarms: payload,
      };
    },
    saveClearedAlarms(state) {
      return {
        ...state,
        alarms: [],
      };
    },
    changeAlarmsCount(state, { payload }) {
      return {
        ...state,
        alarmCount: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
