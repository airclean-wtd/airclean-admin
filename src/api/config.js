import axios from 'axios';

let base = '';

export const getList = params => { return axios.get(`${base}/device/list`, { params: params }); };

export const getListPage = params => { return axios.get(`${base}:8080/device/query`, { params: params }); };

export const dlt = params => { return axios.get(`${base}/device/remove`, { params: params }); };

export const upd = params => { return axios.get(`${base}/device/edit`, { params: params }); };

export const add = params => { return axios.get(`${base}/device/add`, { params: params }); };