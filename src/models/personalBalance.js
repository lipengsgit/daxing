import { queryList, queryLastUnBalancedDate, getDayBalancedCount, getOrderById, balancedConfirm } from '../services/personalBalance';

function* searchList(call, put, payload){
  const response = yield call(queryList, payload);
  const result = {
    list: response.data.rows,
    pagination: {
      total: response.data.total,
      page_size: response.data.page_size,
      current: response.data.current,
    },
  };
  yield put({
    type: 'save',
    payload: result,
  });
}

export default {
  namespace: 'personalBalance',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield* searchList(call, put, payload);
    },
    *fetchUnBalancedDate({ payload, callback }, { call }) {
      const response = yield call(queryLastUnBalancedDate, payload);
      const result = response.data.date;
      if (callback) callback(result);
    },
    *fetchDayBalancedAmount({ payload, callback }, { call }) {
      const response = yield call(getDayBalancedCount, payload);
      const result = response.data;
      if (callback) callback(result);
    },
    *fetchOrder({ payload, callback }, { call }) {
      const response = yield call(getOrderById, payload.id);
      const result = response.data;
      if (callback) callback(result);
    },
    *balancedConfirm({ payload, callback }, { call }) {
      const response = yield call(balancedConfirm, payload);
      const result = response.data;
      if (callback) callback(result);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
