import { queryCompanies, getCompanyInfo, deleteCompany, createCompany, updateCompany } from '../services/companies';

function* searchList(callback, call, put, payload){
  const response = yield call(queryCompanies, payload);
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
  namespace: 'companies',

  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    companyInfo: {},
  },

  effects: {
    *fetch({ payload , callback}, { call, put }) {
      yield* searchList(callback, call, put, payload);
    },
    *fetchCompanyInfo({ payload: { id }, callback }, { call, put }) {
      const response = yield call(getCompanyInfo, id);
      yield put({
        type: 'saveCompanyInfo',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteCompany, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *createCompany({ payload, callback }, { call }) {
      let response = yield call(createCompany, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *updateCompany({ payload, callback }, { call }) {
      let response = yield call(updateCompany, payload);
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
    saveCompanyInfo(state, action){
      return {
        ...state,
        companyInfo: action.payload,
      }
    },
  },
};
