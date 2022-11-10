export * from './constants';
export * from './utils';

export const isProd = process.env.DEPLOY_ENV === 'prod';
