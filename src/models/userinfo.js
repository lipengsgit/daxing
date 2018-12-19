import { query, queryCurrent,changePassWord } from '../services/userinfo';
import {message} from "antd/lib/index";


export default {
  namespace: 'userinfo',

  state: {
    list: [],
    currentUser: {},
    // 该用户 仅存放 个人中心 用户信息，暂时和系统当前用户区分，
    userinfo:{},
    // 该状态 用于修改成功后 页面根据该状态 修改提交按钮 状态，
    submitVisible :{} ,


  },

  effects: {
    *fetchUser(_, { call, put }) {
      const response = yield call(query);
      if(response.success){
        yield put({
          type: 'showUser',
          payload: response.data,
        });
      }
    },

    *submit_change_pwd({ payload }, { call ,put}) {
      const response =yield call(changePassWord, payload);
      if(response.success ){
        message.success('修改成功');
      }else{
        message.error('修改失败');
      }
      yield put({
        type : 'changeVisible',
        payload:response,
      });

    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
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
   // 个人中心 返回数据
    showUser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },
    // 个人中心修改密码 返回状态
    changeVisible(state,action){
    return{
      ...state,
      submitVisible: action.payload,

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
  },
};
