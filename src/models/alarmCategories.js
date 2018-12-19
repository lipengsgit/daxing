import { queryAlarmCategories, addAlarmCategory, updateAlarmCategory, deleteAlarmCategory } from '../services/alarmCategories';

export default {
  namespace: 'alarmCategories',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmCategories, payload);
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
      if (callback) callback(result);
    },
    *create({ payload, callback }, { call }) {
      let response = yield call(addAlarmCategory, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      let response = yield call(updateAlarmCategory, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteAlarmCategory, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
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
