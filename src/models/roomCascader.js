import { queryZones } from '../services/zones';
import { queryBuildings } from '../services/buildings';
import { queryUnits } from '../services/units';

export default {
  namespace: 'roomCascader',
  state: {
    zones: [],
    buildings: [],
    units: [],
    value: {
      zoneId: undefined,
      buildingId: undefined,
      unitId: undefined,
    },
  },

  effects: {
    * fetchZones({ payload }, { call, put }) {
      const response = yield call(queryZones, { ...payload, page: 1, per_page: 99999 });
      const result = response.data.rows;
      yield put({
        type: 'saveZones',
        payload: result,
      });
    },

    * fetchBuildings({ payload }, { call, put }) {
      const response = yield call(queryBuildings, { ...payload, page: 1, per_page: 99999 });
      const result = response.data.rows;
      yield put({
        type: 'saveBuildings',
        payload: result,
      });
    },

    * fetchUnits({ payload }, { call, put }) {
      const response = yield call(queryUnits, { ...payload, page: 1, per_page: 99999 });
      const result = response.data.rows;
      yield put({
        type: 'saveUnits',
        payload: result,
      });
    },
  },

  reducers: {
    saveZones(state, action) {
      return {
        ...state,
        zones: action.payload,
      };
    },
    saveBuildings(state, action) {
      return {
        ...state,
        buildings: action.payload,
      };
    },
    saveUnits(state, action) {
      return {
        ...state,
        units: action.payload,
      };
    },
    selectZone(state, action) {
      return {
        ...state,
        units: [],
        value: {
          zoneId: action.payload,
        },
      };
    },
    selectBuilding(state, action) {
      return {
        ...state,
        value: {
          ...state.value,
          buildingId: action.payload,
          unitId: undefined,
        },
      };
    },
    selectUnit(state, action) {
      return {
        ...state,
        value: {
          ...state.value,
          unitId: action.payload,
        },
      };
    },
    initial(state) {
      return {
        ...state,
        buildings: [],
        units: [],
        value: {
          zoneId: undefined,
          buildingId: undefined,
          unitId: undefined,
        },
      };
    }
  },
};
