import { getTotalIncomeData, getPaidRoomData, getFullPaidData,
  getAmountByZoneData, getPaymentTypeData,
  getPaidByZoneData, getOpenProgressData } from '../services/charts';

export default {
  namespace: 'chart',

  state: {
    totalIncomeData: {}, // 统计总收费额
    paidRoomData: {}, // 已支付户数和收费完成率
    fullPaidData: {}, // 全额收费比例
    paidByZoneData: [], // 各小区缴费比例
    paymentTypeData: {}, // 收费方式构成
    amountByZoneData: {}, // 收费额区域占比
    openProgressData: {}, // 开通进度
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const totalIncomeDataResponse = yield call(getTotalIncomeData);
      const paidRoomDataResponse = yield call(getPaidRoomData);
      const fullPaidDataResponse = yield call(getFullPaidData);
      const paidByZoneDataResponse = yield call(getPaidByZoneData);
      const paymentTypeDataResponse = yield call(getPaymentTypeData);
      const amountByZoneDataResponse = yield call(getAmountByZoneData);
      const openProgressDataResponse = yield call(getOpenProgressData);
      const result = {
        totalIncomeData: totalIncomeDataResponse.data,
        paidRoomData: paidRoomDataResponse.data,
        fullPaidData: fullPaidDataResponse.data,
        paidByZoneData: paidByZoneDataResponse.data,
        paymentTypeData: paymentTypeDataResponse.data,
        amountByZoneData: amountByZoneDataResponse.data,
        openProgressData: openProgressDataResponse.data,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        totalIncomeData: {}, // 统计总收费额
        paidRoomData: {}, // 已支付户数和收费完成率
        fullPaidData: {}, // 全额收费比例
        paidByZoneData: [], // 各小区缴费比例
        paymentTypeData: {}, // 收费方式构成
        amountByZoneData: {}, // 收费额区域占比
        openProgressData: {}, // 开通进度
      };
    },
  },
};
