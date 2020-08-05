import axios from 'axios';

let base = 'http://airclean-api.hehear.com';
//let base = 'http://localhost:8080';

export const getListPage = params => { return axios.get(`${base}/room/queryPage`, { params: params });};

export const dlt = params => { return axios.get(`${base}/room/delete`, { params: params }); };

export const upd = params => { return axios.post(`${base}/room/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const add = params => { return axios.post(`${base}/room/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const bind = params => { return axios.get(`${base}/room/bind`, { params: params }); };

export const getRoomList = params => { return axios.get(`${base}/room/queryRoomList`, { params: params });};
