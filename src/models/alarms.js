import { queryAlarm } from '../services/alarms';
import { queryAlarmCategories } from '../services/alarmCategories';

function* searchList(call, put, payload){
  const response = yield call(queryAlarm, payload);
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
  namespace: 'alarms',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    categoryList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield* searchList(call, put, payload);
    },
    *fetchCategories(_, { call, put }) {
      const response = yield call(queryAlarmCategories, {page: 1, per_page: 9999999});
      const result = response.data.rows;
      yield put({
        type: 'saveCategories',
        payload: result,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCategories(state, action) {
      return {
        ...state,
        categoryList: action.payload,
      };
    },
  },
};
