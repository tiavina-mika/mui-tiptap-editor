import { useState } from 'react';

type Output = {
  toggle: () => void;
  open: boolean;
};

export const useToggle = (): Output => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = () => setOpen(!open);

  return {
    open,
    toggle,
  };
};
