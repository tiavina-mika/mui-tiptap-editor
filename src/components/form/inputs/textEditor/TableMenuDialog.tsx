import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade } from "@mui/material";
import i18n from "@/config/i18n";

type IOption = {
  label: string;
  action: () => void;
};
const getTableMenus = (editor: Editor): IOption[] => [
  {
    label: i18n.t("cms:table.insertTable"),
    action: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
  },
  {
    label: i18n.t("cms:table.addColumnBefore"),
    action: () => editor.chain().focus().addColumnBefore().run()
  },
  {
    label: i18n.t("cms:table.addColumnAfter"),
    action: () => editor.chain().focus().addColumnAfter().run()
  },
  {
    label: i18n.t("cms:table.deleteColumn"),
    action: () => editor.chain().focus().deleteColumn().run()
  },
  {
    label: i18n.t("cms:table.addRowBefore"),
    action: () => editor.chain().focus().addRowBefore().run()
  },
  {
    label: i18n.t("cms:table.addRowAfter"),
    action: () => editor.chain().focus().addRowAfter().run()
  },
  {
    label: i18n.t("cms:table.deleteRow"),
    action: () => editor.chain().focus().deleteRow().run()
  },
  {
    label: i18n.t("cms:table.deleteTable"),
    action: () => editor.chain().focus().deleteTable().run()
  },
  {
    label: i18n.t("cms:table.mergeCells"),
    action: () => editor.chain().focus().mergeCells().run()
  },
  {
    label: i18n.t("cms:table.toggleHeaderColumn"),
    action: () => editor.chain().focus().toggleHeaderColumn().run()
  },
  {
    label: i18n.t("cms:table.toggleHeaderRow"),
    action: () => editor.chain().focus().toggleHeaderRow().run()
  },
  {
    label: i18n.t("cms:table.toggleHeaderCell"),
    action: () => editor.chain().focus().toggleHeaderCell().run()
  },
  {
    label: i18n.t("cms:table.mergeOrSplit"),
    action: () => editor.chain().focus().mergeOrSplit().run()
  },
  {
    label: i18n.t("cms:table.setCellAttribute"),
    action: () => editor.chain().focus().setCellAttribute("colspan", 2).run()
  }
];

type Props = {
  editor: Editor;
  anchorEl: null | HTMLElement;
  onClose: () => void;
};
const TableMenuDialog = ({ editor, anchorEl, onClose }: Props) => {
  const handleClick = (menu: IOption) => {
    menu.action();
    onClose();
  };

  return (
    <Menu
      id="select-table-menu"
      MenuListProps={{
        "aria-labelledby": "select-table-button"
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      TransitionComponent={Fade}
    >
      {getTableMenus(editor).map((menu, index) => (
        <MenuItem value={index} key={index} onClick={() => handleClick(menu)}>
          {menu.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default TableMenuDialog;
