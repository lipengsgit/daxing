import {queryList ,save,remove,edit,SubSystemInfo,getProxyType} from '../services/subsystemes';

export default {
  namespace: 'subsystem',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentItem: {},
    modalVisible: false,
    systemInfo: {},
    modalType : 'create',
    proxyType:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
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

    *fetchProxyType({payload},{call,put}){
     const response=yield call(getProxyType,payload);
     if(response.success===true){
       yield put({
         type: 'getProxyType',
         payload: response.data.rows,
       });
     }
    },

    *show_add({ callback }, { put }) {
      yield put({
        type: 'saveInfo',
        payload: {},
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call }) {
      let response = yield call(save, payload.data);
        if(typeof  response==="string"){
          response=JSON.parse(response);
        }
       if (callback) callback(response);

    },
    *getInfo({ payload: { id }, callback }, { call, put }) {
      const response = yield call(SubSystemInfo, id);
      yield put({
        type: 'saveInfo',
        payload: response.data,
      });
      if (callback) callback(response);
    },


     *update({payload ,callback} ,{call}){
      let  response=yield  call(edit ,payload.data)
       if(typeof response === "string"){
         response = JSON.parse(response)
       }
       if (callback) callback(response);

     },
    *remove({payload ,callback} ,{call }){
    let response=yield  call(remove ,payload);
    if(typeof response==="string"){
      response=JSON.parse(response);
    }
     if(callback )  callback(response);
    },
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },


    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getProxyType(state,action){
      return{
        ...state,
        proxyType:action.payload,
      }
    },

    saveInfo(state, action){
      return {
        ...state,
        systemInfo: action.payload,
      }
    },
  },
};
