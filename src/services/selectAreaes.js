import request from '../utils/request';
import {stringify} from "qs";


// 查询区域 省级
 export  async function getProvince(params){
  return request(`/api/v1/administrative_areas?${stringify((params))}`);
}







