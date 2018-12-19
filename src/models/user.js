import { query as queryUsers, queryById, queryCurrent, queryUserList, addUser, removeUser, updateUser, resetPassword, switchLockStatus,queryUser } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userList: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    editUserData:{
      roles: [],
    },
    userSelf:{},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *queryUserList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      if(response.success){
        const userList = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'saveUserList',
          payload: userList,
        });
        if(callback) callback(userList.list);
      }
    },
    *addUser({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    *removeUser({ payload, callback }, { call }) {
      const response = yield call(removeUser, payload);
      if (callback) callback(response);
    },
    *setEmptyEditUserData({ payload, callback }, { put }) {
      yield put({
        type: 'saveEidtUser',
        payload,
      });
      if (callback) callback();
    },
    *fetchEditUserData({ payload, callback }, { call, put }) {
      const response = yield call(queryById, payload.id);
      yield put({
        type: 'saveEidtUser',
        payload: response.data,
      });
      if (callback) callback();
    },
    *updateUser({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    *resetPassword({ payload, callback }, { call }) {
      const response = yield call(resetPassword, payload);
      if(response.success){
        if (callback) callback();
      }
    },
    *switchLockStatus({ payload, callback }, { call, put }) {
      const response = yield call(switchLockStatus, payload);
      if(response.success){
        const userResponse = yield call(queryById, payload.id);
        yield put({
          type: 'saveEidtUser',
          payload: userResponse.data,
        });
        if (callback) callback();
      }
    },
    *queryUser({ payload },{ call, put }) {
      const response = yield call(queryUser);
      yield put({
        type: 'userSelf',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveUserList(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    saveEidtUser(state, action) {
      return {
        ...state,
        editUserData: action.payload,
      };
    },
    userSelf(state,action){
      return {
        ...state,
        userSelf: action.payload,
      };
    },
  },
};
