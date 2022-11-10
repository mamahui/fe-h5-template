import { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import blank from './blank.png';
import './index.less';

export type ImageProps = {
  src: string;
  defaultUrl?: string;
  className?: string;
  lazy?: boolean;
  percent?: number;
  onClick?: (event: Event) => void;
  onError?: (event: Event | string) => void;
  onLoad?: (event: Event) => void;
} & React.ImgHTMLAttributes<HTMLImageElement>;

type lazyProps = {
  // 预渲染情况下保证计算完全后再开始加载图片
  complete?: boolean;
  lazyLoad?: boolean;
};
// https://dyjhrq-img.oss-cn-chengdu.aliyuncs.com/1660443416120.png
const SUPPORT_LAZY_HOST = 'dyjhrq-img.oss-cn-chengdu.aliyuncs.com';
const ANIMATION_CLASS_NAME = 'fade-out';
const getThumbUrl = (url: string, percent) => {
  const prefix = url.includes('?') ? '&' : '?';

  return `${url + prefix}x-oss-process=image/resize,p_${percent}`;
};

export default function Image(props: ImageProps) {
  const {
    className = '',
    src,
    defaultUrl,
    lazy = false,
    percent = 5,
    onClick,
    onLoad,
    onError,
    ...rest
  } = props;
  const [url, setUrl] = useState(src);
  const [{ complete, lazyLoad }, setLazyLoad] = useState<lazyProps>({});
  const isComplete = lazy ? typeof complete !== 'undefined' : true;
  const thumbRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (src) {
      const img = new window.Image();
      let isLazyLoad = false;
      const removeLazyImage = () => {
        thumbRef.current && wrapperRef.current?.removeChild(thumbRef.current);
        wrapperRef.current?.classList.remove(ANIMATION_CLASS_NAME, 'lazy');
      };

      img.onload = (e) => {
        if (isLazyLoad) {
          wrapperRef.current?.classList.add(ANIMATION_CLASS_NAME);
          thumbRef.current?.addEventListener('transitionend', removeLazyImage);
        }
        onLoad?.(e);
      };
      img.onerror = (e) => {
        if (isLazyLoad) {
          removeLazyImage();
        }
        setUrl(defaultUrl || blank);
        onError?.(e);
      };
      img.src = src;
      isLazyLoad = lazy && src.includes(SUPPORT_LAZY_HOST) && !img.complete;

      setUrl(src);
      setLazyLoad({ complete: img.complete, lazyLoad: isLazyLoad });
    } else {
      setUrl(defaultUrl || blank);
    }
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className={classNames('custom-image', { lazy: lazyLoad }, className)}
      onClick={onClick}
    >
      {isComplete && url && <img src={url} alt="" {...rest} />}
      {lazyLoad && <img ref={thumbRef} src={getThumbUrl(src, percent)} alt="" {...rest} />}
    </div>
  );
}
