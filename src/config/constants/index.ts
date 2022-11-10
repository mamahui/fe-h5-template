import { getWindow } from 'ssr-window';

const window = getWindow();
const {
  navigator: { userAgent },
} = window;

export * from './ssr';
export { default as Regex } from './regex';

export const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;

export const WX_APP_ID = 'wxcc8cc2fb593a1aa2';

export const isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
export const isWx = userAgent.includes('MicroMessenger');

export const BMAP_KEY = 'ojrcdRnwNL8yFW4BpBZRpxmiwZPMNHKK';
