import axios from 'axios';

let path = '/firework-backend';

// 首页
// 获取应用下拉框列表
export function fetchApplyList() {
  return axios({
    url: `index${path}/app/list`
  });
}
// 获取状态
export function fetchStatus() {
  return axios({
    url: `index${path}/plan/getStatus`
  });
}
// 获取地址列表
export function fetchLocationList(params) {
  return axios({
    url: `index${path}/location/list`,
    params
  });
}
// 获取表格数据
export function fecthTableList(params) {
  return axios({
    url: `index${path}/plan/list`,
    params
  });
}
// 中止计划
export function stopPlan(params) {
  return axios({
    url: `${path}/plan/close`,
    params
  });
}
// 废弃弹屏
export function discardPlan(params) {
  return axios({
    url: `${path}/plan/discard`,
    params
  });
}
// 修改弹屏内容 （只针对状态为 投放中 的弹屏）
export function updatePutInScreen(params) {
  return axios({
    url: `${path}/plan/modify`,
    params
  });
}
//获取弹屏展示量折线图
export function getOpenLineData(params) {
  return axios({
    url: `${path}/xlog/open`,
    params
  });
}
//获取弹屏点击量折线图
export function getJumpLineData(params) {
  return axios({
    url: `${path}/xlog/jump`,
    params
  });
}

// 保存计划
export function createPlan(data) {
  return axios({
    url: `${path}/plan/save`,
    method: 'post',
    data
  });
}

// 转换站外地址
export function transformOuterUrl(params) {
  return axios({
    url: `${path}/plan/transferH5Url`,
    params
  });
}

// 保存弹屏
export function saveCreateScreen(data) {
  return axios({
    url: `${path}/firework/save`,
    method: 'post',
    data
  });
}
// 保存弹屏内容
export function saveScreenContent(data) {
  return axios({
    url: `${path}/fireworkContent/save`,
    method: 'post',
    data
  });
}
// 上传图片
export function uploadImage(data) {
  return axios({
    url: `${path}/upload/image`,
    method: 'post',
    data
  });
}
// 用户定向
export function saveUserOrient(data) {
  return axios({
    url: `${path}/orient/saveOrUpdate`,
    method: 'post',
    data
  });
}
export function fetchUserOrient(params) {
  return axios({
    url: `${path}/orient/getOrientEnum`,
    params
  });
}
// 根据appid获取位置列表
export function fetchLocationSelectList(params) {
  return axios({
    url: `${path}/location/list`,
    params
  });
}
// 根据id获取位置表格
export function fetchLocationDetail(params) {
  return axios({
    url: `${path}/location/detail`,
    params
  });
}
// 根据位置分组plan
export function fetchPositionAllTable(params) {
  return axios({
    url: `${path}/planLocation/getPlansGroupByLocationId`,
    params
  });
}
// 保存或编辑位置页面
export function saveOrUpdatePosition(data) {
  return axios({
    url: `${path}/planLocation/saveOrUpdate`,
    method: 'post',
    data
  });
}
// 根据planId来获取保存的列表
export function fetchSavedLocationList(params) {
  return axios({
    url: `${path}/planLocation/getPlanLocationsGroupByPlanId`,
    params
  });
}

// 获取审批人列表
export function fetchApprovalList(params) {
  return axios({
    url: `${path}/user/appUser`,
    params
  });
}
// 审批页面下的保存按钮
export function approvalSave(data) {
  return axios({
    url: `${path}/audit/plan/save`,
    method: 'post',
    data
  });
}
// 审批页面下的提交审批按钮
export function approvalApply(data) {
  return axios({
    url: `${path}/audit/apply`,
    method: 'post',
    data
  });
}

// 首页表格点击编辑进入   计划
// 查询计划基本信息
export function planBasicInfo(params) {
  return axios({
    url: `${path}/plan/detail`,
    params
  });
}
// 更新计划基本信息
export function updatePlan(data) {
  return axios({
    url: `${path}/plan/update`,
    method: 'post',
    data
  });
}
// 查询弹屏列表
export function fetchScreenList(params) {
  return axios({
    url: `${path}/firework/list`,
    params
  });
}
// 更新弹屏
export function updateScreen(data) {
  return axios({
    url: `${path}/firework/update`,
    method: 'post',
    data
  });
}
// 查询弹屏内容列表
export function fetchScreenContentList(params) {
  return axios({
    url: `${path}/fireworkContent/detail`,
    params
  });
}
// 更新弹屏内容
export function updateScreenContent(data) {
  return axios({
    url: `${path}/fireworkContent/update`,
    method: 'post',
    data
  });
}
// 查询用户定向信息
export function fetchUserOrientInfo(params) {
  return axios({
    url: `${path}/orient/detail`,
    params
  });
}
// 查询审批回显
export function fetchApproval(params) {
  return axios({
    url: `${path}/audit/detail`,
    params
  });
}
// 获取App下的审核者
export function fetchAppApprovalUsers(params) {
  return axios({
    url: `${path}/user/auditors`,
    params
  });
}

// 优化弹屏和弹屏内容
// 保存弹屏及弹屏内容
export function saveNewScreen(data) {
  return axios({
    url: `${path}/fireworkPlus/save`,
    method: 'post',
    data
  });
}
// 查询弹屏信息
export function fetchScreenInfo(params) {
  return axios({
    url: `${path}/fireworkPlus/list`,
    params
  });
}
// 编辑弹屏
export function updateScreenInfo(data) {
  return axios({
    url: `${path}/fireworkPlus/update`,
    method: 'post',
    data
  });
}
// 删除弹屏
export function deleteScreen(params) {
  return axios({
    url: `${path}/fireworkPlus/delete`,
    params
  });
}
// 更新弹屏
export function updateScreenId(data) {
  return axios({
    url: `${path}/fireworkPlus/updatePreFireworkId`,
    method: 'post',
    data
  });
}
// 位置优化接口
export function planLocationSelect(params) {
  return axios({
    url: `${path}/planLocation/getPlansGroupByLocationId`,
    params
  });
}

// 用户注册
export function fetchRegister(data) {
  return axios({
    url: `${path}/user/registry`,
    method: 'post',
    data
  });
}

// 用户登录
export function fetchLogin(params) {
  return axios({
    url: `login${path}/login`,
    params
  });
}

// 退出登录
export function fetchLoginout() {
  return axios({ url: `login${path}/logout` });
}

// 授权管理页面
// 获取所有已选的user
export function fetchAllSelectedUsers(params) {
  return axios({
    url: `${path}/user/appUser`,
    params
  });
}
// 获取所有用户
export function fetchAllUsers(params) {
  return axios({
    url: `${path}/user/all`,
    params
  });
}
// 给用户授权
export function giveUserAuthor(data) {
  return axios({
    url: `${path}/user/permission`,
    method: 'post',
    data
  });
}
// 删除用户权限
export function deleteUsersAuthor(data) {
  return axios({
    url: `${path}/user/permission/delete`,
    method: 'post',
    data
  });
}
// 获取位置权限 Table列表
export function fetchLocationTable(params) {
  return axios({
    url: `${path}/permission/location/admin/list`,
    params
  });
}
// 保存位置权限用户
export function saveLocationUser(data) {
  return axios({
    url: `${path}/permission/location/admin/add`,
    method: 'post',
    data
  });
}
/// 删除位置权限用户
export function deleteLocationUser(data) {
  return axios({
    url: `${path}/permission/location/admin/delete`,
    method: 'post',
    data
  });
}

// 获取提示信息
export function noticeInfo(params) {
  return axios({
    url: `index${path}/app/notice`,
    params
  });
}
