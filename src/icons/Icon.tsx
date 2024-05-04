import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: number;
};

const Icon = ({ children, size = 18 }: Props) => {
  return (
    <div css={{ '& svg': { fontSize: size }}} className="flexCenter">
      {children}
    </div>
  )
}

export default Icon;