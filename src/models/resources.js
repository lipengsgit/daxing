import * as resourcesService from '../services/resources';

export default {
  namespace: 'resources',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(resourcesService.queryResources, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
        },
      })
    },
    *create({ payload, callback }, { call }) {
      const response = yield call(resourcesService.addResource, payload);
      if (callback) callback(response);
    },
    *remove({ payload: id, callback }, { call }) {
      let response = yield call(resourcesService.removeResource, id);
      if(typeof response === "string") {
        response = JSON.parse(response)
      }
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(resourcesService.updateResource, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload: { list }}) {
      return {
        ...state,
        list,
      };
    },
  },
};
