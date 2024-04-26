import { MouseEventHandler, ReactNode } from 'react';

import { AppBar, Box, CircularProgress, IconButton, styled, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import MUIDialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

const StyledDialog = styled(MUIDialog)(({ theme }) => ({
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
}));

type Props = {
  title: string;
  description?: string | ReactNode;
  open?: boolean;
  toggle?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonAction?: () => void;
  formId?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
  withCloseButton?: boolean;
  withCancelButton?: boolean;
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
  formId,
  maxWidth,
  onClick,
  loading,
  children,
  withCloseButton = false,
  withCancelButton = true,
  buttonColor = 'primary',
  ...dialogProps
}: Props) => {
  const { t } = useTranslation();

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
      sx={{ position: "absolute", right: 0, top: 0 }}>
      <FiX />
    </IconButton>
  );

  return (
    <StyledDialog
      {...dialogProps}
      open={!!open}
      onClose={toggle}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      onClick={onClick}>
      {dialogProps.fullScreen ? (
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            {withCloseButton && closeIcon}
            <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="div">
                {title}
              </Typography>
              {description && <Typography variant="body2">{description}</Typography>}
            </Box>
            <Button type="submit" form={formId} variant="outlined" color="primary" sx={{ backgroundColor: '#fff' }}>
              {primaryButtonText ?? t('save')}
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle id="alert-dialog-title">
          <div className="flexRow spaceBetween center">
            <Typography variant="h5">{title}</Typography>
            {withCloseButton && closeIcon}
          </div>
        </DialogTitle>
      )}
      <DialogContent>
        {/* description */}
        {description && !dialogProps.fullScreen && (
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        )}

        {/* main content */}
        {children}
      </DialogContent>
      {!dialogProps.fullScreen && (
        <DialogActions>
          {/* cancel button */}
          {withCancelButton && (
            <Button onClick={toggle} color="inherit" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
              {secondaryButtonText ?? t('cancel')}
            </Button>
          )}

          {/* confirm button */}
          {onPrimaryButtonAction && (
            <Button
              onClick={handlePrimaryButtonAction}
              autoFocus
              variant="contained"
              sx={{ textTransform: 'capitalize' }}>
              {loading ? <CircularProgress size={20} /> : primaryButtonText ?? t('confirm')}
            </Button>
          )}

          {/* form button */}
          {formId && (
            <Button
              type="submit"
              form={formId}
              color={buttonColor}
              variant="contained"
              sx={{ textTransform: 'capitalize' }}>
              {primaryButtonText ?? t('save')}
            </Button>
          )}
        </DialogActions>
      )}
    </StyledDialog>
  );
};

export default Dialog;
