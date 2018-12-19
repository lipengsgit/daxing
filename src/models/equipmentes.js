import {queryList ,saveEquipment, removeEquipment,editEquipment,
        queryConfigure,saveInspection,saveMaintenance,editInspectionItems,editMaintenanceItems,
        deleteInspectionItems,deleteMaintenanceItems} from '../services/equipmentes';

export default {
  namespace: 'equipmentes',

  state: {
    data: {
      list: [],
      pagination: {},
    },

    configure_list:[],
  },

  // call 以异步的方式调用函数
  // select 从state中获取相关的数据
  // take  获取发送的数据

  effects: {

    *fetch({payload,callback} ,{ call }) {
      const response = yield call(queryList,payload);
      if(response.success){
        const result = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            pageSize: response.data.page_size,
            current: response.data.current,
          },
        };
        if (callback) callback(result);
      }

    },

    // 返回 data
    *fetch1({payload} ,{ call, put }) {
      const response = yield call(queryList,payload);
      if(response.success){
        const result = {
          list: response.data.rows,
          pagination: {
            total: response.data.total,
            pageSize: response.data.page_size,
            current: response.data.current,
          },
        };
        yield put({
          type: 'save',
          payload: result,
        });
      }

    },

    *setPagination({ payload }, { put }) {
      yield put({
        type: 'savePagination',
        payload,
      });
    },

    // 添加设备类型
    *saveEquipment({ payload, callback }, { call }) {
      let response = yield call(saveEquipment, payload);
      if(typeof response ==="string"){
        response=JSON.parse(response);
       }
      if (callback) callback(response);
    },


     // 修改设备类型
     *edit_equipment({payload ,callback} ,{call}){
    let response= yield  call(editEquipment ,payload)
       if(typeof response === "string"){
         response = JSON.parse(response)
       }
       if (callback) callback(response);

     },
    // 删除设备
    *delete_equipment({payload ,callback} ,{call }){
   let response=yield  call(removeEquipment ,payload);
   if(typeof response ==="string"){
     response=JSON.parse(response);
   }
   if(callback )  callback(response);
    },

    // 根据设备id查询巡检维护项目
    *configure({payload :{ id },callback},{call,put}){
      const response=yield  call(queryConfigure,id);
      yield put({
        type: 'save_configue',
        payload:response,
      });
      if (callback) callback(response);
    },

    // 新增配置巡检项目
    *config_inspection_items({payload,callback},{call}) {
      let response = yield call(saveInspection, payload);
      if (typeof response === "string") {
        response = JSON.parse(response);
      }
      if (callback) callback(response);
    },
    // 新增配置 维护项目
    *config_maintenance_items({payload,callback},{call}) {
      let response = yield call(saveMaintenance, payload);
      if (typeof response === "string") {
        response = JSON.parse(response);
      }
      if (callback) callback(response);
    },

    // 修改配置巡检项目
    *edit_inspection({payload,callback},{call}){
      console.log("进入edit_inspectionmodel")
      let response=yield  call(editInspectionItems,payload);
      if(typeof  response==="string"){
        response=JSON.parse(response);
      }
      if(callback)callback(response);
    },

     // 修改配置维护项目
    *edit_maintenance({payload,callback},{call}){
      console.log("进入edit_maintenancemodel")
      let response=yield call(editMaintenanceItems,payload);
      if(typeof response==="string"){
        response=JSON.parse(response);
      }
      if(callback)callback(response);
    },
    // 删除配置巡检项目
    *delete_inspection({payload,callback},{call}){
      let response=yield call(deleteInspectionItems,payload);
      if(typeof  response==="string"){
        response=JSON.parse(response);
      }
      if(callback)callback(response);
    },
    // 删除配置维护项目
    *delete_maintenance({payload,callback},{call}){
      let response=yield call(deleteMaintenanceItems,payload);
      if(typeof response==="string"){
        response=JSON.parse(response);
      }
      if(callback)callback(response);
    },

  },



  reducers: {
    querylist(state, action) {
      return {
        ...state,
        equipment_list: action.payload,
      };
    },


    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // 保存查询出的巡检维护 数据
    save_configue(state,action){
      return {
        ...state,
        configure_list: action.payload,
      };
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
