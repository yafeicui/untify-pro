import axios from 'axios';

import { path } from '../config';

// const appId = localStorage.getItem('applyId')

// 平台， 1 andriod，2 ios
export function getAll(params) {
  return axios({ url: `${path}/location/list`, params: { ...params } });
}

// locationId
export function getById(locationId) {
  return axios({ url: `${path}/location/detail`, params: { locationId } });
}

// save
export function save(params) {
  return axios({
    url: `${path}/location/save`,
    method: 'post',
    data: { ...params }
  });
}

// update
export function update(params) {
  return axios({
    url: `${path}/location/update`,
    method: 'post',
    data: { ...params }
  });
}

// /location/delete GET
export function delById(locationId) {
  return axios({ url: `${path}/location/delete`, params: { locationId } });
}
