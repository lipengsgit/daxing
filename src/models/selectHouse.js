import {getZones,getBuilds,getHouse} from '../services/selectHouse';

export default {
  namespace: 'selectHouse',
  state: {

  },

  effects: {
    *getZones({ payload, callback }, { call }) {
      const response = yield call(getZones,{ ...payload, page: 1, per_page: 99999 });
      if(JSON.stringify(response)==='{}')return;
      if (callback) callback(response);
    },

    *getBuild({ payload, callback }, { call }) {
      const response = yield call(getBuilds,{ ...payload, page: 1, per_page: 99999 });
      if(JSON.stringify(response)==='{}')return;
      if (callback) callback(response);
    },

     *getHouse({payload,callback},{call}){
       const response=yield call(getHouse,{ ...payload, page: 1, per_page: 99999 });
       if(callback) callback(response);
     },


  },

  reducers: {
    ProvinceInfo(state, action){
      return {
        ...state,
        ProvinceInfo: action.payload,
      }
    },

  },
};
