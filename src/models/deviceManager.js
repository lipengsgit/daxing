import { getDevices, getDeviceInfo, getTypes, deleteDevice, saveDevice, updateDevice } from '../services/deviceManager';
import { getPositionByProject, getPositionName } from '../services/positions';
import { getDelegates } from '../services/delegates';

function* searchList(callback, call, put, payload){
  const response = yield call(getDevices, payload);
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
  namespace: 'deviceManager',

  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    deviceStates: [
      {id: 0, name: '使用中'},
      {id: 1, name: '未使用'},
      {id: 2, name: '已报废'},
    ],
    positions: [],
    delegateList: [],
    deviceTypeList: [],
    deviceInfo: {},
  },

  effects: {
    *fetch({ payload , callback}, { call, put }) {
      yield* searchList(callback, call, put, payload);
    },
    *fetchPositions({ payload: { projectId }, callback }, { call, put }) {
      const response = yield call(getPositionByProject, {project_id: projectId});
      const result = response.data;
      yield put({
        type: 'savePositions',
        payload: result,
      });
      if (callback) callback(result);
    },
    *getPositionName({ payload: { positionId }, callback }, { call }) {
      let response = yield call(getPositionName, positionId);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response.data);
    },
    *fetchTypes({ payload }, { call, put }) {
      const response = yield call(getTypes, payload);
      const result = response.data;
      yield put({
        type: 'saveTypes',
        payload: result,
      });
    },
    *setPagination({ payload }, { put }) {
      yield put({
        type: 'savePagination',
        payload,
      });
    },
    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteDevice, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *fetchDelegates({ payload }, { call, put }) {
      const response = yield call(getDelegates, payload);
      const result = response.data.rows;
      yield put({
        type: 'saveDelegates',
        payload: result,
      });
    },
    *saveDevice({ payload, callback }, { call }) {
      let response = yield call(saveDevice, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *updateDevice({ payload, callback }, { call }) {
      let response = yield call(updateDevice, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *fetchDeviceInfo({ payload: { id }, callback }, { call, put }) {
      const response = yield call(getDeviceInfo, id);
      yield put({
        type: 'saveDeviceInfo',
        payload: response.data,
      });
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
    savePositions(state, action) {
      return {
        ...state,
        positions: action.payload,
      };
    },
    savePagination(state, action){
      return {
        ...state,
        data: {
          list: [],
          pagination: action.payload,
        },
      }
    },
    saveTypes(state, action){
      return {
        ...state,
        deviceTypeList: action.payload,
      }
    },
    saveStates(state, action){
      return {
        ...state,
        deviceStates: action.payload,
      }
    },
    saveDelegates(state, action){
      return {
        ...state,
        delegateList: action.payload,
      }
    },
    saveDeviceInfo(state, action){
      return {
        ...state,
        deviceInfo: action.payload,
      }
    },
  },
};
