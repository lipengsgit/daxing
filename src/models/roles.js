import { queryRole, queryResource, addRole, getRoleInfo, updateRole, deleteRole } from '../services/roles';

function* searchList(call, put, payload){
  const response = yield call(queryRole, payload);
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
  namespace: 'roles',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleInfo: {},
    resources: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield* searchList(call, put, payload);
    },
    *fetchResources({ payload }, { call, put }) {
      const response = yield call(queryResource, payload);
      const result = response.data;
      yield put({
        type: 'saveResource',
        payload: result,
      });
    },
    *add({ callback }, { put }) {
      yield put({
        type: 'saveInfo',
        payload: {},
      });
      if (callback) callback();
    },
    *create({ payload, callback }, { call }) {
      let response = yield call(addRole, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *getInfo({ payload: { id }, callback }, { call, put }) {
      const response = yield call(getRoleInfo, id);
      yield put({
        type: 'saveInfo',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      let response = yield call(updateRole, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteRole, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *updateResource({ payload, callback }, { call }) {
      yield call(updateRole, payload);
      if (callback) callback();
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
        roleInfo: action.payload,
      }
    },
    saveResource(state, action){
      return {
        ...state,
        resources: action.payload,
      }
    },
  },
};
