import { cx } from '@emotion/css';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size?: number;
  className?: string;
};

const Icon = ({ children, className, size = 18 }: Props) => {
  return (
    <span
      // the size of the icon is applied to the font-size of the svg
      className={cx('flexCenter', className)}
      css={{ '& svg': { fontSize: size } }}
    >
      {children}
    </span>
  );
};

export default Icon;
