import { window } from '../constants';

export function parseJson(jsonStr) {
  try {
    return JSON.parse(jsonStr) || {};
  } catch (e) {
    return {};
  }
}

export const saveUserInfo = (userInfo) => {
  window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
