import { ComponentPropsWithRef } from 'react';

export type BaseButtonProps = ComponentPropsWithRef<'button'>;

export function BaseBtn({ children, ...rest }: BaseButtonProps) {
  return <button {...rest}>{children}</button>;
}
