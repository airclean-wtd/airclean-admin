import axios from 'axios';

let base = 'http://airclean-api.hehear.com';
//let base = 'http://localhost:8080';

export const getStatList = params => { return axios.get(`${base}/stat/queryStatList`, { params: params });};

