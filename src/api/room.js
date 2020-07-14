import axios from 'axios';

let base = '';

export const getRoomList = params => { return axios.get(`${base}/room/list`, { params: params }); };

export const getRoomListPage = params => { return axios.get(`${base}:8080/room/query`, { params: params }); };

export const removeRoom = params => { return axios.get(`${base}/room/remove`, { params: params }); };

export const batchRemoveRoom = params => { return axios.get(`${base}/room/batchremove`, { params: params }); };

export const editRoom = params => { return axios.get(`${base}/room/edit`, { params: params }); };

export const addRoom = params => { return axios.get(`${base}/room/add`, { params: params }); };
