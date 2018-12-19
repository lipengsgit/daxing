import {queryHistoryOrder,queryAddressZones,queryAddressBuildings,queryAddressUnits,queryBySearch,
        queryMessage,sendMessage,queryInvoice,addInvoiceInfo,FormInfo,queryByDateSearch,queryList,returnMoney} from '../services/histories';


export default {
  namespace: 'histories',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataInfo: [],
    zonesData:[],
    buildingsData:[],
    unitsData:[],
  },

  effects: {

    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryHistoryOrder, payload);
      const result = {
        list: response.data.rows,
        pagination: {
          total: response.data.total,
          page_size: response.data.page_size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'show',
        payload: result,
      });
      if (callback) callback(result);
    },

    // 查询小区
    *fetchByZones({ payload ,callback}, { call, put }) {
      const response = yield call(queryAddressZones,payload);
      yield put({
        type: 'showZones',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 根据小区查楼号
    *fetchByBuildings({ payload ,callback}, { call, put }) {
      const response = yield call(queryAddressBuildings,payload);
      yield put({
        type: 'showBuildings',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 根据楼号查房间号
    *fetchByUnits({ payload ,callback}, { call, put }) {
      const response = yield call(queryAddressUnits,payload);
      yield put({
        type: 'showUnits',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 级联查询列表
    *fetchList({ payload ,callback}, { call, put }) {
      const response = yield call(queryList,payload);
      const result = {
        list: response.data.rows,
        pagination: {
          total: response.data.total,
          page_size: response.data.page_size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'show',
        payload: result,
      });
      if (callback) callback(result);
    },
    // 根据业主姓名,房号,手机号进行查询
    *fetchBySearch({ payload ,callback}, { call, put }) {
      const response = yield call(queryBySearch,payload);
      const result = {
        list: response.data.rows,
        pagination: {
          total: response.data.total,
          page_size: response.data.page_size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'show',
        payload: result,
      });
      if (callback) callback(result);
    },
    // 根据日期进行查询
    *fetchByDate({ payload ,callback}, { call, put }) {
      const response = yield call(queryByDateSearch,payload);
      const result = {
        list: response.data.rows,
        pagination: {
          total: response.data.total,
          page_size: response.data.page_size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'show',
        payload: result,
      });
      if (callback) callback(result);
    },
    // 根据手机号查询短信内容
    *fetchByPhone({ payload ,callback}, { call, put }) {
      const response = yield call(queryMessage,payload);
      yield put({
        type: 'show',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 短信Info
    *getMessageInfo({ payload: { id }, callback }, { call, put }) {
      let response = yield call(FormInfo,id);
      yield put({
        type: 'saveInfo',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 发票Info
    *getInvoiceInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryInvoice, payload);
      yield put({
        type: 'invoiceInfo',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 发短信
    *sendByPhone({ payload ,callback}, { call}) {
      const response = yield call(sendMessage,payload);
      if (callback) callback(response);
    },
    // 退款
    *refundButton({ payload,callback}, { call }) {
      const response = yield call(returnMoney,payload);
      if (callback) callback(response);
    },
    // 查询发票信息
    *fetchByList({ payload ,callback}, { call, put }) {
      const response = yield call(queryInvoice,payload);
      yield put({
        type: 'show',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 申请发票
    *applicationInvoice({ payload, callback }, { call}) {
     const response = yield call(addInvoiceInfo, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    // 接受服务器数据返回
    show(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    // 小区
    showZones(state, action) {
      return {
        ...state,
        zonesData: action.payload,
      };
    },
    // 楼栋
    showBuildings(state, action) {
      return {
        ...state,
        buildingsData: action.payload,
      };
    },
    // 房号
    showUnits(state, action) {
        return {
          ...state,
          unitsData: action.payload,
        };
      },

    pageShow(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    saveInfo(state, action){
      return {
        ...state,
        dataInfo: action.payload.data,
      }
    },

    showSearch(state,action){
      return{
        ...state,
        data:action.payload,
      }
    },
    invoiceInfo(state, action){
      return {
        ...state,
        dataInfo: action.payload,
      }
    },

  },
};
