import { queryRooms, getDataInfo, deleteData, createData, updateData, queryUnpaidRoomInfo } from '../services/rooms';

function* searchList(callback, call, put, payload){
  const response = yield call(queryRooms, payload);
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
  namespace: 'rooms',
  state: {
    data: {
      list: [],
      pagination: {
        page_size: 10,
        current: 1,
      },
    },
    dataInfo: {},
    unpaidList: [],
    hasUnpaid: false,
    roomInfo: {},
    unpaidInfo: {},
    applyInvoiceVisible:false,
  },

  effects: {
    *fetch({ payload , callback}, { call, put }) {
      yield* searchList(callback, call, put, payload);
    },
    // 查询待缴费房屋信息
    *fetchUnpaidRoomInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryUnpaidRoomInfo, payload);
      yield put({
        type: 'unpaidList',
        payload: response,
      });
      if (callback) callback(response);
    },

    *fetchDataInfo({ payload: { id }, callback }, { call }) {
      const response = yield call(getDataInfo, id);
      if (callback) callback(response);
    },

    *delete({ payload: { id }, callback }, { call }) {
      let response = yield call(deleteData, id);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },

    *create({ payload, callback }, { call }) {
      let response = yield call(createData, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },

    *update({ payload, callback }, { call }) {
      let response = yield call(updateData, payload);
      if(typeof response === "string"){
        response = JSON.parse(response)
      }
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
    unpaidList(state, action) {
      const list = Array.isArray(action.payload.data) ? action.payload.data : [];
      let unpaid = false;
      let toPayInfo = {};
      if(list.length > 1) {
        unpaid = true;
        toPayInfo = {};
      } else if(list.length === 1) {
        [ toPayInfo ] = list;
      }
      return {
        ...state,
        unpaidList: list,
        hasUnpaid: unpaid,
        unpaidInfo: toPayInfo,
      }
    },
    list(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    clearUnpaidList(state) {
      return {
        ...state,
        unpaidList: [],
        hasUnpaid: false,
      }
    },
    clearUnpaidInfo(state) {
      return {
        ...state,
        unpaidInfo: {},
      }
    },
    setRoomInfo(state, action) {
      return {
        ...state,
        roomInfo: action.payload,
      }
    },
    prePay(state, action) {
      return {
        ...state,
        unpaidInfo: action.payload,
      }
    },
    setApplyInvoice(state,action){
      return {
        ...state,
        applyInvoiceVisible: action.payload,
      }

    },

  },
};
