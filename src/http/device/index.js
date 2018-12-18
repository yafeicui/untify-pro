import axios from 'axios'

import { path } from '../config'

const appId = localStorage.getItem('applyId')

export function getAll(params) {
	return axios({ url: `${path}/device/list`, params: { ...params, appId } })
}

// locationId
export function getById(id) {
	return axios({ url: `${path}/device/detail`, params: { id } })
}

// save
export function save(data) {
	return axios({
		url: `${path}/device/save`,
		method: 'post',
		data
	})
}

// update
export function update(data) {
	return axios({
		url: `${path}/device/update`,
		method: 'post',
		data
	})
}

// /location/delete GET
export function delById(id) {
	return axios({ url: `${path}/device/delete`, params: { id } })
}
