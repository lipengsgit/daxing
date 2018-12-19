import { queryZones, getDataInfo, deleteData, createData, updateData } from '../services/zones';
import { queryCompanies } from '../services/companies';

function* searchList(callback, call, put, payload){
  const response = yield call(queryZones, payload);
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
}

export default {
  namespace: 'zones',

  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    dataInfo: {},
    companyList: [],
  },

  effects: {
    *fetch({ payload , callback}, { call, put }) {
      yield* searchList(callback, call, put, payload);
    },
    *fetchCompany({ payload , callback}, { call }) {
      const response = yield call(queryCompanies, payload);
      if (callback) callback(response.data.rows);
    },
    *fetchDataInfo({ payload: { id }, callback }, { call }) {
      const response = yield call(getDataInfo, id);
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteData, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *create({ payload, callback }, { call }) {
      let response = yield call(createData, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      let response = yield call(updateData, payload);
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
