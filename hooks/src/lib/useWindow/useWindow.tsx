import { useLayoutEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState<{
    width: null | number;
    height: null | number;
  }>({
    width: null,
    height: null,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
