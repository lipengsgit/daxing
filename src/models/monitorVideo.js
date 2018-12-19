import { getPositionByProject } from '../services/positions';

export default {
  namespace: 'monitorVideo',

  state: {
    positions: [],
  },

  effects: {
    *fetchPositions({ payload: { projectId }, callback }, { call, put }) {
      const response = yield call(getPositionByProject, {project_id: projectId});
      const result = response.data;
      yield put({
        type: 'savePositions',
        payload: result,
      });
      if (callback) callback(result);
    },
  },

  reducers: {
    savePositions(state, action) {
      return {
        ...state,
        positions: action.payload,
      };
    },
  },
};
