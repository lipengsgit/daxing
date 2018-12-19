import request from '../utils/request';
import {stringify} from "qs";


// 查询所有小区
 export  async function getZones(){
  return request(`/api/v1/zones`);
}

// 查询楼栋
export async function getBuilds(params) {
  return request(`/api/v1/buildings?${stringify(params)}`);
}

// 查询单元 房号
export async function getHouse(params){
  return request(`/api/v1/rooms?${stringify(params)}`);

}




