import axios from 'axios';

let base = '';

export const getList = params => { return axios.get(`http://localhost:8080/room/list`, { params: params }); };

export const getListPage = params => { return axios.get(`http://localhost:8080/room/queryPage`, params); };

export const dlt = params => { return axios.get(`http://localhost:8080/room/delete`, { params: params }); };

export const upd = params => { return axios.post(`http://localhost:8080/room/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const add = params => { return axios.post(`http://localhost:8080/room/save`, params,{headers: {"Content-Type": "application/json;charset=utf-8"}});};

export const bind = params => { return axios.get(`http://localhost:8080/room/bind`, { params: params }); };
