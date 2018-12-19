import { queryCompnayList, queryProjectByCompanyId } from '../services/devices';

export default {
  namespace: 'devices',

  state: {
    companyList: [],
    projectList: {},
  },

  effects: {
    *fetchCompanyList({ payload }, { call, put }) {
      const response = yield call(queryCompnayList, payload);
      yield put({
        type: 'saveCompanyList',
        payload: response,
      });
      yield put({
        type: 'saveProjectList',
        payload: {},
      });
    },
    *queryProjectList({ payload }, { call, put }) {
      const response = yield call(queryProjectByCompanyId, payload);
      if(response.success){
        yield put({
          type: 'saveProjectList',
          payload: response.data,
        });
      }

    },

  },

  reducers: {
    saveCompanyList(state, action) {
      return {
        ...state,
        companyList: action.payload,
      };
    },
    saveProjectList(state, action) {
      return {
        ...state,
        projectList: action.payload,
      };
    },

  },
};
