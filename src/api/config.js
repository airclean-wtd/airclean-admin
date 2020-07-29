import axios from 'axios';

let base = 'http://airclean-api.hehear.com';
//let base = 'http://localhost:8080';

export const getDeviceTpList = params => { return axios.get(`${base}/dataConfig/queryByKey`, { params: params });};

export const getListPage = params => { return axios.get(`${base}/dataConfig/queryPage`, { params: params });};

export const dlt = params => { return axios.get(`${base}/dataConfig/delete`, { params: params }); };

export const upd = params => { return axios.post(`${base}/dataConfig/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const add = params => { return axios.post(`${base}/dataConfig/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};
