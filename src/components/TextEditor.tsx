import '../index.css';

import { cx } from '@emotion/css';
import { Theme } from '@emotion/react';
import {
  FormHelperText, Tab, Tabs, Typography,
} from '@mui/material';
import {
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react';
import { useState, SyntheticEvent } from 'react';
import { useTextEditor } from '../hooks/useTextEditor';

import Toolbar from './Toolbar';
import { IEditorToolbar, TextEditorProps } from '../types';
import { getBorderColor } from '../utils/app.utils';

const defaultMenuToolbar: IEditorToolbar[] = ['heading', 'bold', 'italic', 'underline', 'link', 'bulletList'];

const classes = {
  input: (theme: Theme) => ({
    paddingBottom: 0,
    border: `1px solid ${getBorderColor(theme)} !important`,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  }),
  label: (theme: Theme) => ({
    pointerEvents: 'none' as const,
    color: theme.palette.grey[800],
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 1,
    zIndex: 100,
    padding: '4px 3px',
    marginBottom: 6,
  }),
  tabs: {
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: 'transparent',
    },
  },
  tab: (theme: Theme) => ({
    textTransform: 'none' as const,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      color: theme.palette.mode === 'light' ? '#000' : '#fff',
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
  menu: (theme: Theme) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    minWidth: 400,
  }),
  bubbleMenu: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
  }),
};

const TextEditor = ({
  placeholder,
  label,
  error,
  onChange,
  inputClassName,
  value,
  toolbarClassName,
  tabsClassName,
  tabClassName,
  rootClassName,
  toolbar,
  bubbleMenuToolbar,
  floatingMenuToolbar,
  errorClassName,
  labelClassName,
  user,
  mentions,
  userPathname,
  labels,
  uploadFileOptions,
  editable = true,
  withFloatingMenu = false,
  withBubbleMenu = true,
  ...editorOptions
}: TextEditorProps) => {
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');

  const handleTabChange = (_: SyntheticEvent, value: 'editor' | 'preview') => setTab(value);

  const editor = useTextEditor({
    placeholder,
    onChange,
    value,
    tab,
    editable,
    user,
    mentions,
    userPathname,
    uploadFileOptions,
    uploadFileLabels: labels?.upload,
    ...editorOptions,
  });

  // preview
  if (!editable) {
    return <EditorContent className={inputClassName} editor={editor} />;
  }

  return (
    <div className={rootClassName} css={{ position: 'relative' }}>
      {/* ---------------------------- */}
      {/* ----------- label ---------- */}
      {/* ---------------------------- */}
      {label && (
        <Typography className={labelClassName} css={classes.label}>
          {label}
        </Typography>
      )}
      {/* ---------------------------- */}
      {/* ------------ tabs ---------- */}
      {/* ---------------------------- */}
      <Tabs
        aria-label="basic tabs example"
        className={tabsClassName}
        css={classes.tabs}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        value={tab}
        onChange={handleTabChange}
      >
        <Tab
          className={tabClassName}
          css={classes.tab}
          label={labels?.editor?.editor || 'Editor'}
          value="editor"
        />
        <Tab className={tabClassName} css={classes.tab} label={labels?.editor?.preview || 'Preview'} />
      </Tabs>

      {/* ---------------------------- */}
      {/* ----------- editor --------- */}
      {/* ---------------------------- */}
      {tab === 'editor'
        ? (
          <div className={cx('positionRelative flexColumn tiptap', inputClassName)} css={classes.input}>
            <div className="positionRelative stretchSelf">
              {editor && withFloatingMenu && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Toolbar
                    css={[classes.menu, classes.bubbleMenu]}
                    editor={editor}
                    labels={labels}
                    toolbar={floatingMenuToolbar || defaultMenuToolbar}
                    uploadFileOptions={uploadFileOptions}
                  />
                </FloatingMenu>
              )}
              {editor && withBubbleMenu && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Toolbar
                    css={[classes.menu, classes.bubbleMenu]}
                    editor={editor}
                    toolbar={bubbleMenuToolbar || defaultMenuToolbar}
                    uploadFileOptions={uploadFileOptions}
                  />
                </BubbleMenu>
              )}
              {/* editor */}
              <EditorContent editor={editor} />
              {error && (
                <FormHelperText error className={errorClassName} css={{ paddingTop: 4, paddingBottom: 4 }}>
                  {error}
                </FormHelperText>
              )}
              {editor && (
                <Toolbar
                  className={cx('stretchSelf', toolbarClassName)}
                  editor={editor}
                  labels={labels}
                  toolbar={toolbar}
                  uploadFileOptions={uploadFileOptions}
                />
              )}
            </div>
          </div>
        /*
         * ---------------------------- //
         * ----------- preview -------- //
         * ---------------------------- //
         */
        ) : (
          <EditorContent className={inputClassName} editor={editor} />
        )}
    </div>
  );
};

export default TextEditor;
