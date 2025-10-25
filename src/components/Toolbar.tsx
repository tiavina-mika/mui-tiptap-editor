'use client';

import { cx } from '@emotion/css';
import { Editor, useCurrentEditor } from '@tiptap/react';
import { useState, useCallback, useMemo } from 'react';

import type { ToolbarProps } from '@/types/toolbar';
import type { Theme } from '@emotion/react';
import type { MouseEvent } from 'react';

import AlignCenter from '@/assets/icons/align-center.svg';
import AlignJustify from '@/assets/icons/align-justify.svg';
import AlignLeft from '@/assets/icons/align-left.svg';
import AlignRight from '@/assets/icons/align-right.svg';
import Bold from '@/assets/icons/bold.svg';
import BulletList from '@/assets/icons/bullet-list.svg';
import Code from '@/assets/icons/code.svg';
import CodeBlock from '@/assets/icons/codeblock.svg';
import Italic from '@/assets/icons/italic.svg';
import Link from '@/assets/icons/link.svg';
import Mention from '@/assets/icons/mention.svg';
import OrderedList from '@/assets/icons/ordered-list.svg';
import Picture from '@/assets/icons/picture.svg';
import Quote from '@/assets/icons/quote.svg';
import Redo from '@/assets/icons/redo.svg';
import Strike from '@/assets/icons/strike.svg';
import Table from '@/assets/icons/table.svg';
import TextColor from '@/assets/icons/text-color.svg';
import Underline from '@/assets/icons/underline.svg';
import Undo from '@/assets/icons/undo.svg';
import Youtube from '@/assets/icons/youtube.svg';
import {
  checkIsValidUrl,
  defaultEditorToolbar,
  getBorderColor,
  showTextEditorToolbarMenu,
} from '@/utils/app.utils';

import ColorPicker from './ColorPicker';
import Heading from './Heading';
import TableMenuDialog from './TableMenuDialog';
import ToolBarIconButton from './ToolBarIconButton';
import UploadFile from './UploadFile';
import YoutubeDialog from './YoutubeDialog';

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
      } else {
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


const Toolbar = ({
  // editor,
  className,
  labels,
  uploadFileOptions,
  position,
  colorId,
  toolbar = defaultEditorToolbar,
  type = 'toolbar',
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
      css={
        position
          ? position === 'bottom'
            ? classes.bottomToolbar
            : classes.topToolbar
          : undefined
      }
    >
      {showTextEditorToolbarMenu(toolbar, 'heading') && (
        <Heading split editor={editor} headingLabels={labels?.headings} />
      )}

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleBold().run()}
        display={showTextEditorToolbarMenu(toolbar, 'bold')}
        icon={Bold}
        iconSize={10}
        name="bold"
        tooltip={labels?.toolbar?.bold || 'Bold'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        display={showTextEditorToolbarMenu(toolbar, 'italic')}
        icon={Italic}
        iconSize={12}
        name="italic"
        tooltip={labels?.toolbar?.italic || 'Italic'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        display={showTextEditorToolbarMenu(toolbar, 'strike')}
        icon={Strike}
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
        icon={Underline}
        iconSize={13}
        name="underline"
        tooltip={labels?.toolbar?.underline || 'Underline'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <ToolBarIconButton
        split
        display={showTextEditorToolbarMenu(toolbar, 'color')}
        icon={TextColor}
        iconSize={24}
        id={colorId || 'color'}
        name="color"
        tooltip={labels?.toolbar?.color || 'Text Color'}
        withTooltip={isWithTooltip}
      >
        <ColorPicker editor={editor} id={colorId || 'color'} />
      </ToolBarIconButton>

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={AlignLeft}
        iconSize={19}
        isActive={editor.isActive({ textAlign: 'left' })}
        name="align-left"
        tooltip={labels?.toolbar?.alignLeft || 'Left align'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={AlignCenter}
        iconSize={19}
        isActive={editor.isActive({ textAlign: 'center' })}
        name="align-center"
        tooltip={labels?.toolbar?.alignCenter || 'Center align'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={AlignRight}
        iconSize={19}
        isActive={editor.isActive({ textAlign: 'right' })}
        name="align-right"
        tooltip={labels?.toolbar?.alignRight || 'Right align'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={AlignJustify}
        iconSize={19}
        isActive={editor.isActive({ textAlign: 'justify' })}
        name="align-justify"
        tooltip={labels?.toolbar?.alignJustify || 'Justify align'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />

      <ToolBarIconButton
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        display={showTextEditorToolbarMenu(toolbar, 'bulletList')}
        icon={BulletList}
        iconSize={19}
        name="bulletList"
        tooltip={labels?.toolbar?.bulletList || 'Bullet list'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        display={showTextEditorToolbarMenu(toolbar, 'orderedList')}
        icon={OrderedList}
        iconSize={14}
        name="orderedList"
        tooltip={labels?.toolbar?.orderedList || 'Ordered list'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'link')}
        icon={Link}
        iconSize={18}
        name="link"
        tooltip={labels?.toolbar?.link || 'Link'}
        withTooltip={isWithTooltip}
        onClick={setLink}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'image')}
        icon={Picture}
        iconSize={16}
        id="upload"
        name="upload"
        tooltip={labels?.toolbar?.upload || 'Upload image'}
        withTooltip={isWithTooltip}
      >
        <UploadFile editor={editor} id="upload" {...uploadFileOptions} />
      </ToolBarIconButton>

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'mention')}
        icon={Mention}
        iconSize={16}
        name="mention"
        tooltip={labels?.toolbar?.mention || 'Mention user'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().insertContent('@').run()}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'table')}
        icon={Table}
        iconSize={18}
        name="table"
        tooltip={labels?.table?.table || 'Table'}
        withTooltip={isWithTooltip}
        onClick={handleOpenTableMenu}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'blockquote')}
        icon={Quote}
        iconSize={16}
        name="blockquote"
        tooltip={labels?.toolbar?.blockquote || 'Block quote'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'codeBlock')}
        icon={CodeBlock}
        iconSize={13.5}
        name="codeBlock"
        tooltip={labels?.toolbar?.codeBlock || 'Code block'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'code')}
        icon={Code}
        iconSize={18}
        name="code"
        tooltip={labels?.toolbar?.inlineCode || 'Inline code'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'youtube')}
        icon={Youtube}
        iconSize={18}
        name="youtube"
        tooltip={labels?.toolbar?.youtube || 'Insert YouTube video'}
        withTooltip={isWithTooltip}
        onClick={toggleYoutubeDialog}
      />

      {/* History */}
      <ToolBarIconButton
        disabled={!editor.can().undo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={Undo}
        iconSize={18}
        name="undo"
        tooltip={labels?.toolbar?.undo || 'Undo'}
        withTooltip={isWithTooltip}
        onClick={() => editor.chain().focus().undo().run()}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().redo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={Redo}
        iconSize={18}
        name="redo"
        tooltip={labels?.toolbar?.redo || 'Redo'}
        withTooltip={isWithTooltip}
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
