import { useRef, useEffect } from 'react';
import lottie from 'lottie-web';
import clockData from './clock';
import logoData from './logo';
import './index.less';

enum LoadingType {
  ACTION = 'ACTION',
  PAGE = 'PAGE',
}

type LoadingProps = {
  type?: keyof typeof LoadingType;
  lazy?: boolean;
  lazyTime?: number;
};

const LAZY_CLASS_NAME = 'lazy';

const Loading: React.FC<LoadingProps> = ({
  children = '加载中',
  type = LoadingType.ACTION,
  lazy = true,
  // 后端接口请求时间95%都在 300ms 以内
  lazyTime = 300,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isPageLoading = type === LoadingType.PAGE;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ref.current) {
      const wrapper = ref.current.closest('.am-toast-text');
      const loadLottie = () => {
        lottie.loadAnimation({
          container: ref.current!,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: isPageLoading ? logoData : clockData,
        });
      };

      wrapper?.classList.add(
        'loading-wrapper',
        lazy ? LAZY_CLASS_NAME : '_default_',
      );

      if (lazy) {
        timer = setTimeout(() => {
          wrapper?.classList.remove(LAZY_CLASS_NAME);
          loadLottie();
        }, lazyTime);
      } else {
        loadLottie();
      }
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, []);

  if (isPageLoading) {
    return (
      <div className="page-loading">
        <div ref={ref} />
      </div>
    );
  }

  return (
    <div className="clock-loading">
      <div ref={ref} className="clock" />
      {children}
    </div>
  );
};

export default Loading;
