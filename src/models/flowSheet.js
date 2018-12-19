import {queryList , queryPayList,queryUnpaidRoomInfo,queryOrderInfo, updateMobile,sendMessage,saveInvoices,queryHistoryPay,savePay,queryChargeMode,queryInvoiceUserInfo} from '../services/flowSheetes';
import {getZones} from "../services/selectHouse";

export default {
  namespace: 'flowSheet',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    historyPayData:{},
    InvoiceUserInfo:{},
    searchData:{},
    chargeModeData:[],
    DomainData:[],
  },

  effects: {
    // 缴费流水单
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      if(response.success){
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
      }
    },
     // 根据 姓名 或者房号筛选缴费信息
    *searchValue({payload,callback},{call,put}) {
      const response = yield call(queryPayList, payload);
      if(response.success){
        const result = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'searchData',
          payload: result,
        });
      }

      },

    // 根据小区编号筛选缴费房源
    *SearchDomain({payload,callback},{call,put}){
      const response = yield call(queryPayList, payload);
      if(response.success){
        const result = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            page_size: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'searchData',
          payload: result,
        });
        if(callback) callback(result.pagination);
      }

    },


    // 查询待缴费房屋信息
    *queryUnpaidRoomInfo({ payload ,callback},{call,put}){
      const response=yield call(queryUnpaidRoomInfo,payload);
       if (callback) callback(response);
    },

    // 缴费
    *savePay({payload,callback},{call}){
      const response=yield call(savePay,payload);
      if (callback) callback(response);
    },

    // 缴费完成后短信通知
    *sendOrderMessage({payload,callback},{call}){
       //const response=yield call(sendMessage,payload);
       const response={success:true}
       if(response.success){
         callback(response)
       }

    },
   //  更改订单绑定手机号
    *updateMobile({payload,callback},{call}){
      const response=yield call(updateMobile,payload);
      if(response.success){
        callback(response)
      }
    },

    // 查询待开发票 的用户信息
    * queryInvoiceUserInfo({payload:{id} ,callback},{call,put}){
      const response=yield call(queryInvoiceUserInfo,id);
 /*     yield put({
        type:'InvoiceUserInfo',
        payload:response.data,
      }) */
      if(callback) callback(response.data);
    },

   // 新增开票信息
    *saveInvoice({payload,callback},{call}){
      let response=yield call(saveInvoices,payload);
      if(typeof  response==="string"){
        response=JSON.parse(response);
      }
      if (callback) callback(response);
    },

    // 查询个人中心 历史收费
    *fetchHistoryPay({payload,callback},{call,put}){
      const response = yield call(queryHistoryPay, payload);
      if(response.success){
        const result = {
          list: response.data.rows,
        };
        yield put({
          type: 'historyData',
          payload: result,
        });
      }
    },
    // 查询首页 收费方式构成
    *fetchChargeMode({payload},{call,put}){
      const response=yield call(queryChargeMode,payload);
      if(response.success){
        const result = {
          list: response.data.rows,
        };
        yield put({
          type:'chargeMode',
          payload: result,
        })
      }
    },


    *setPagination({ payload }, { put }) {
      yield put({
        type: 'savePagination',
        payload,
      });
    },

    // 查询 筛选小区列表
    *getZones({ payload, callback }, { call,put }) {
      const response = yield call(getZones,payload);
     if(response.success){
       yield put({
         type:'selectDomain',
         payload: response.data.rows,
       })
     }

    },
    // 查询订单详情
    *queryOrderInfo({payload:{id},callback},{call}){
      const response=yield call(queryOrderInfo,id);
      if(response.success){
        callback(response.data);
      }

    },




  },

  reducers: {

     InvoiceUserInfo(state,action){
       return{
         ...state,
         InvoiceUserInfo:action.payload,
       }
     },


    searchData(state,action){
       return{
         ...state,
         searchData:action.payload,
      };
    },


    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    chargeMode(state,action){
       return {
         ...state,
         chargeModeData:action.payload.list,
       }
    },

    saveInfo(state, action){
      return {
        ...state,
        systemInfo: action.payload,
      }
    },

    historyData(state,action){
       return {
         ...state,
         historyPayData:action.payload,
      }
    },
    selectDomain(state,action){
      return {
        ...state,
        DomainData:action.payload,
      }
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
  },
};
