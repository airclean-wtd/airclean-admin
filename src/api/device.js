import axios from 'axios';

let base = '';

export const getDeviceList = params => { return axios.get(`${base}/device/list`, { params: params }); };

export const getDeviceListPage = params => { return axios.get(`${base}:8080/device/query`, { params: params }); };

export const removeDevice = params => { return axios.get(`${base}/device/remove`, { params: params }); };

export const editDevice = params => { return axios.get(`${base}/device/edit`, { params: params }); };

export const addDevice = params => { return axios.get(`${base}/device/add`, { params: params }); };
