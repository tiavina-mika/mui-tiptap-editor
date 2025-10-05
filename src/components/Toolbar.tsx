'use client';

import type { Theme } from '@emotion/react';
import { cx } from '@emotion/css';
import { Editor, useCurrentEditor } from '@tiptap/react';
import {
  useState, useCallback,
  useMemo,
} from 'react';
import type { MouseEvent } from 'react';

import TableMenuDialog from './TableMenuDialog';
import Heading from './Heading';
import ColorPicker from './ColorPicker';
import type { IEditorToolbar, ILabels, TextEditorProps } from '../types.d';
import {
  checkIsValidUrl, defaultEditorToolbar, getBorderColor, showTextEditorToolbarMenu,
} from '../utils/app.utils';
import YoutubeDialog from './YoutubeDialog';
import Bold from '../icons/Bold';
import Italic from '../icons/Italic';
import Strike from '../icons/Strike';
import Underline from '../icons/Underline';
import Link from '../icons/Link';
import BulletList from '../icons/BulletList';
import OrderedList from '../icons/OrderedList';
import AlignLeft from '../icons/AlignLeft';
import AlignCenter from '../icons/AlignCenter';
import AlignRight from '../icons/AlignJustify';
import AlignJustify from '../icons/AlignRight';
import Quote from '../icons/Quote';
import Code from '../icons/Code';
import Table from '../icons/Table';
import Youtube from '../icons/Youtube';
import Undo from '../icons/Undo';
import Redo from '../icons/Redo';
import Mention from '../icons/Mention';
import Picture from '../icons/Picture';
import TextColor from '../icons/TextColor';
import UploadFile from './UploadFile';
import CodeBlock from '../icons/CodeBlock';
import ToolBarIconButton from './ToolBarIconButton';

const classes = {
  topToolbar: (theme: Theme) => ({
    borderBottom: '1px solid ' + getBorderColor(theme),
    paddingLeft: 8,
    paddingRight: 8,
    order: -1,
  }),
  bottomToolbar: (theme: Theme) => ({
    marginTop: -1,
    borderTop: '1px solid ' + getBorderColor(theme),
    paddingLeft: 8,
    paddingRight: 8,
  }),
  button: (isActive: boolean, split: boolean) => (theme: Theme) => {
    let backgroundColor = 'transparent';
    const isLightMode = theme.palette.mode === 'light';

    if (isActive) {
      if (isLightMode) {
        backgroundColor = theme.palette.grey[100];
      }
      else {
        backgroundColor = theme.palette.grey[800];
      }
    }

    return {
      position: 'relative' as const,
      borderRadius: 0,
      border: 'none',
      borderRight: split ? `1px solid ${getBorderColor(theme)}` : 'none',
      cursor: 'pointer',
      height: 24,
      width: 24,
      padding: 18,
      backgroundColor,
      '&.Mui-disabled': {
        opacity: 0.4,
      },
    };
  },
  splittedBorder: (theme: Theme) => {
    return {
      borderRight: '1px solid ' + getBorderColor(theme),
    };
  },
};

export type ToolbarProps = {
  // editor: Editor;
  /**
   * override the default class
   */
  className?: string;
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
   * Custom labels for the toolbar
   */
  labels?: Omit<ILabels, 'editor'>;
  /**
   * upload file options
   * ex: file size, number of files, allowed mime types, api callback, etc
   */
  uploadFileOptions?: TextEditorProps['uploadFileOptions'];

  /**
   * position of the toolbar
   */
  position?: 'top' | 'bottom';
  colorId?: string;
  type?: 'toolbar' | 'floating' | 'bubble';
};

const Toolbar = ({
  // editor,
  className,
  labels,
  uploadFileOptions,
  position,
  colorId,
  toolbar = defaultEditorToolbar,
  type ='toolbar',
}: ToolbarProps) => {
  const [openYoutubeDialog, setOpenYoutubeDialog] = useState<boolean>(false);
  const { editor } = useCurrentEditor() as { editor: Editor };

  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenTableMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setTableAnchorEl(event.currentTarget);
  }, []);

  const handleCloseTableMenu = () => {
    setTableAnchorEl(null);
  };

  const toggleYoutubeDialog = () => setOpenYoutubeDialog(!openYoutubeDialog);

  // set link
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const isValidUrl = checkIsValidUrl(url);

    if (!isValidUrl) {
      window.alert(labels?.link?.invalid || 'Invalid URL');
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor, labels?.link?.invalid]);

  const isWithTooltip = useMemo(() => {
    return type === 'toolbar';
  }, [type]);

  return (
    <div
      className={cx(className, 'flexRow center', type ? `${type}-menu` : '')}
      css={position
        ? (position === 'bottom' ? classes.bottomToolbar : classes.topToolbar)
        : undefined}
    >
      {showTextEditorToolbarMenu(toolbar, 'heading') && (
        <Heading split editor={editor} headingLabels={labels?.headings} />
      )}

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleBold().run()}
        display={showTextEditorToolbarMenu(toolbar, 'bold')}
        icon={<Bold />}
        iconSize={12}
        name="bold"
        tooltip={labels?.toolbar?.bold || 'Bold'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        display={showTextEditorToolbarMenu(toolbar, 'italic')}
        icon={<Italic />}
        iconSize={12}
        name="italic"
        tooltip={labels?.toolbar?.italic || 'Italic'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        display={showTextEditorToolbarMenu(toolbar, 'strike')}
        icon={<Strike />}
        iconSize={14}
        name="strike"
        tooltip={labels?.toolbar?.strike || 'Strike through'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        display={showTextEditorToolbarMenu(toolbar, 'underline')}
        icon={<Underline />}
        iconSize={14}
        name="underline"
        tooltip={labels?.toolbar?.underline || 'Underline'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <ToolBarIconButton
        split
        display={showTextEditorToolbarMenu(toolbar, 'color')}
        icon={<TextColor />}
        iconSize={24}
        id={colorId || 'color'}
        name="color"
        tooltip={labels?.toolbar?.color || 'Text Color'}
      >
        <ColorPicker editor={editor} id={colorId || 'color'} />
      </ToolBarIconButton>

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={<AlignLeft />}
        isActive={editor.isActive({ textAlign: 'left' })}
        name="align-left"
        tooltip={labels?.toolbar?.alignLeft || 'Left align'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={<AlignCenter />}
        isActive={editor.isActive({ textAlign: 'center' })}
        name="align-center"
        tooltip={labels?.toolbar?.alignCenter || 'Center align'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={<AlignRight />}
        isActive={editor.isActive({ textAlign: 'right' })}
        name="align-right"
        tooltip={labels?.toolbar?.alignRight || 'Right align'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={<AlignJustify />}
        isActive={editor.isActive({ textAlign: 'justify' })}
        name="align-justify"
        tooltip={labels?.toolbar?.alignJustify || 'Justify align'}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        display={showTextEditorToolbarMenu(toolbar, 'bulletList')}
        icon={<BulletList />}
        name="bulletList"
        tooltip={labels?.toolbar?.bulletList || 'Bullet list'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        display={showTextEditorToolbarMenu(toolbar, 'orderedList')}
        icon={<OrderedList />}
        iconSize={14}
        name="orderedList"
        tooltip={labels?.toolbar?.orderedList || 'Ordered list'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'link')}
        icon={<Link />}
        name="link"
        tooltip={labels?.toolbar?.link || 'Link'}
        onClick={setLink}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'image')}
        icon={<Picture />}
        iconSize={16}
        id="upload"
        name="upload"
        tooltip={labels?.toolbar?.upload || 'Upload image'}
      >
        <UploadFile editor={editor} id="upload" {...uploadFileOptions} />
      </ToolBarIconButton>

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'mention')}
        icon={<Mention />}
        iconSize={16}
        name="mention"
        tooltip={labels?.toolbar?.mention || 'Mention user'}
        onClick={() => editor.chain().focus().insertContent('@').run()}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'table')}
        icon={<Table />}
        name="table"
        tooltip={labels?.table?.table || 'Table'}
        onClick={handleOpenTableMenu}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'blockquote')}
        icon={<Quote />}
        iconSize={16}
        name="blockquote"
        tooltip={labels?.toolbar?.blockquote || 'Block quote'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'codeBlock')}
        icon={<CodeBlock />}
        iconSize={16}
        name="codeBlock"
        tooltip={labels?.toolbar?.codeBlock || 'Code block'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'code')}
        icon={<Code />}
        name="code"
        tooltip={labels?.toolbar?.inlineCode || 'Inline code'}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'youtube')}
        icon={<Youtube />}
        name="youtube"
        tooltip={labels?.toolbar?.youtube || 'Insert YouTube video'}
        onClick={toggleYoutubeDialog}
      />

      {/* History */}
      <ToolBarIconButton
        disabled={!editor.can().undo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={<Undo />}
        name="undo"
        tooltip={labels?.toolbar?.undo || 'Undo'}
        onClick={() => editor.chain().focus().undo().run()}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().redo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={<Redo />}
        name="redo"
        tooltip={labels?.toolbar?.redo || 'Redo'}
        onClick={() => editor.chain().focus().redo().run()}
      />

      {showTextEditorToolbarMenu(toolbar, 'youtube') && (
        <YoutubeDialog
          editor={editor}
          labels={labels?.youtube}
          open={openYoutubeDialog}
          onClose={toggleYoutubeDialog}
        />
      )}
      {showTextEditorToolbarMenu(toolbar, 'table') && (
        <TableMenuDialog
          anchorEl={tableAnchorEl}
          editor={editor}
          labels={labels?.table}
          onClose={handleCloseTableMenu}
        />
      )}
    </div>
  );
};

export default Toolbar;
