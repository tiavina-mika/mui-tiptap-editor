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
  icons,
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

  const toggleYoutubeDialog = useCallback(
    () => setOpenYoutubeDialog((prevOpen) => !prevOpen),
    []
  );

  /*
   * Stable per `editor` identity (which never changes across re-renders), so these handlers
   * keep the same reference on every Toolbar re-render — required for the `React.memo` on
   * `ToolBarIconButton` to actually skip re-rendering buttons whose state hasn't changed.
   * Also simplified from `.can().chain().focus().X().run()` to `.can().X()` for the disabled
   * checks below: the chain/focus/run roundtrip was redundant for a dry-run check.
   */
  const commands = useMemo(
    () => ({
      toggleBold: () => editor.chain().focus().toggleBold().run(),
      toggleItalic: () => editor.chain().focus().toggleItalic().run(),
      toggleStrike: () => editor.chain().focus().toggleStrike().run(),
      toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
      setTextAlignLeft: () => editor.chain().focus().setTextAlign('left').run(),
      setTextAlignCenter: () => editor.chain().focus().setTextAlign('center').run(),
      setTextAlignRight: () => editor.chain().focus().setTextAlign('right').run(),
      setTextAlignJustify: () => editor.chain().focus().setTextAlign('justify').run(),
      toggleBulletList: () => editor.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () => editor.chain().focus().toggleOrderedList().run(),
      insertMention: () => editor.chain().focus().insertContent('@').run(),
      toggleBlockquote: () => editor.chain().focus().toggleBlockquote().run(),
      toggleCodeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
      toggleCode: () => editor.chain().focus().toggleCode().run(),
      undo: () => editor.chain().focus().undo().run(),
      redo: () => editor.chain().focus().redo().run(),
    }),
    [editor]
  );

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
        disabled={!editor.can().toggleBold()}
        display={showTextEditorToolbarMenu(toolbar, 'bold')}
        icon={icons?.bold?.src || Bold}
        iconSize={icons?.bold?.size || 10}
        name="bold"
        tooltip={labels?.toolbar?.bold || 'Bold'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleBold}
      />

      <ToolBarIconButton
        disabled={!editor.can().toggleItalic()}
        display={showTextEditorToolbarMenu(toolbar, 'italic')}
        icon={icons?.italic?.src || Italic}
        iconSize={icons?.italic?.size || 12}
        name="italic"
        tooltip={labels?.toolbar?.italic || 'Italic'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleItalic}
      />

      <ToolBarIconButton
        disabled={!editor.can().toggleStrike()}
        display={showTextEditorToolbarMenu(toolbar, 'strike')}
        icon={icons?.strike?.src || Strike}
        iconSize={icons?.strike?.size || 14}
        name="strike"
        tooltip={labels?.toolbar?.strike || 'Strike through'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleStrike}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().toggleUnderline()}
        display={showTextEditorToolbarMenu(toolbar, 'underline')}
        icon={icons?.underline?.src || Underline}
        iconSize={icons?.underline?.size || 13}
        name="underline"
        tooltip={labels?.toolbar?.underline || 'Underline'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleUnderline}
      />

      <ToolBarIconButton
        split
        display={showTextEditorToolbarMenu(toolbar, 'color')}
        icon={icons?.color?.src || TextColor}
        iconSize={icons?.color?.size || 24}
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
        icon={icons?.alignLeft?.src || AlignLeft}
        iconSize={icons?.alignLeft?.size || 19}
        isActive={editor.isActive({ textAlign: 'left' })}
        name="align-left"
        tooltip={labels?.toolbar?.alignLeft || 'Left align'}
        withTooltip={isWithTooltip}
        onClick={commands.setTextAlignLeft}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={icons?.alignCenter?.src || AlignCenter}
        iconSize={icons?.alignCenter?.size || 19}
        isActive={editor.isActive({ textAlign: 'center' })}
        name="align-center"
        tooltip={labels?.toolbar?.alignCenter || 'Center align'}
        withTooltip={isWithTooltip}
        onClick={commands.setTextAlignCenter}
      />
      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={icons?.alignRight?.src || AlignRight}
        iconSize={icons?.alignRight?.size || 19}
        isActive={editor.isActive({ textAlign: 'right' })}
        name="align-right"
        tooltip={labels?.toolbar?.alignRight || 'Right align'}
        withTooltip={isWithTooltip}
        onClick={commands.setTextAlignRight}
      />
      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'align')}
        icon={icons?.alignJustify?.src || AlignJustify}
        iconSize={icons?.alignJustify?.size || 19}
        isActive={editor.isActive({ textAlign: 'justify' })}
        name="align-justify"
        tooltip={labels?.toolbar?.alignJustify || 'Justify align'}
        withTooltip={isWithTooltip}
        onClick={commands.setTextAlignJustify}
      />

      <ToolBarIconButton
        disabled={!editor.can().toggleBulletList()}
        display={showTextEditorToolbarMenu(toolbar, 'bulletList')}
        icon={icons?.bulletList?.src || BulletList}
        iconSize={icons?.bulletList?.size || 19}
        name="bulletList"
        tooltip={labels?.toolbar?.bulletList || 'Bullet list'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleBulletList}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().toggleOrderedList()}
        display={showTextEditorToolbarMenu(toolbar, 'orderedList')}
        icon={icons?.orderedList?.src || OrderedList}
        iconSize={icons?.orderedList?.size || 14}
        name="orderedList"
        tooltip={labels?.toolbar?.orderedList || 'Ordered list'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleOrderedList}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'link')}
        icon={icons?.link?.src || Link}
        iconSize={icons?.link?.size || 18}
        name="link"
        tooltip={labels?.toolbar?.link || 'Link'}
        withTooltip={isWithTooltip}
        onClick={setLink}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'image')}
        icon={icons?.upload?.src || Picture}
        iconSize={icons?.upload?.size || 16}
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
        icon={icons?.mention?.src || Mention}
        iconSize={icons?.mention?.size || 16}
        name="mention"
        tooltip={labels?.toolbar?.mention || 'Mention user'}
        withTooltip={isWithTooltip}
        onClick={commands.insertMention}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'table')}
        icon={icons?.table?.src || Table}
        iconSize={icons?.table?.size || 18}
        name="table"
        tooltip={labels?.table?.table || 'Table'}
        withTooltip={isWithTooltip}
        onClick={handleOpenTableMenu}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'blockquote')}
        icon={icons?.blockquote?.src || Quote}
        iconSize={icons?.blockquote?.size || 16}
        name="blockquote"
        tooltip={labels?.toolbar?.blockquote || 'Block quote'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleBlockquote}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'codeBlock')}
        icon={icons?.codeBlock?.src || CodeBlock}
        iconSize={icons?.codeBlock?.size || 13.5}
        name="codeBlock"
        tooltip={labels?.toolbar?.codeBlock || 'Code block'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleCodeBlock}
      />

      <ToolBarIconButton
        split
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'code')}
        icon={icons?.inlineCode?.src || Code}
        iconSize={icons?.inlineCode?.size || 18}
        name="code"
        tooltip={labels?.toolbar?.inlineCode || 'Inline code'}
        withTooltip={isWithTooltip}
        onClick={commands.toggleCode}
      />

      <ToolBarIconButton
        disabled={false}
        display={showTextEditorToolbarMenu(toolbar, 'youtube')}
        icon={icons?.youtube?.src || Youtube}
        iconSize={icons?.youtube?.size || 18}
        name="youtube"
        tooltip={labels?.toolbar?.youtube || 'Insert YouTube video'}
        withTooltip={isWithTooltip}
        onClick={toggleYoutubeDialog}
      />

      {/* History */}
      <ToolBarIconButton
        disabled={!editor.can().undo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={icons?.undo?.src || Undo}
        iconSize={icons?.undo?.size || 18}
        name="undo"
        tooltip={labels?.toolbar?.undo || 'Undo'}
        withTooltip={isWithTooltip}
        onClick={commands.undo}
      />

      <ToolBarIconButton
        split
        disabled={!editor.can().redo()}
        display={showTextEditorToolbarMenu(toolbar, 'history')}
        icon={icons?.redo?.src || Redo}
        iconSize={icons?.redo?.size || 18}
        name="redo"
        tooltip={labels?.toolbar?.redo || 'Redo'}
        withTooltip={isWithTooltip}
        onClick={commands.redo}
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
