/**
 * ajax 模块，可以将 axios 替换成 $.ajax 等
 */
import axios from 'axios';
import constant from '@/common/js/constant';

const init = function () {
  axios.interceptors.request.use(function (config) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
      config.url = config.url.replace('http://192.168.1.122', 'http://192.168.1.122');
      // config.url = config.url.replace(config.url.match(/^http(s)?:\/\/(.*?)\//)[0], 'http://139.199.201.11/'); // 测试环境
      // config.url = config.url.replace(config.url.match(/^http(s)?:\/\/(.*?)\//)[0], 'http://193.112.60.53/');// 生产环境
    }
    config.url += (config.url.indexOf('?') !== -1) ? ('&token=' + (window.localStorage.token || '')) : ('?token=' + (window.localStorage.token || ''));
    return config;
  }, function (err) {
    return Promise.reject(err)
  })

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    const { status, data } = response;
    if (status === 200) {
      if (data.token) {
        window.localStorage.token = data.token;
      }
      // 如果是Blob对象,则返回整个response
      if (data.__proto__ === Blob.prototype) {
        return response;
      } else {
        if (data.error === 'SUCCESS') {
          return data.data
        } else {
          return data
        }
      }
    } else {
      return response
    }
  }, function (error) {
    const { status } = error.response;
    // 这里处理错误的 http code
    window.Alert('错误码：' + status + '，' + constant.CODEMESSAGE[status]);
    // Do something with response error
    return Promise.reject(error);
  });
};

export default {
  init
}
