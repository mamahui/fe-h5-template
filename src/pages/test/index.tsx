import { Helmet } from 'umi';
import { Button, Toast } from 'antd-mobile';
import './index.less';

export default function IndexPage() {
  return (
    <>
      <Button block color='primary' size='small' onClick={() => {
        Toast.show({
          content: '名称测试toast',
          afterClose() {
            console.log('toast-end');
          },
        });
      }}>
        Block Button
      </Button>
      <p className="title">Page index 1</p>
      <div className="test-number">12323</div>
    </>
  );
}
