import { MutableRefObject, useEffect, useState } from 'react';

export type ParentElementType = MutableRefObject<null | HTMLElement>;

interface IParentSize {
  parentHeight: number;
  parentWidth: number;
}

type IParentOffset = {
  [key in 'bottom' | 'left' | 'top' | 'right']: number;
};

export const useParentSize = (parentElement: ParentElementType) => {
  const [{ parentHeight, parentWidth }, setParentSize] = useState<IParentSize>({
    parentHeight: 0,
    parentWidth: 0,
  });
  const [{ bottom, left, top, right }, setParentOffset] =
    useState<IParentOffset>({
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
    });

  useEffect(() => {
    setParentSize({
      parentHeight: parentElement.current
        ? parentElement.current.offsetHeight
        : 0,
      parentWidth: parentElement.current
        ? parentElement.current.offsetWidth
        : 0,
    });
  }, [parentElement]);

  useEffect(() => {
    setParentOffset(() => {
      const parentOffset = parentElement.current
        ? parentElement.current?.getBoundingClientRect()
        : { bottom: 0, left: 0, top: 0, right: 0 };
      return {
        bottom: parentOffset.bottom,
        left: parentOffset.left - window.scrollX,
        top: parentOffset.top - window.scrollY,
        right: parentOffset.right,
      };
    });
  }, [parentElement]);

  return {
    parentHeight,
    parentWidth,
    parentLeftOffset: left,
    parentRightOffset: right,
    parentTopOffset: top,
    parentBottomOffset: bottom,
  };
};
