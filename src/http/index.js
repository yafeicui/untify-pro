import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
// import { routerRedux } from 'dva/router';

export function createHttp(app) {
  initInterceptersRequest();
  initInterceptersResponse(app);
}
// var configArr = [];
const initInterceptersRequest = () => {
  axios.interceptors.request.use(config => {
    const CONFIG = config;
    // if (CONFIG.url.indexOf('login') !== -1) {
    // CONFIG.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // CONFIG.data = qs.stringify(CONFIG.data);
    // } else {
    //   const auth = localStorage.getItem('auth');
    //   if (auth) {
    //     CONFIG.headers.common.Authorization = auth;
    //   } else {
    //     routerRedux.push('/user/login');
    //   }
    // }
    //  ==============  接口高频请求拦截器，避免同一接口瞬间被反复调用  ============
    // const WHITE_LIST = [];
    // var isInWhiteList = false;
    // WHITE_LIST.forEach(value => {
    //   if (config.url.indexOf(value) !== -1) isInWhiteList = true;
    // });
    // // 非白名单接口，一个短时间只能调用一次
    // if (!isInWhiteList) {
    //   var overTime = false;
    //   var isHave = false;
    //   var req =
    //     config.url +
    //     '|' +
    //     config.method +
    //     '|' +
    //     // JSON.stringify(config.params || {});
    //   // console.log(configArr, 1111)
    //   configArr.forEach(item => {
    //     // console.log(item, 'item');
    //     //如果数组中有此次请求 isHave为true
    //     if (item.request === req) {
    //       //数据中有此次请求
    //       isHave = true;
    //       // console.log('有');
    //       if (Date.now().toString() - item.date > 1000) {
    //         //时间间隔大于设置时间，过期
    //         overTime = true;
    //         // console.log('时间多');
    //       }
    //       item.date = Date.now().toString(); //无论有没有过期都重置时间
    //     }
    //   });
    //   //
    //   if (isHave && !overTime) return null;
    //   //数组中没有此次请求，则向数组中添加此次请求
    //   if (!isHave)
    //     configArr.push({ request: req, date: Date.now().toString() });
    //   //如果数据长度大于5，则删除数据第一条数据
    //   configArr.length > 5 ? configArr.shift() : configArr;
    // }
    // ========  拦截器 end  ===========
    return CONFIG;
  });
};

const initInterceptersResponse = app => {
  axios.interceptors.response.use(
    res => {
      console.log(res, '返回数据');
      const { data } = res;
      if (data.ret !== undefined && data.ret !== 0) {
        message.error(data.msg);
        return Promise.reject(data.msg);
      }

      return data;
    },
    ({ response }) => {
      if (response.status === 401) {
        window.location.href = '/firework-backend/home';
        return;
      }
      let msg = response.data.msg;
      message.error(msg);
      return Promise.reject(msg);
    }
  );
};
