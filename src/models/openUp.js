import {queryOpenOrder,returnSuccess,returnAssign,queryDetails} from '../services/openUp';
import {queryZones} from "../services/zones";
import {queryBuildings} from "../services/buildings";
import {queryUnits} from "../services/units";
import {query as queryUsers} from "../services/user";


export default {
  namespace: 'openUp',


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
    listInfoData:{},// 订单详情
    detailsInfo:{},
    userList:[],// username
  },

  effects: {

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOpenOrder, payload);
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
    // 工单详情
    *fetchDetails({ payload :{id} }, { call ,put}) {
      const response = yield call(queryDetails,id);
      const result = response.data;
      yield put({
        type: 'saveDetails',
        payload: result,
      });
    },
    // 工单负责人
    *principalAssign({ payload ,callback}, { call }) {
      const response = yield call(returnAssign,payload);
      if (callback) callback(response);
    },
    // 完成提交
    *completeButton({ payload,callback}, { call }) {
      const response = yield call(returnSuccess,payload);
      if (callback) callback(response);
    },
    // 获取用户name
    *fetchUser(_, { call, put }) {
      const response = yield call(queryUsers);
      const result = response.data.rows;
      yield put({
        type: 'save',
        payload: result,
      });
    },

  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        userList: action.payload,
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
    saveDetails(state, action) {
       return {
        ...state,
         listInfoData: action.payload,
      };
    },
    invoiceInfo(state, action){
      return {
        ...state,
        detailsInfo: action.payload,
      }
    },

  },
};
