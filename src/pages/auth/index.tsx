// eslint-disable

import { Helmet } from 'umi';
import { useEffect } from 'react';
import { window } from '@/config';

export default () => {
  useEffect(() => {
    function mergeObj(obj, mergeObj) {
      for (const i in mergeObj) {
        obj[i] = mergeObj[i];
      }
      return obj;
    }

    function stringifyParams(params) {
      const paramStrings = [];
      for (const i in params) {
        // @ts-ignore
        paramStrings.push(i + '=' + params[i]);
      }
      return paramStrings.join('&');
    }

    // 获得当前URL参数
    function parseUrlParams(url?) {
      // eslint-disable-next-line no-param-reassign
      url = url || window.location.search;
      const params = {
        code: undefined,
        redirect_uri: undefined,
      };
      const paramsStr = url.split('#')[0].split('?')[1];
      if (paramsStr) {
        const paramsStrArr = paramsStr.split('&');
        for (let i = 0; i < paramsStrArr.length; i++) {
          const paramsArr = paramsStrArr[i].split('=');
          params[paramsArr[0]] = paramsArr[1];
        }
      }
      return params;
    }

    // 获得当前URL的hash参数
    function parseUrlHash(url) {
      // eslint-disable-next-line no-param-reassign
      url = url || window.location.hash;
      return url.split('#')[1];
    }

    // 对传入的URL设置参数
    function composeUrlParams(url, params) {
      // eslint-disable-next-line no-param-reassign
      url = url || window.location.href;
      const urlHash = parseUrlHash(url);
      const urlParams = parseUrlParams(url);
      // eslint-disable-next-line no-param-reassign
      params = mergeObj(urlParams, params || {});
      const paramStr = stringifyParams(params);
      // eslint-disable-next-line no-param-reassign
      url = url.split('#')[0].split('?')[0];
      if (paramStr) {
        // eslint-disable-next-line no-param-reassign
        url += '?' + paramStr;
      }
      if (urlHash) {
        // eslint-disable-next-line no-param-reassign
        url += '#' + urlHash;
      }
      return url;
    }

    function doRedirect() {
      const urlParams = parseUrlParams();
      const code = urlParams.code;
      const redirect_uri = urlParams.redirect_uri;
      if (redirect_uri) {
        location.replace(composeUrlParams(decodeURIComponent(redirect_uri), { code }));
      }
    }
    doRedirect();
  }, []);
  return (
    <>
      <Helmet>
        <title>微信授权</title>
      </Helmet>
    </>
  );
};
