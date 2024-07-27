import { Theme } from "@emotion/react";
import { cx } from "@emotion/css";
import { IconButton, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import { useState, MouseEvent, useMemo, useCallback, Fragment } from "react";

import TableMenuDialog from "./TableMenuDialog";
import Heading from "./Heading";
import ColorPicker from "./ColorPicker";
import { IEditorToolbar, ILabels, TextEditorProps } from "../types.d";
import { checkIsValidUrl, defaultEditorToolbar, getBorderColor, showTextEditorToolbarMenu } from "../utils/app.utils";
import YoutubeDialog from "./YoutubeDialog";
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
import Mention from "../icons/Mention";
import Icon from "../icons/Icon";
import Picture from "../icons/Picture";
import TextColor from "../icons/TextColor";
import UploadFile from "./UploadFile";

const classes = {
  toolbar: (theme: Theme) => ({
    marginTop: -1,
    borderTop: '1px solid ' + getBorderColor(theme),
    paddingLeft: 8,
    paddingRight: 8,
  }),
  button: (isActive: boolean, split: boolean) => (theme: Theme) => {
    let backgroundColor = 'transparent';
    const isLightMode = theme.palette.mode === "light";
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
      border: "none",
      borderRight: split ? `1px solid ${getBorderColor(theme)}` : "none",
      cursor: "pointer",
      height: 24,
      width: 24,
      padding: 18,
      backgroundColor,
      "&.Mui-disabled": {
        opacity: 0.4
      }
    };
  },
  splittedBorder: (theme: Theme) => {
    return {
      borderRight: "1px solid " + getBorderColor(theme)
    };
  },
};

export type ToolbarProps = {
  editor: Editor;
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
};

const Toolbar = ({
  editor,
  className,
  labels,
  uploadFileOptions,
  toolbar = defaultEditorToolbar
}: ToolbarProps) => {
  const [openLinkDialog, setOpen] = useState<boolean>(false);

  const toggleLinkDialog = useCallback(() => setOpen(!openLinkDialog), [openLinkDialog]);

  const [openYoutubeDialog, setOpenYoutubeDialog] = useState<boolean>(false);

  const toggleYoutubeDialog = useCallback(() => setOpenYoutubeDialog(!openYoutubeDialog), [openYoutubeDialog]);

  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenTableMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setTableAnchorEl(event.currentTarget);
  }, []);

  const handleCloseTableMenu = () => {
    setTableAnchorEl(null);
  };

  // set link
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) return;

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    const isValidUrl = checkIsValidUrl(url);
    if (!isValidUrl) {
      window.alert(labels?.link?.invalid || 'Invalid URL');
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const menus = useMemo(() => {
    const toolbarLabels = labels?.toolbar;
    return [
      {
        name: "bold",
        icon: Bold,
        iconSize: 12,
        onClick: () => editor.chain().focus().toggleBold().run(),
        disabled: !editor.can().chain().focus().toggleBold().run(),
        tooltip: toolbarLabels?.bold || 'Bold'
      },
      {
        name: "italic",
        icon: Italic,
        iconSize: 12,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        disabled: !editor.can().chain().focus().toggleItalic().run(),
        tooltip: toolbarLabels?.italic || 'Italic'
      },
      {
        name: "strike",
        icon: Strike,
        iconSize: 14,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        disabled: !editor.can().chain().focus().toggleStrike().run(),
        tooltip: toolbarLabels?.strike || 'Strike through'
      },
      {
        name: "underline",
        iconSize: 14,
        icon: Underline,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        disabled: !editor.can().chain().focus().toggleUnderline().run(),
        tooltip: toolbarLabels?.underline || 'Underline',
        split: true,
      },
      // color use a label with htmlFor
      {
        name: "color",
        id: "color", // id for the label
        icon: TextColor,
        disabled: false,
        component: <ColorPicker editor={editor} id="color" />,
        tooltip: toolbarLabels?.color || 'Text color',
        split: true,
        iconSize: 24
      },
      // alignment
      {
        name: "align-left",
        icon: AlignLeft,
        onClick: () => editor.chain().focus().setTextAlign("left").run(),
        disabled: false,
        active: { textAlign: "left" },
        group: "align",
        tooltip: toolbarLabels?.alignLeft || 'Left align'
      },
      {
        name: "align-center",
        icon: AlignCenter,
        onClick: () => editor.chain().focus().setTextAlign("center").run(),
        disabled: false,
        active: { textAlign: "center" },
        group: "align",
        tooltip: toolbarLabels?.alignCenter || 'Center align'
      },
      {
        name: "align-right",
        icon: AlignRight,
        onClick: () => editor.chain().focus().setTextAlign("right").run(),
        disabled: false,
        active: { textAlign: "right" },
        group: "align",
        tooltip: toolbarLabels?.alignRight || 'Right align'
      },
      {
        name: "align-justify",
        icon: AlignJustify,
        onClick: () => editor.chain().focus().setTextAlign("justify").run(),
        disabled: false,
        active: { textAlign: "justify" },
        split: true,
        group: "align",
        tooltip: toolbarLabels?.alignJustify || 'Justify align'
      },
      // order
      {
        name: "bulletList",
        icon: BulletList,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        disabled: !editor.can().chain().focus().toggleBulletList().run(),
        tooltip: toolbarLabels?.bulletList || 'Bullet list'
      },
      {
        name: "orderedList",
        icon: OrderedList,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        disabled: !editor.can().chain().focus().toggleOrderedList().run(),
        split: true,
        tooltip: toolbarLabels?.orderedList || 'Ordered list',
        iconSize: 14
      },
      // link
      {
        name: "link",
        icon: Link,
        onClick: setLink,
        disabled: false,
        tooltip: toolbarLabels?.link || 'Link'
      },
      {
        name: "upload",
        id: "upload", // id for the label with htmlFor
        icon: Picture,
        disabled: false,
        component: <UploadFile editor={editor} id="upload" {...uploadFileOptions} />,
        tooltip: toolbarLabels?.upload || 'Upload image',
        iconSize: 16
      },
      {
        name: "mention",
        icon: Mention,
        onClick: () => editor.chain().focus().insertContent("@").run(),
        disabled: false,
        tooltip: toolbarLabels?.mention || 'Mention user',
        iconSize: 16
      },
      {
        name: "table",
        icon: Table,
        onClick: (event: MouseEvent<HTMLElement>) => {
          handleOpenTableMenu(event);
        },
        disabled: false,
        split: true,
        tooltip: labels?.table?.table || 'Table'
      },
      {
        name: "blockquote",
        icon: Quote,
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
        disabled: false,
        tooltip: toolbarLabels?.blockquote || 'Block quote',
        iconSize: 16
      },
      {
        name: "codeBlock",
        icon: Code,
        onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        disabled: false,
        split: true,
        tooltip: toolbarLabels?.codeBlock || 'Code block',
      },
      {
        name: "youtube",
        icon: Youtube,
        onClick: toggleYoutubeDialog,
        disabled: false,
        split: true,
        tooltip: toolbarLabels?.youtube || 'Youtube'
      },
      {
        name: "undo",
        icon: Undo,
        onClick: () => editor.chain().focus().undo().run(),
        disabled: !editor.can().undo(),
        default: true, // always display
        tooltip: toolbarLabels?.undo || 'Undo'
      },
      {
        name: "redo",
        icon: Redo,
        onClick: () => editor.chain().focus().redo().run(),
        disabled: !editor.can().redo(),
        default: true, // always display
        split: true,
        tooltip: toolbarLabels?.redo || 'Redo'
      }
    ]
  }, [
    editor,
    // for some unknown reason, the history is not being updated
    // so we need to force the update
    editor.can().undo,
    editor.can().redo,
    toggleLinkDialog,
    toggleYoutubeDialog,
    handleOpenTableMenu,
    labels
  ]);

  return (
    <div className={cx(className, 'flexRow center')} css={classes.toolbar}>
      {/* heading */}
      {showTextEditorToolbarMenu(toolbar, "heading") && <Heading editor={editor} headingLabels={labels?.headings} split />}

      {/* other options */}
      {menus.map((menu, index) => {
        if (!showTextEditorToolbarMenu(toolbar, menu)) return null;

        // if the menu has an id, we need to use a label (use htmlFor)
        const LabelComponent = menu.id ? 'label' : Fragment;
        // label props if the menu has an id
        const labelProps = menu.id ? { htmlFor: menu.id, css: { cursor: 'pointer' } } : {};
        return (
          <Fragment key={menu.name + index}>
            <Tooltip title={menu.tooltip}>
              {/* add span wrapper to avoid disabled child to the tooltip */}
              <span>
                <IconButton
                  onClick={menu.onClick}
                  disabled={menu.disabled}
                  css={classes.button(
                    editor.isActive(menu.active || menu.name), // the order is important
                    !!menu.split
                  )}
                >
                  <LabelComponent {...labelProps}>
                    <Icon size={menu.iconSize}>
                      <menu.icon />
                    </Icon>
                  </LabelComponent>
                  {/* component used with label */}
                  {menu.component}
                </IconButton>
              </span>
            </Tooltip>
          </Fragment>
        );
      })}

      {/* youtube dialog */}
      {showTextEditorToolbarMenu(toolbar, "youtube") && (
        <YoutubeDialog
          editor={editor}
          open={openYoutubeDialog}
          onClose={toggleYoutubeDialog}
          labels={labels?.youtube}
        />
      )}

      {/* table menu dialog */}
      {showTextEditorToolbarMenu(toolbar, "table") && (
        <TableMenuDialog
          editor={editor}
          anchorEl={tableAnchorEl}
          onClose={handleCloseTableMenu}
          labels={labels?.table}
        />
      )}
    </div>
  );
};

export default Toolbar;
