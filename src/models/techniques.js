import { queryTechniques, addTechnique, updateTechnique, deleteTechnique } from '../services/techniques';

export default {
  namespace: 'techniques',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTechniques, payload);
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
      let response = yield call(addTechnique, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      let response = yield call(updateTechnique, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteTechnique, id);
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
