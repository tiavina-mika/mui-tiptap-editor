import { SvgIcon } from '@mui/material';

const Picture = () => {
  return (
    <SvgIcon>
      <svg
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <rect
          height="18"
          rx="2"
          ry="2"
          width="18"
          x="3"
          y="3"
        />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </SvgIcon>
  );
};

export default Picture;
