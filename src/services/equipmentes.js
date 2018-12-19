import request from '../utils/request';
import {stringify} from "qs";

export async function queryList(params) {
  return request(`/api/v1/device_categories?${stringify(params)}`);

}
/*
export async function queryUserList(params) {
  return request(`/api/v1/users?${stringify(params)}`);
}
*/

// 新增设备类型
export  async function saveEquipment(params){
    return request('/api/v1/device_categories', {
    method: 'POST',
    body: {
      ...params,
        },
  });
}

// 删除设备类型
export  async function removeEquipment(params){
  return request(`/api/v1/device_categories/${params.id}`, {
    method: 'DElETE',
    body: {
      ...params,
         },
  });
}

// 修改设备类型
export async function editEquipment(params) {
  return request(`/api/v1/device_categories/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

// 获取巡检和维护项目列表
export  async function  queryConfigure(params) {
  return request(`/api/v1/device_categories/${params}/items` ,{
    method: 'GET',
    body:{
      ...params,
    },
  });
}
// 新增配置巡检项目
export  async function saveInspection(params){
  return request(`/api/v1/device_categories/${params.id}/inspection_items`, {
    method: 'POST',
    body: {
      ...params,
    },
  });

}
// 新增配置维护项目
export  async function saveMaintenance(params){
  return request(`/api/v1/device_categories/${params.id}/maintenance_items`, {
    method: 'POST',
    body: {
      ...params,
    },
  });

}
// 修改配置巡检项目
export async function editInspectionItems(params){
  return request(`/api/v1/inspection_items/${params.id}`,{
    method: 'PUT',
    body:{
      ...params,
    },
  })
}
// 修改配置维护项目
export async function editMaintenanceItems(params){
  return request(`/api/v1/maintenance_items/${params.id}`,{
    method:'PUT',
    body:{
      ...params,
    },
  });

}
// 删除配置巡检项目
export async function deleteInspectionItems(params){
  return request(`/api/v1/inspection_items/${params.id}`,{
    method:'DELETE',
    body:{
      ...params,
    },
  });
}
// 删除配置维护项目
export async function deleteMaintenanceItems(params){
  return request(`/api/v1/maintenance_items/${params.id}`,{
    method:'DELETE',
    body:{
      ...params,
    },
  });
}
