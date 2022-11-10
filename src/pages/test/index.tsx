import { Helmet } from 'umi';
import { Button, Toast } from 'antd-mobile';
import { useEffect } from 'react';
import api from '@/services';
import './index.less';

export default function IndexPage() {
  useEffect(() => {
    api.testApi();
  }, []);
  return (
    <>
      <Helmet>
        <title>test</title>
      </Helmet>
      <Button
        block
        color="primary"
        size="small"
        onClick={() => {
          Toast.show({
            content: '名称测试toast',
            afterClose() {
              console.log('toast-end');
            },
          });
        }}
      >
        Block Button
      </Button>
      <p className="title">Page index 1</p>
      <div className="test-number">12323</div>
    </>
  );
}
