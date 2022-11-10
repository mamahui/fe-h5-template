import axios from '@/axios';
import { WX_APP_ID, isWx } from '../constants';

const getUrl = () => {
  return window.location.href.split('#')[0];
};

async function wxConfig({ wxInstance, apiList = [], onConfigSuccess = (v) => v }) {
  const getAccessToken = await axios({
    method: 'post',
    url: '/dyjhrq/getAccessToken',
    params: {
      url: getUrl(),
    },
  });
  wxInstance.config({
    ...getAccessToken.data.content,
    success: onConfigSuccess,
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'openLocation', ...apiList],
    openTagList: ['wx-open-launch-app'],
  });
}

export const goToAuth = (callBackUrl?: string) => {
  const location_uri = encodeURIComponent(callBackUrl || window.location.href);
  const redirect_uri = encodeURIComponent(
    `https://h5.fiture.com/auth.html?redirect_uri=${location_uri}`,
  );
  const authUrl = `
    https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APP_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo#wechat_redirect
  `;
  window.location.replace(authUrl);
};

export const wxApi = {
  isReady: false,
  init: async (apiList) => {
    function initSuccess(res) {
      console.warn('wxApi init success', res);
      wxApi.isReady = true;
    }
    await wxConfig({
      wxInstance: window.wx,
      apiList,
      onConfigSuccess: initSuccess,
    });
  },
  ready: async (callback, apiList: string[] = []) => {
    if (!isWx) return false;
    if (!wxApi.isReady) await wxApi.init(apiList);
    window.wx.ready(() => {
      callback(window.wx);
    });
  },
};
