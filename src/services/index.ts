import { http } from '@/core';
import api from './api';

const gen = (params, opts = {}) => {
  let url = params;
  let method = 'POST';
  const paramsArray = params.split(' ');

  if (paramsArray.length === 2) {
    [method, url] = paramsArray;
  }

  return (params = {}, options: any) => {
    return http({
      url,
      data: params,
      method,
      ...opts,
      ...options,
    });
  };
};

const apiConfig = [{ api, domain: process.env.API }];
const originApis = {
  ...api,
};
type APIS = {
  [key in keyof typeof originApis]: (params?: any, options?: any) => Promise<any>;
};

const APIFunction: APIS = {} as APIS;

apiConfig.forEach(({ api, domain }) => {
  Object.keys(api).forEach((key) => {
    APIFunction[key] = gen(api[key], { domain });
  });
});

export default APIFunction;
