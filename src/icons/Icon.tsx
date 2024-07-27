import { cx } from "@emotion/css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: number;
  className?: string;
};

const Icon = ({ children, className, size = 18 }: Props) => {
  return (
    <span
      // the size of the icon is applied to the font-size of the svg
      css={{ '& svg': { fontSize: size }}}
      className={cx('flexCenter', className)}
    >
      {children}
    </span>
  )
}

export default Icon;
