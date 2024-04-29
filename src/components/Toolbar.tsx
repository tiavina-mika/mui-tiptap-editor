import { Theme } from "@emotion/react";
import { cx } from "@emotion/css";
import { IconButton } from "@mui/material";
import { Editor } from "@tiptap/react";
import { useState, MouseEvent, useMemo, useCallback } from "react";

import TableMenuDialog from "./TableMenuDialog";
import LinkDialog from "./LinkDialog";
import HeadingMenu from "./HeadingMenu";
import ColorPicker from "./ColorPicker";
import { IEditorToolbar } from "../type";
import { defaultEditorToolbar, showTextEditorToolbarMenu } from "../utils/app.utils";
import YoutubeDialog from "./YoutubeDialog";
import Title from "../icons/Title";
import Bold from "../icons/Bold";
import Italic from "../icons/Italic";
import Strike from "../icons/Strike";
import Underline from "../icons/Underline";
import Link from "../icons/Link";
import BulletList from "../icons/BulletList";
import OrderedList from "../icons/OrderedList";
import AlignLeft from "../icons/AlignLeft";
import AlignCenter from "../icons/AlignCenter";
import AlignRight from "../icons/AlignJustify";
import AlignJustify from "../icons/AlignRight";
import Quote from "../icons/Quote";
import Code from "../icons/Code";
import Table from "../icons/Table";
import Youtube from "../icons/Youtube";
import Undo from "../icons/Undo";
import Redo from "../icons/Redo";

const classes = {
  menu: (theme: Theme) => ({
    border: "1px solid " + theme.palette.grey[100]
  }),
  button: (isActive: boolean, split: boolean) => (theme: Theme) => ({
    borderRadius: 0,
    border: "none",
    borderRight: split ? `1px solid ${theme.palette.grey[100]}` : "none",
    cursor: "pointer",
    height: 24,
    width: 24,
    padding: 18,
    backgroundColor: isActive ? theme.palette.primary.light : "#fff",
    "&.Mui-disabled": {
      opacity: 0.4
    }
  }),
  splittedBorder: (theme: Theme) => {
    const borderColor = theme.palette.grey[100];
    return {
      borderRight: "1px solid " + borderColor
    };
  },
};

type Props = {
  editor: Editor;
  className?: string;
  toolbar?: IEditorToolbar[];
};

const Toolbar = ({
  editor,
  className,
  toolbar = defaultEditorToolbar
}: Props) => {
  const [openLinkDialog, setOpen] = useState<boolean>(false);

  const toggleLinkDialog = useCallback(() => setOpen(!openLinkDialog), [openLinkDialog]);

  const [openYoutubeDialog, setOpenYoutubeDialog] = useState<boolean>(false);

  const toggleYoutubeDialog = useCallback(() => setOpenYoutubeDialog(!openYoutubeDialog), [openYoutubeDialog]);

  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);
  const [headingAnchorEl, setHeadingAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleOpenTableMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setTableAnchorEl(event.currentTarget);
  }, []);

  const handleCloseTableMenu = () => {
    setTableAnchorEl(null);
  };

  const handleOpenHeadingMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setHeadingAnchorEl(event.currentTarget);
  }, []);
  
  const handleCloseHeadingMenu = () => {
    setHeadingAnchorEl(null);
  };

  const menus = useMemo(() => [
    {
      name: "heading",
      icon: Title,
      onClick: handleOpenHeadingMenu,
      isActive:
        editor.isActive("heading", { level: 1 }) ||
        editor.isActive("heading", { level: 2 }) ||
        editor.isActive("heading", { level: 3 }) ||
        editor.isActive("heading", { level: 4 }) ||
        editor.isActive("heading", { level: 5 }) ||
        editor.isActive("heading", { level: 6 }),
      disabled: false,
      split: true
    },
    {
      name: "bold",
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run()
    },
    {
      name: "italic",
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run()
    },
    {
      name: "strike",
      icon: Strike,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run()
    },
    {
      name: "underline",
      icon: Underline,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      disabled: !editor.can().chain().focus().toggleUnderline().run()
    },
    {
      name: "link",
      icon: Link,
      onClick: toggleLinkDialog,
      disabled: false,
      split: true
    },
    // order
    {
      name: "bulletList",
      icon: BulletList,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: !editor.can().chain().focus().toggleBulletList().run()
    },
    {
      name: "orderedList",
      icon: OrderedList,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
      split: true,
    },
    // alignment
    {
      name: "align-left",
      icon: AlignLeft,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      disabled: false,
      active: { textAlign: "left" },
      group: "align"
    },
    {
      name: "align-center",
      icon: AlignCenter,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      disabled: false,
      active: { textAlign: "center" },
      group: "align"
    },
    {
      name: "align-right",
      icon: AlignRight,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      disabled: false,
      active: { textAlign: "right" },
      group: "align"
    },
    {
      name: "align-justify",
      icon: AlignJustify,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      disabled: false,
      active: { textAlign: "justify" },
      split: true,
      group: "align"
    },
    {
      name: "blockquote",
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: false
    },
    {
      name: "codeBlock",
      icon: Code,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      disabled: false,
      split: true
    },
    {
      name: "table",
      icon: Table,
      onClick: (event: MouseEvent<HTMLElement>) => {
        handleOpenTableMenu(event);
      },
      disabled: false,
      split: true
    },
    {
      name: "youtube",
      icon: Youtube,
      onClick: toggleYoutubeDialog,
      disabled: false,
      split: true
    },
    {
      name: "undo",
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      default: true // always display
    },
    {
      name: "redo",
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      default: true, // always display
      split: true
    }
  ], [editor, toggleLinkDialog, toggleYoutubeDialog, handleOpenTableMenu, handleOpenHeadingMenu]);

  return (
    <div className={cx(className, 'flexRow')} css={classes.menu}>
      {/* other options */}
      {menus.map((menu, index) => (
        showTextEditorToolbarMenu(toolbar, menu) && (
          <IconButton
            key={menu.name + index}
            onClick={menu.onClick}
            disabled={menu.disabled}
            css={classes.button(
              // the order is important
              editor.isActive(menu.isActive || menu.active || menu.name),
              !!menu.split
            )}
          >
            {/* <img alt={menu.name} src={`/icons/${menu.icon || menu.name}.svg`} /> */}
            <menu.icon />
          </IconButton>
        )
      ))}

      {/* youtube dialog */}
      {showTextEditorToolbarMenu(toolbar, "link") && (
        <LinkDialog
          editor={editor}
          open={openLinkDialog}
          onClose={toggleLinkDialog}
        />
      )}

      {/* youtube dialog */}
      {showTextEditorToolbarMenu(toolbar, "youtube") && (
        <YoutubeDialog
          editor={editor}
          open={openYoutubeDialog}
          onClose={toggleYoutubeDialog}
        />
      )}

      {/* color picker */}
      {showTextEditorToolbarMenu(toolbar, "color") && (
        <ColorPicker editor={editor} />
      )}

      {/* table menu to be opened */}
      {showTextEditorToolbarMenu(toolbar, "table") && (
        <TableMenuDialog
          editor={editor}
          anchorEl={tableAnchorEl}
          onClose={handleCloseTableMenu}
        />
      )}

      {/* table menu to be opened */}
      {showTextEditorToolbarMenu(toolbar, "table") && (
        <HeadingMenu
          editor={editor}
          anchorEl={headingAnchorEl}
          onClose={handleCloseHeadingMenu}
        />
      )}
      </div>
  );
};

export default Toolbar;
