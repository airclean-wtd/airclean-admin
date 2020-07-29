import axios from 'axios';

let base = 'http://airclean-api.hehear.com';
//let base = 'http://localhost:8080';

export const getDeviceList = params => { return axios.get(`${base}/device/queryList`, { params: params });};

export const getListPage = params => { return axios.get(`${base}/device/queryPage`, { params: params });};

export const dlt = params => { return axios.get(`${base}/device/delete`, { params: params }); };

export const upd = params => { return axios.post(`${base}/device/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const add = params => { return axios.post(`${base}/device/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};
