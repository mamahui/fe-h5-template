import { resolve } from 'path';
import { defineConfig } from 'umi';
import px2viewport from 'postcss-px-to-viewport';
import theme from './config/theme.config';

const { DEPLOY_ENV = 'dev' } = process.env;

let publicPath = '/';

export default defineConfig({
  plugins: [require.resolve('./plugins/performance'), require.resolve('./plugins/dot-env')],
  nodeModulesTransform: {
    type: 'none',
  },
  runtimePublicPath: true,
  fastRefresh: {},
  antd: {
    mobile: false,
  },
  extraPostCSSPlugins: [px2viewport({ viewportWidth: 375 })],
  ssr: { staticMarkup: true },
  exportStatic: { htmlSuffix: true },
  dynamicImport: {
    loading: '@/components/DefaultLoading',
  },
  title: false,
  publicPath, // 打包路径，默认是/
  base: publicPath, // 打包路径，默认是/
  history: { type: 'browser' },
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 2,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'common',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
    config.module
      .rule('media')
      .test(/\.(mp3)$/)
      .type('javascript/auto')
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
  chunks: ['common', 'umi'],
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
