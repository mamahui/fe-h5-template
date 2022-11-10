import { isProd } from '@/config';
import { List } from 'antd-mobile';
import { getWindow } from 'ssr-window';

const window = getWindow();

type Route = {
  path: 'string';
};

const { Item } = List;
const getRoutes = (routes: Route[]) =>
  routes.reduce((result, { path }) => {
    const matches = /\/([^/]*)\//.exec(path) || [];
    const title = matches[1] || '/';

    if (!result[title]) {
      result[title] = [];
    }

    if (!['/', '/index.html'].includes(path)) {
      result[title].push(path);
    }

    return result;
  }, {});

const HomePage = (props: { routes: any }) => {
  const { routes } = props;
  const totalRoutes = getRoutes(routes);

  if (isProd) {
    return null;
  }

  return Object.keys(totalRoutes).map((key) => (
    <List key={key} header={() => <h2 style={{ fontSize: '1.5em' }}>{key}</h2>}>
      {totalRoutes[key].map((path: string) => (
        <Item key={path} arrow="horizontal" onClick={() => (window.location.href = path)}>
          {path}
        </Item>
      ))}
    </List>
  ));
};

export default HomePage;
