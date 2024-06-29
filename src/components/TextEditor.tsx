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
import { IEditorToolbar, ILabels } from "../types";

const defaultMenuToolbar: IEditorToolbar[] = ['heading', 'bold', 'italic', 'underline', 'link', 'bulletList'];

const classes = {
  input: (theme: Theme) => ({
    paddingBottom: 0,
    border: `1px solid ${theme.palette.grey[300]} !important`,
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
      color: '#000',
      backgroundColor: '#ededed',
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
    minWidth: 400
  }),
  bubbleMenu: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
  })
};

export interface ITextEditorOption<T = string> {
  label: string;
  value: T,
  icon?: string | ReactNode;
  hide?: boolean;
}

export type TextEditorProps = {
  placeholder?: string;

  /**
   * input label
   * NOTE: it is placed above the tabs
   */
  label?: ReactNode;

  /**
   * error message to be displayed if any
   */
  error?: string;

  /**
   * value of the editor
   * it's an html string, eg: <p>hello world</p>
   */
  value?: string;

  /**
   * callback function to be called on change
   * it returns the html string of the editor, eg: <p>hello world</p>
   */
  onChange?: (value: string) => void;

  /**
   * input style override
   * it's the responsible of the whole input grey border and border radius
   *
   */
  inputClassName?: string;

  /**
   * toolbar style override,
   * it's mainly the responsible of the toolbar border top
   */
  toolbarClassName?: string;

  /**
   * tabs style override
   * the tabs 'editor' and 'preview' style
   */
  tabsClassName?: string;

  /**
   * tab style override
   * mainly used for the styles of the current selected tab
   */
  tabClassName?: string;

  /**
   * error message style override
   * eg: changing the color of the error message
   * or its font size
   */
  errorClassName?: string;

  /*
    * root class name
    * it's the main class name of the all the editor
    * label, tabs, input, toolbar, etc
  */
  rootClassName?: string;

  /**
   * label styles override
   * eg: changing the color of the label, its font size, color, etc
   */
  labelClassName?: string;

  /**
   * if true, floating menu will be disabled
   */
  withFloatingMenu?: boolean;

  /**
   * if true, bubble menu will be displayed
   */
  withBubbleMenu?: boolean;

  /**
   * toolbar (each icon) to be displayed
   *
   * possible values are: [
   * "heading", "bold", "italic", "strike", "link", "underline", "image", "code",
   * "orderedList", "bulletList", "align", "codeBlock", "blockquote", "table",
   * "history", "youtube", "color", "mention"
   * ]
   *
   * default values is all the above
   */
  toolbar?: IEditorToolbar[];

  /**
   * toolbar (each icon) to be displayed in bubble menu
   *
   * default values are: ['bold', 'italic', 'underline', 'link']
   */
  bubbleMenuToolbar?: IEditorToolbar[];

   /**
   * toolbar (each icon) to be displayed in floating menu
   *
   * default values are: ['bold', 'italic', 'underline', 'link']
   */
  floatingMenuToolbar?: IEditorToolbar[];

  /**
   * user object for collaboration
   * the current user or selected user used for collaboration
   *
   * eg: { label: 'John Doe', value: 'some_user_id' }
   */
  user?: ITextEditorOption;

  /**
   * list of users used for mentions
   *
   * eg. [{ label: 'John Doe', value: 'some_user_id' }, { label: 'James Smith', value: 'some_user_id_2' }, ...]
   * NOTE: the value should be unique, it's used for profile url
   * ex: /profile/:id or /profile/:slug, :id or :slug here is the value
   */
  mentions?: ITextEditorOption[];

  /**
   * user pathname for the mentioned user
   *
   * eg. /profile
   * so the final url will be /profile/:id
   * :id here is the value in mentions array (see above)
   * the final element is something like: <a href="/profile/some_user_id">{mentioned_user}</a>
   */
  userPathname?: string;

  /**
   * override labels
   * it's useful for i18n or changing the default labels
   */
  labels?: ILabels;
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
  userPathname,
  labels,
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
    ...editorOptions
  })

  // preview
  if (!editable) {
    return <EditorContent editor={editor} className={inputClassName} />;
  }

  return (
    <div className={rootClassName} css={{ position: 'relative' }}>
      {/* ---------------------------- */}
      {/* ----------- label ---------- */}
      {/* ---------------------------- */}
      {label && (
        <Typography css={classes.label} className={labelClassName}>
          {label}
        </Typography>
      )}
      {/* ---------------------------- */}
      {/* ------------ tabs ---------- */}
      {/* ---------------------------- */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        css={classes.tabs}
        className={tabsClassName}
      >
        <Tab css={classes.tab} label={labels?.editor?.editor || 'Editor'} value="editor" className={tabClassName} />
        <Tab css={classes.tab} label={labels?.editor?.preview || 'Preview'} className={tabClassName} />
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
                    editor={editor}
                    toolbar={floatingMenuToolbar || defaultMenuToolbar}
                    css={[classes.menu, classes.bubbleMenu]}
                    labels={labels}
                  />
                </FloatingMenu>
              )}
              {editor && withBubbleMenu && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Toolbar
                    editor={editor}
                    toolbar={bubbleMenuToolbar || defaultMenuToolbar}
                    css={[classes.menu, classes.bubbleMenu]}
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
              {editor && (
                <Toolbar
                  editor={editor}
                  className={cx('stretchSelf', toolbarClassName)}
                  toolbar={toolbar}
                  labels={labels}
                />
              )}
            </div>
          </div>
        // ---------------------------- //
        // ----------- preview -------- //
        // ---------------------------- //
        ) : (
          <EditorContent editor={editor} className={inputClassName} />
        )
      }
    </div>
  );
};

export default TextEditor;
