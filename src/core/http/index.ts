import { createElement } from 'react';
import { isEmpty } from '@suze/utils';
import qs from 'qs';
import axios from 'axios';
import { isBrowser } from 'umi';
import { DotLoading, Toast } from 'antd-mobile';
import { parse, compile } from 'path-to-regexp';
import { cloneDeep, transform } from 'lodash';
import { parseJson } from '@/config';

declare global {
  interface Window {
    cancelRequest: any;
  }
}

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

const { CancelToken } = axios;
const CANCEL_REQUEST_MESSAGE = 'cancel request';
const UNAUTHORIZED_CODES = [401, 114, 110, 101];
const TIMEOUT_ERROR_MSG_START = 'timeout of';

const config = {
  isSuccess: (data) => data?.code === 0,
  domain: process.env.API,
};

if (isBrowser()) {
  window.cancelRequest = new Map();
}

const ErrorModal = (title) => Toast.show(title);

export const setConfig = (options) => Object.assign(config, options);
export const isSuccess = (data) => config.isSuccess(data);

export default function http(options) {
  const { data, method = 'get', ignoreErrorModal, loading } = options;
  let { url } = options;
  const params = data
    ? transform(
        data,
        (result, value, key) => {
          // 过滤为空的参数
          if (!isEmpty(value)) {
            result[key] = value;
          }
        },
        {},
      )
    : data;

  const cloneData = cloneDeep(data);

  try {
    debugger;
    let domain = options.domain || config.domain;
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      url = url.slice(domain.length);
    }

    const match = parse(url);
    url = compile(url)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + url;
  } catch (e) {
    ErrorModal((e as any).message);
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}?${qs.stringify({
          ...cloneData,
          _: Date.now(),
        })}`
      : url;
  options.data = params;
  const userInfo = parseJson(localStorage.getItem('userInfo'));
  options.headers = {
    token: userInfo.token,
    ...options.headers,
  };
  options.timeout = 10 * 1000;
  options.cancelToken = new CancelToken((cancel) => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  loading && showLoading();

  return axios(options)
    .then((response) => {
      const { data = {} } = response;
      const message = data.msg || '加载失败，请稍后再试';
      const { code } = data;

      loading && hideLoading();

      if (UNAUTHORIZED_CODES.includes(code)) {
        console.log('退出，logout');
        return Promise.reject({
          success: false,
          message,
          ...data,
        });
      }

      if (data instanceof window.Blob) {
        return Promise.resolve(data);
      }
      if (!config.isSuccess(data)) {
        !ignoreErrorModal && ErrorModal(message);

        return Promise.reject({
          success: false,
          message,
          ...data,
        });
      }
      return Promise.resolve(data.content);
    })
    .catch((error) => {
      const { message, response } = error;
      if (`${message}` === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        };
      }
      let msg;
      let statusCode;
      let data;
      if (response && response instanceof Object) {
        const { statusText } = response;
        data = response.data;
        statusCode = response.status;
        msg = data.msg || statusText;
      } else {
        // TODO 如果接口本身返回的数据中包含message,success会被覆盖
        data = { ...error, message: undefined, success: undefined };
        statusCode = 600;
        msg = error.message || '服务器错误，请稍后重试';
      }
      const { onLine } = window.navigator;
      msg = onLine ? msg : '网络链接错误，请检查网络重试';
      msg = `${message}`.includes(TIMEOUT_ERROR_MSG_START) ? '链接超时，请稍后再试' : msg;
      !ignoreErrorModal && ErrorModal(msg);

      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
        originData: data,
      });
    });
}
