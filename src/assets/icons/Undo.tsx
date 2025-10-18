import { SvgIcon } from '@mui/material';

const Undo = () => {
  return (
    <SvgIcon>
      <svg
        className="feather feather-corner-up-left"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </svg>
    </SvgIcon>
  );
};

export default Undo;
