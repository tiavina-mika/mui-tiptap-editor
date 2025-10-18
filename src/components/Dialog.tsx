'use client';


import {
  IconButton, Typography, Button, Dialog as MUIDialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';

import type { Theme, DialogProps } from '@mui/material';
import type { MouseEventHandler, ReactNode } from 'react';

import Close from '@/assets/icons/Close';

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
  }),
};

type Props = {
  title: string;
  description?: string | ReactNode;
  open?: boolean;
  onClose?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonAction?: () => void;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
  withCloseButton?: boolean;
  className?: string;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
} & DialogProps;

const Dialog = ({
  title,
  description,
  open,
  onClose,
  onPrimaryButtonAction,
  primaryButtonText,
  secondaryButtonText,
  maxWidth,
  onClick,
  loading,
  children,
  className,
  withCloseButton = false,
  ...dialogProps
}: Props) => {
  const handlePrimaryButtonAction = () => {
    if (onPrimaryButtonAction) onPrimaryButtonAction();
    if (!onClose) return;
    onClose();
  };

  const closeIcon = (
    <IconButton
      aria-label="close"
      color="inherit"
      edge="start"
      sx={{ position: 'absolute', right: 0, top: 0 }}
      onClick={onClose}
    >
      {/* <img alt="close" src="/icons/close.svg" /> */}
      <Close />
    </IconButton>
  );

  return (
    <MUIDialog
      {...dialogProps}
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      className={className}
      css={classes.dialog}
      maxWidth={maxWidth}
      open={!!open}
      onClick={onClick}
      onClose={onClose}
    >
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
        <Button onClick={onClose}>
          {secondaryButtonText ?? 'Cancel'}
        </Button>
        {/* confirm button */}
        {onPrimaryButtonAction && (
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant="contained"
            onClick={handlePrimaryButtonAction}
          >
            {primaryButtonText ?? 'Confirm'}
          </Button>
        )}
      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
