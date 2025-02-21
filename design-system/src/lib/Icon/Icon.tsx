import { SVGAttributes } from 'react';
import styled from 'styled-components';
import { IconTypes, svgs } from './svgs';

export interface IconProps extends SVGAttributes<SVGElement> {
  type: any;
  color?: string;
  size?: number;
  fill?: string;
  strokeWidth?: string;
  className?: string;
}

export const Icon = styled(
  ({
    type = 'arrow-block-left',
    size = 24,
    color,
    fill,
    strokeWidth,
    ...rest
  }: IconProps) => {
    const { paths, ...icon } = getIcon(type);
    return (
      <svg
        data-testid={type}
        {...icon}
        {...rest}
        width={size || icon.width}
        height={size || icon.height}
        aria-labelledby={type}
        role="presentation"
      >
        {paths.map((path: any, idx: any) => (
          <path
            key={`${String(type)}-${idx}`}
            {...path}
            stroke={color || path.stroke}
            fill={fill || path.fill}
            strokeWidth={strokeWidth || path.strokeWidth}
          />
        ))}
      </svg>
    );
  }
)``;

const getIcon = (type: IconTypes) => svgs[type];
