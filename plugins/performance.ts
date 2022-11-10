/**
 * 主要功能：
 * 1. JS 延迟加载，保证弱网情况下优先加载 CSS 资源
 * 2. 关键 CSS 提取。
 */

import { IApi, BaseIConfig } from 'umi';
import path from 'path';
import fileSystem from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import Critters from 'critters';

const { promises: fs } = fileSystem;
const ENTRY_SUFFIX = '.html';

const getEntry = async (dir: string, callback: (entry: string) => void) => {
  const files = await fs.readdir(dir);

  files.forEach(async (file) => {
    const pathname = path.join(dir, file);
    const stat = await fs.stat(pathname);

    if (stat.isDirectory()) {
      getEntry(pathname, callback);
    } else if (pathname.endsWith(ENTRY_SUFFIX)) {
      callback(pathname);
    }
  });
};

export default (api: IApi) => {
  // 删除由 Helmet 生成的空 title
  api.modifyProdHTMLContent((html) =>
    html
      ?.replace?.('<title data-react-helmet="true"></title>', '')
      ?.replace(/(<script)(.+(umi|p__).+?>)/g, '$1 defer$2'),
  );

  api.onBuildComplete(() => {
    const { outputPath, publicPath } = api.config as BaseIConfig;
    const critters = new Critters({
      publicPath,
      path: outputPath,
      preload: 'swap',
    });

    getEntry(path.resolve(outputPath), async (entry) => {
      const html = await fs.readFile(entry, 'utf-8');
      const inlinedHtml = await critters.process(html);
      await fs.writeFile(entry, inlinedHtml);
    });
  });
};
