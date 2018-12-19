import { queryTradeOrders, sendMessage, returnMoney, addInvoiceInfo, createData,queryHistoryPay,queryCashStatistics} from "../services/tradeOrders";
import { queryZones } from "../services/zones";
import { queryBuildings } from '../services/buildings';
import { queryUnits } from "../services/units";


export default {
  namespace: 'tradeOrders',

  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    payResult: {},
    zoneList:[],
    buildingList:[],
    unitList:[],
    cashStatistics:{},
    historyData:[],
  },

  effects: {
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(queryTradeOrders, payload);
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

    *fetchZones({ payload }, { call, put }) {
      const response = yield call(queryZones, payload);
      const result = response.data.rows;
      yield put({
        type: 'saveZones',
        payload: result,
      });
    },

    *fetchBuildings({ payload }, { call, put }) {
      const response = yield call(queryBuildings, payload);
      const result = response.data.rows;
      yield put({
        type: 'saveBuildings',
        payload: result,
      });
    },

    *fetchUnits({ payload }, { call, put }) {
      const response = yield call(queryUnits, payload);
      const result = response.data.rows;
      yield put({
        type: 'saveUnits',
        payload: result,
      });
    },
    // 缴费
    *create({ payload, callback }, { call, put }){
      const response = yield call(createData, payload);
      yield put({
        type: 'saveOrder',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *sendByPhone({ payload, callback}, { call }) {
      const response = yield call(sendMessage, payload);
      if (callback) callback(response);
    },
    // 退款
    *refundButton({ payload,callback}, { call }) {
      const response = yield call(returnMoney,payload);
      if (callback) callback(response);
    },
    // 申请发票
    *applicationInvoice({ payload, callback }, { call}) {
      const response = yield call(addInvoiceInfo, payload);
      if (callback) callback(response);
    },
    // 个人中心 历史累计收费
    *fetchHistoryPay({payload},{call,put}){
      const response = yield call(queryHistoryPay, payload);
      if(response.success){
        yield put({
          type: 'historyData',
          payload: response.data,
        });
      }
    },
    // 个人中心实时现金统计
    *fetchRealCash({payload},{call,put}){
      const response = yield call(queryCashStatistics, payload);
      if(response.success){
        yield put({
          type: 'CashStatistics',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    saveZones(state, action) {
      return {
        ...state,
        zoneList: action.payload,
      };
    },

    saveBuildings(state, action) {
      return {
        ...state,
        buildingList: action.payload,
      };
    },

    saveUnits(state, action) {
      return {
        ...state,
        unitList: action.payload,
      };
    },

    saveOrder(state, action) {
      return {
        ...state,
        payResult: action.payload,
      };
    },
    clearPayResult(state) {
      return {
        ...state,
        payResult: {},
      };
    },
    CashStatistics(state,action){
      return {
        ...state,
        cashStatistics: action.payload,
      };
    },
    historyData(state,action){
      return {
        ...state,
        historyData:action.payload,
      };
    },

  },
};
