import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

// Pick specific props (or use Omit to exclude)
export default {};
type ButtonBaseProps = Pick<MuiButtonProps, 'variant' | 'size' | 'color'>;

export interface IButtonProps extends ButtonBaseProps {
  label: string;
}

export const Button = ({ label, ...rest }: IButtonProps) => (
  <MuiButton {...rest}>{label}</MuiButton>
);
