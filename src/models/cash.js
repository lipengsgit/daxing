import { queryCashRecordList, queryCashChargeList, queryMyCash, addCashCharge, cashConfirm} from '../services/cash';

export default {
  namespace: 'cash',

  state: {
    cashRecordList: {},
    myCashData: {},
    cashChargeList: {},

    auditCashData: {},
    cashAuditList: {},
  },

  effects: {
    *queryCashRecordList({ payload }, { call, put }) {
      const response = yield call(queryCashRecordList, payload);
      if(response.success){
        const cashRecordList = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'saveCashRecordList',
          payload: cashRecordList,
        });
      }
    },
    *queryCashChargeList({ payload }, { call, put }) {
      const response = yield call(queryCashChargeList, payload);
      if(response.success){
        const cashChargeList = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'saveCashChargeList',
          payload: cashChargeList,
        });
      }
    },
    *queryMyCash({ payload }, { call, put }) {
      const response = yield call(queryMyCash, payload);
      if(response.success){
        const myCashData = {
          current_cash: response.data.current_cash, // 我的现金
          total_unchecked: response.data.total_unchecked, // 待对账
          total_checked: response.data.total_checked, // 可归转/可入账
          total_entered: response.data.total_entered, // 入账中
        };
        yield put({
          type: 'saveMyCashData',
          payload: myCashData,
        });
      }
    },
    *addCashCharge({ payload, callback }, { call, put }) {
      const response = yield call(addCashCharge, payload);
      if(response.success){
        if (callback) callback();
      }
    },

    *queryCashAuditList({ payload }, { call, put }) {
      const response = yield call(queryCashChargeList, payload);
      if(response.success){
        const cashAuditList = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'saveCashAuditList',
          payload: cashAuditList,
        });
      }
    },
    *queryAuditCash({ payload }, { call, put }) {
      const response = yield call(queryMyCash, payload);
      if(response.success){
        const auditCashData = {
          total_entered: response.data.total_entered, // 入账中
          total_confirmed: response.data.total_confirmed, // 已完成
        };
        yield put({
          type: 'saveAuditCashData',
          payload: auditCashData,
        });
      }
    },
    *cashConfirm({ payload, callback }, { call, put }) {
      const response = yield call(cashConfirm, payload);
      if(response.success){
        if (callback) callback();
      }
    },
  },

  reducers: {
    saveCashRecordList(state, action) {
      return {
        ...state,
        cashRecordList: action.payload,
      };
    },
    saveCashChargeList(state, action) {
      return {
        ...state,
        cashChargeList: action.payload,
      };
    },
    saveMyCashData(state, action) {
      return {
        ...state,
        myCashData: action.payload,
      };
    },
    saveCashAuditList(state, action) {
      return {
        ...state,
        cashAuditList: action.payload,
      };
    },
    saveAuditCashData(state, action) {
      return {
        ...state,
        auditCashData: action.payload,
      };
    },
  },
};
