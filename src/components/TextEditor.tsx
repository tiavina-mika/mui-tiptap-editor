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

import MenuBar from './MenuBar';
import { IEditorToolbar } from "../type";

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
  className?: string;
  value?: string;
  menuClassName?: string;
  withFloatingButtons?: boolean;
  toolbar?: IEditorToolbar[];
} & Partial<EditorOptions>;

const TextEditor = ({
  placeholder,
  label,
  error,
  onChange,
  className,
  value,
  menuClassName,
  toolbar,
  editable = true,
  withFloatingButtons = false,
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
    ...editorOptions
  })

  // preview
  if (!editable) {
    return <EditorContent editor={editor} className={className} />;
  }

  return (
    <div>
      {/* ----------- tabs ----------- */}
      {label && (
        <Typography css={classes.label}>
          {label}
        </Typography>
      )}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        css={classes.tabs}
      >
        <Tab css={classes.tab} label="Editor" value="editor" />
        <Tab css={classes.tab} label="Preview" value="preview" />
      </Tabs>
      {tab === 'editor'
        ? (
          <div className={cx('positionRelative flexColumn tiptap', className)} css={classes.editorRoot}>
            <div className="positionRelative stretchSelf">
              {editor && withFloatingButtons && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <MenuBar
                    editor={editor}
                  />
                </FloatingMenu>
              )}
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <MenuBar
                    editor={editor}
                  />
                </BubbleMenu>
              )}
              {/* editor */}
              <EditorContent editor={editor} />
              {error && (
                <FormHelperText error css={{ paddingTop: 4, paddingBottom: 4 }}>
                  {error}
                </FormHelperText>
              )}
            </div>
            {editor && (
              <MenuBar
                editor={editor}
                className="stretchSelf"
                toolbar={toolbar}
              />
            )}
          </div>
        ) : (
          <EditorContent editor={editor} className={className} />
        )
      }
    </div>
  );
};

export default TextEditor;
