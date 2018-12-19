import {queryHistoryOrder, queryInvoice,addInvoiceInfo} from '../services/InvoiceColumns';
import {queryZones} from "../services/zones";
import {queryUnits} from "../services/units";
import {queryBuildings} from "../services/buildings";


export default {
  namespace: 'InvoiceColumns',

  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    zoneList:[],
    buildingList:[],
    unitList:[],
    Info:{},
  },

  effects: {

    *fetch({ payload }, { call, put }) {
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

    // 发票Info
    *getInvoiceInfo({ payload:{id} }, { call, put }) {
      const response = yield call(queryInvoice, id);
      const result = response.data;
      yield put({
        type: 'invoiceInfo',
        payload: result,
      });
    },
    // 开票
    *applicationInvoice({ payload, callback }, { call}) {
      const response = yield call(addInvoiceInfo, payload);
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
    invoiceInfo(state, action) {
      return {
        ...state,
        Info: action.payload,
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
  },
};
