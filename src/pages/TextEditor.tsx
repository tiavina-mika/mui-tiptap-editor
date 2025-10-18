'use client';

import '../styles/index.css';

import { cx } from '@emotion/css';
import {
  FormHelperText, Stack, Tab, Tabs, Typography,
} from '@mui/material';
import { EditorContent, EditorContext } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import { useState, useMemo } from 'react';

import type { IEditorToolbar, TextEditorProps } from '@/types';
import type { Theme } from '@emotion/react';
import type { SyntheticEvent } from 'react';

import { type ToCItemType } from '@/components/tableOfContent/ToC';
import TocBlock from '@/components/tableOfContent/TocBlock';
import Toolbar from '@/components/Toolbar';
import { useTextEditor } from '@/hooks/useTextEditor';
import { getBorderColor } from '@/utils/app.utils';

const defaultMenuToolbar: IEditorToolbar[] = [
  'heading',
  'bold',
  'italic',
  'underline',
  'link',
  'bulletList',
];

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
    fontWeight: 500,
    fontSize: 14,
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      color: theme.palette.mode === 'light' ? '#000' : '#fff',
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[800],
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
    zIndex: 10,
    position: 'absolute' as const,
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
  tableOfContentsClassName,
  labelClassName,
  user,
  mentions,
  userPathname,
  labels,
  uploadFileOptions,
  id,
  editable = true,
  withFloatingMenu = false,
  withBubbleMenu = true,
  disableTabs = false,
  toolbarPosition = 'bottom',
  disableTableOfContents = true,
  tableOfContentPosition = 'right',
  ...editorOptions
}: TextEditorProps) => {
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');
  const [tableOfContents, setTableOfContents] = useState<ToCItemType[]>([]);

  const handleTabChange = (_: SyntheticEvent, value: 'editor' | 'preview') =>
    setTab(value);

  const handleToCItemClick = (contents: ToCItemType[] = []) => {
    setTableOfContents(contents);
  };

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
    id,
    uploadFileLabels: labels?.upload,
    onChangeTableOfContents: handleToCItemClick,
    ...editorOptions,
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  // preview
  if (!editable) {
    return <EditorContent className={inputClassName} editor={editor} />;
  }

  // Memoize the provider value to avoid unnecessary re-renders
  return (
    <EditorContext.Provider value={providerValue}>
      <Stack
        spacing={2}
        direction={{
          sm: 'column',
          md: tableOfContentPosition === 'top' ? 'column' : 'row',
        }}
      >
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
          {!disableTabs && (
            <Tabs
              aria-label="basic tabs example"
              className={tabsClassName}
              css={classes.tabs}
              value={tab}
              TabIndicatorProps={{
                children: <span className="MuiTabs-indicatorSpan" />,
              }}
              onChange={handleTabChange}
            >
              <Tab
                className={tabClassName}
                css={classes.tab}
                label={labels?.editor?.editor || 'Editor'}
                value="editor"
              />
              <Tab
                className={tabClassName}
                css={classes.tab}
                label={labels?.editor?.preview || 'Preview'}
              />
            </Tabs>
          )}

          {/* ---------------------------- */}
          {/* ----------- Editor --------- */}
          {/* ---------------------------- */}
          {tab === 'editor' ? (
            <>
              <div
                css={classes.input}
                className={cx(
                  'positionRelative flexColumn tiptap',
                  inputClassName
                )}
              >
                <div className="positionRelative stretchSelf flexColumn">
                  {editor && withFloatingMenu && (
                    <FloatingMenu editor={editor}>
                      <Toolbar
                        css={[classes.menu, classes.bubbleMenu]}
                        labels={labels}
                        toolbar={floatingMenuToolbar || defaultMenuToolbar}
                        type="floating"
                        uploadFileOptions={uploadFileOptions}
                      />
                    </FloatingMenu>
                  )}
                  {editor && withBubbleMenu && (
                    <BubbleMenu editor={editor}>
                      <Toolbar
                        css={[classes.menu, classes.bubbleMenu]}
                        toolbar={bubbleMenuToolbar || defaultMenuToolbar}
                        type="bubble"
                        uploadFileOptions={uploadFileOptions}
                      />
                    </BubbleMenu>
                  )}
                  {/* editor field */}
                  <EditorContent className="stretchSelf" editor={editor} />
                  {/* top or bottom toolbar */}
                  {editor && (
                    <Toolbar
                      className={cx('stretchSelf', toolbarClassName)}
                      colorId={id}
                      labels={labels}
                      position={toolbarPosition}
                      toolbar={toolbar}
                      type="toolbar"
                      uploadFileOptions={uploadFileOptions}
                    />
                  )}
                </div>
              </div>
              {/* error message */}
              {error && (
                <FormHelperText
                  error
                  className={errorClassName}
                  css={{ paddingTop: 4, paddingBottom: 4 }}
                >
                  {error}
                </FormHelperText>
              )}
            </>
          ) : (
            /*
             * ---------------------------- //
             * ----------- Preview -------- //
             * ---------------------------- //
             */
            <EditorContent className={inputClassName} editor={editor} />
          )}
        </div>
        {/*
         * ---------------------------- //
         * ---- Table of Contents ---- //
         * ---------------------------- //
         */}
        {!disableTableOfContents && (
          <TocBlock
            label={labels?.tableOfContent?.label}
            noContentLabel={labels?.tableOfContent?.noContentLabel}
            position={tableOfContentPosition}
            tableOfContents={tableOfContents}
            tableOfContentsClassName={tableOfContentsClassName}
          />
        )}
      </Stack>
    </EditorContext.Provider>
  );
};

export default TextEditor;
