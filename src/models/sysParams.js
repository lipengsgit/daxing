import { querySysParam, addSysParam, updateSysParam, deleteSysParam } from '../services/sysParam';

export default {
  namespace: 'sysParams',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    sysParamInfo: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySysParam, payload);
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
    },
    *create({ payload, callback }, { call }) {
      const response = yield call(addSysParam, payload);
      if (callback) callback(response);
    },
    *getInfo({ payload, callback }, { put }) {
      yield put({
        type: 'saveInfo',
        payload: payload,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateSysParam, payload);
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteSysParam, id);
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
    saveInfo(state, action){
      return {
        ...state,
        sysParamInfo: action.payload,
      }
    },
  },
};
