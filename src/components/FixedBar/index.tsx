import { useRef, useState, useEffect } from 'react';
import './index.less';

type FixedBarProps = {
  background?: string;
};

type StyleProps = {
  height?: number;
  background?: string;
};

const FixedBar: React.FC<FixedBarProps> = ({ children, background: bg }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ height, background }, setStyle] = useState<StyleProps>({});

  useEffect(() => {
    const child = ref.current?.firstChild as HTMLDivElement;

    setStyle({
      height: ref.current!.clientHeight,
      background:
        bg || (child ? window.getComputedStyle(child).background : ''),
    });
  }, []);

  return (
    <div className="fixed-bar" style={{ height }}>
      <div>
        <div ref={ref}>{children}</div>
        <div className="safe-area" style={{ background }} />
      </div>
    </div>
  );
};

export default FixedBar;
