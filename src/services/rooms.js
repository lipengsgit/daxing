import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRooms(params) {
  return request(`/api/v1/rooms?${stringify(params)}`);
}

export async function createData(params) {
  return request('/api/v1/rooms', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getDataInfo(id) {
  return request(`/api/v1/rooms/${id}`);
}

export async function updateData(params) {
  return request(`/api/v1/rooms/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(id) {
  return request(`/api/v1/rooms/${id}`, {
    method: 'DELETE',
  });
}

// 查询待缴房屋信息
export async function queryUnpaidRoomInfo(params){
  return request(`/api/v1/rooms/${params.room_id}/unpaid_room_info`);
}
