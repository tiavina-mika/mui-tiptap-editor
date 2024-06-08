import { MouseEventHandler, ReactNode } from 'react';

import {
  IconButton, Theme, Typography, Button, Dialog as MUIDialog, DialogProps,
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import Close from '../icons/Close';

const classes = {
  dialog: (theme: Theme) => ({
    '& .MuiDialog-root': {
      padding: theme.spacing(1.5),
    },
    '& .MuiPaper-root': {
      paddingBottom: 0,
      paddingTop: 0,
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  })
}

type Props = {
  title: string;
  description?: string | ReactNode;
  open?: boolean;
  toggle?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonAction?: () => void;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
  withCloseButton?: boolean;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
} & DialogProps;

const Dialog = ({
  title,
  description,
  open,
  toggle,
  onPrimaryButtonAction,
  primaryButtonText,
  secondaryButtonText,
  maxWidth,
  onClick,
  loading,
  children,
  withCloseButton = false,
  ...dialogProps
}: Props) => {
  const handlePrimaryButtonAction = () => {
    if (onPrimaryButtonAction) onPrimaryButtonAction();
    if (!toggle) return;
    toggle();
  };

  const closeIcon = (
    <IconButton
      edge="start"
      color="inherit"
      onClick={toggle}
      aria-label="close"
      sx={{ position: "absolute", right: 0, top: 0 }}
    >
      {/* <img alt="close" src="/icons/close.svg" /> */}
      <Close />
    </IconButton>
  );

  return (
    <MUIDialog
      {...dialogProps}
      open={!!open}
      onClose={toggle}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      css={classes.dialog}
      onClick={onClick}>
      <DialogTitle id="alert-dialog-title">
        <div className="flexRow spaceBetween center">
          <Typography variant="h5">{title}</Typography>
          {withCloseButton && closeIcon}
        </div>
      </DialogTitle>
      <DialogContent>
        {/* description */}
        {description && (
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        )}

        {/* main content */}
        {children}
      </DialogContent>
      <DialogActions>
        {/* confirm button */}
        {onPrimaryButtonAction && (
          <Button
            onClick={handlePrimaryButtonAction}
            autoFocus
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
          >
            {primaryButtonText ?? 'Confirm'}
          </Button>
        )}

      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
