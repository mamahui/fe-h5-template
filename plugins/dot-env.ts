import { join } from 'path';
import { IApi } from 'umi';

export default (api: IApi): void => {
  const deployEnv = process.env.DEPLOY_ENV || 'dev';

  api.chainWebpack((chain) => {
    chain
      .plugin('dot-env')
      .use(require('dotenv-webpack'), [
        { path: join(api.paths.cwd, './config', `./.env.${deployEnv}`) },
      ]);
    return chain;
  });
};
