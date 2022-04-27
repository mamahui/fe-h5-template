import { resolve } from 'path';
import { defineConfig } from 'umi';
import px2viewport from 'postcss-px-to-viewport';
import theme from './config/theme.config';

const { DEPLOY_ENV = 'dev', } = process.env;
const development = process.env.NODE_ENV !== 'production';
const publicPath = development ? '/' : '/template-h5/';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  antd:{
    mobile:false
  },
  extraPostCSSPlugins: [
    px2viewport({ viewportWidth: 375 }),
  ],
  ssr: { staticMarkup: true },
  exportStatic: { htmlSuffix: true },
  dynamicImport: {
    loading: '@/components/DefaultLoading',
  },
  chainWebpack(config:any) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          automaticNameDelimiter: '.',
          name: true,
          minSize: 30000,
          minChunks: 1,
          cacheGroups: {
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: -12,
            },
          },
        },
      },
    });
  },
  title: false,
  publicPath, // 打包路径，默认是/
  base: publicPath, // 打包路径，默认是/
  history: { type: 'browser' },
  chunks: ['vendors', 'umi'],
  hash: true,
  theme: theme(publicPath),
  alias: {
    '@': resolve(__dirname, './src'),
  },
  targets: {
    ios: 10,
    android: 6.0,
    chrome: 49,
    safari: 10,
  },
  request: false,
  autoprefixer: false,
  define: {
    'process.env.PUBLIC_PATH': publicPath,
    'process.env.DEPLOY_ENV': DEPLOY_ENV,
  },
});
