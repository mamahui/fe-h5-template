import { createElement } from 'react';
import { Toast, DotLoading } from 'antd-mobile';
import axios from 'axios';

let reqCount = 0;
function showLoading() {
  reqCount += 1;
  Toast.show({
    content: createElement(DotLoading),
    duration: 1000 * 1000,
    maskClickable: false,
  });
}
function hideLoading() {
  reqCount -= 1;
  if (!reqCount) {
    Toast.clear();
  }
}
axios.defaults.baseURL = 'https://www.shuzescn.com';
axios.interceptors.request.use((config) => {
  showLoading();
  return config;
});

axios.interceptors.response.use(
  (response) => {
    hideLoading();
    if (response.data.code !== 0) {
      Toast.show({
        content: response.data.msg,
        duration: 2000,
        position: 'top',
      });
    }
    return response;
  },
  (response) => {
    hideLoading();
    Toast.show({
      content: response?.message || ' 服务器错误',
      duration: 2000,
      position: 'top',
    });
  },
);

export default axios;
