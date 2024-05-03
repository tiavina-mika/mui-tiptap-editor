import "../index.css";

import { cx } from '@emotion/css';
import { Theme } from '@emotion/react';
import { FormHelperText, Tab, Tabs, Typography } from '@mui/material';
import {
  EditorContent,
  EditorOptions,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react';
import { useState, SyntheticEvent, ReactNode } from 'react';
import { useTextEditor } from "../hooks/useTextEditor";

import Toolbar from './Toolbar';
import { IEditorToolbar, ITextEditorOption } from "../type";

const defaultMenuToolbar: IEditorToolbar[] = ['bold', 'italic', 'underline', 'link'];

const classes = {
  editorRoot: (theme: Theme) => ({
    [theme.breakpoints.down('md')]: {
      paddingBottom: 40,
    },
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
      color: '#000',
      backgroundColor: '#ededed',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
};


export type TextEditorProps = {
  placeholder?: string;
  label?: ReactNode;
  error?: string;
  onChange?: (value: string) => void;
  inputClassName?: string;
  value?: string;
  toolbarClassName?: string;
  tabsClassName?: string;
  tabClassName?: string;
  errorClassName?: string;
  rootClassName?: string;
  withFloatingMenu?: boolean;
  withBubbleMenu?: boolean;
  labelClassName?: string;
  toolbar?: IEditorToolbar[];
  bubbleMenuToolbar?: IEditorToolbar[];
  floatingMenuToolbar?: IEditorToolbar[];
  user?: ITextEditorOption;
  mentions?: ITextEditorOption[];
} & Partial<EditorOptions>;

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
    ...editorOptions
  })

  // preview
  if (!editable) {
    return <EditorContent editor={editor} className={inputClassName} />;
  }

  return (
    <div className={rootClassName}>
      {/* ----------- tabs ----------- */}
      {label && (
        <Typography css={classes.label} className={labelClassName}>
          {label}
        </Typography>
      )}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        css={classes.tabs}
        className={tabsClassName}
      >
        <Tab css={classes.tab} label="Editor" value="editor" className={tabClassName} />
        <Tab css={classes.tab} label="Preview" value="preview" className={tabClassName} />
      </Tabs>
      {tab === 'editor'
        ? (
          <div className={cx('positionRelative flexColumn tiptap', inputClassName)} css={classes.editorRoot}>
            <div className="positionRelative stretchSelf">
              {editor && withFloatingMenu && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Toolbar
                    editor={editor}
                    toolbar={floatingMenuToolbar || defaultMenuToolbar}
                  />
                </FloatingMenu>
              )}
              {editor && withBubbleMenu && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Toolbar
                    editor={editor}
                    toolbar={bubbleMenuToolbar || defaultMenuToolbar}
                  />
                </BubbleMenu>
              )}
              {/* editor */}
              <EditorContent editor={editor} />
              {error && (
                <FormHelperText error css={{ paddingTop: 4, paddingBottom: 4 }} className={errorClassName}>
                  {error}
                </FormHelperText>
              )}
            </div>
            {editor && (
              <Toolbar
                editor={editor}
                className={cx('stretchSelf', toolbarClassName)}
                toolbar={toolbar}
              />
            )}
          </div>
        ) : (
          <EditorContent editor={editor} className={inputClassName} />
        )
      }
    </div>
  );
};

export default TextEditor;
