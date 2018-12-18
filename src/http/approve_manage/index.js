import axios from 'axios';

import { path } from '../config';

// 投放页面
// 我提交的计划
export function getApply(params) {
  return axios({
    url: `${path}/audit/plans/apply`,
    params: { ...params }
  });
}

// 待我审批的计划
export function getAudit(params) {
  return axios({
    url: `${path}/audit/list/auditing`,
    params: { ...params }
  });
}

// 撤销计划
export function revert(data) {
  return axios({
    url: `${path}/audit/plan/revert`,
    method: 'post',
    data
  });
}

// 通过计划
export function resolve(data) {
  return axios({
    url: `${path}/audit/approve`,
    method: 'post',
    data
  });
}

// 拒绝计划
export function reject(data) {
  return axios({ url: `${path}/audit/reject`, method: 'post', data });
}

// 我已审核的table
export function fetchAudited(params) {
  return axios({
    url: `${path}/audit/list/audited`,
    params
  });
}

// 查看审批进度
export function fetchProgress(params) {
  return axios({
    url: `${path}/audit/step`,
    params
  });
}
