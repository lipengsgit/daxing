import { queryMessagesList, deleteMessage } from '../services/messages';

function* searchList(call, put, payload) {
  const response = yield call(queryMessagesList, payload);
  if (response.success) {
    const result = {
      list: response.data.rows,
      pagination: {
        total: response.data.total,
        page_size: response.data.page_size,
        current: response.data.current,
      },
    };
    yield put({
      type: 'saveMessagesList',
      payload: result,
    });
  }
}

export default {
  namespace: 'messages',

  state: {
    messagesList: {},
  },

  effects: {
    *fetchMessagesList({ payload }, { call, put }) {
      yield* searchList(call, put, payload);
    },
    *deleteMessage({ payload, callback }, { call, put }) {
      const response = yield call(deleteMessage, payload);
      // if(response.success){
        if (callback) callback();
        yield* searchList(call, put, {});
      // }
    },

  },

  reducers: {
    saveMessagesList(state, action) {
      return {
        ...state,
        messagesList: action.payload,
      };
    },

  },
};
