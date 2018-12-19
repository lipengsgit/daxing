import request from '../utils/request';
import {stringify} from "qs";


export async function queryList(params) {
  return request(`/api/v1/delegates?${stringify((params))}`);


}
// 创建子系统
export  async function save(params){
    return request('/api/v1/delegates', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });

}
export  async function SubSystemInfo(id){

  return request(`/api/v1/delegates/${id}`)
}

export  async function remove(params){
  return request(`/api/v1/delegates/${params.id}`, {
    method:'DELETE',

  });
}
export  async function edit(params){
  return request(`/api/v1/delegates/${params.id}`,{
    method: 'PUT',
    body:{
      ...params,
    },
  })
}
 // 获取的代理类型
export  async function getProxyType(params){
  return request(`/api/v1/sys_params/value_name?${stringify(params)}`)
}
