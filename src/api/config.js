import axios from 'axios';

let base = '';

export const getListPage = params => { return axios.get(`http://localhost:8080/dataConfig/queryPage`, { params: params });};

export const dlt = params => { return axios.get(`http://localhost:8080/dataConfig/delete`, { params: params }); };

export const upd = params => { return axios.post(`http://localhost:8080/dataConfig/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const add = params => { return axios.post(`http://localhost:8080/dataConfig/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};
