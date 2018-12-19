import { queryList, queryLastUnRecordDate, getDayRecordAmount, getOrderById, recordConfirm } from '../services/recordBalance';

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
  namespace: 'recordBalance',

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
    *fetchUnRecordDate({ callback }, { call }) {
      const response = yield call(queryLastUnRecordDate);
      const result = response.data.date;
      if (callback) callback(result);
    },
    *fetchDayRecordAmount({ payload, callback }, { call }) {
      const response = yield call(getDayRecordAmount, payload);
      const result = response.data;
      if (callback) callback(result);
    },
    *fetchOrder({ payload, callback }, { call }) {
      const response = yield call(getOrderById, payload.id);
      const result = response.data;
      if (callback) callback(result);
    },
    *recordConfirm({ payload, callback }, { call }) {
      const response = yield call(recordConfirm, payload);
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
