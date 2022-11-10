declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.mp3';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

interface Window {
  _dsbridge?: (arg: any) => void;
  _dswk: unknown;
  APP_METADATA: unknown;
  PerformanceObserver: any;
  setSession: (mobile: number | string) => void;
  BMapGL: any;
  wx: any;
  WeixinJSBridge: any;
}
