import { useLayoutEffect, useEffect } from 'react';
import { isBrowser as isBrowserFn } from 'umi';
import { getWindow, getDocument, extend } from 'ssr-window';

export const extendWindow = extend;
export const window = getWindow();
export const document = getDocument();
export const isBrowser = isBrowserFn();
export const useSsrEffect = isBrowser ? useLayoutEffect : useEffect;

const STORAGE_METHODS = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
};

extend(window, {
  sessionStorage: STORAGE_METHODS,
  localStorage: STORAGE_METHODS,
});
