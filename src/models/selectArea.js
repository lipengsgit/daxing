import {getProvince} from '../services/selectAreaes';

export default {
  namespace: 'selectArea',
  state: {

  },

  effects: {
/*    *getArea({ payload, callback }, { call }) {
      const response = yield call(getProvince,payload);
      const result =[]
      if(response.success){
        response.data.areas.map((key) =>
          result.push(
            {
              value: key.adcode,
              label: key.name,
              level: key.level,
              citycode:key.citycode,
              isLeaf:false,
            }
          )
        )
      }

      if (callback) callback(result);
    }, */

    *getArea({ payload, callback }, { call }) {
      const response = yield call(getProvince,payload);
      if (callback) callback(response);
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
