import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade } from "@mui/material";
import { ILabels } from "../types";

type IOption = {
  label: string;
  action: () => void;
};
const getTableMenus = (editor: Editor, labels?: ILabels['table']): IOption[] => [
  {
    label: labels?.insertTable || "Insert table",
    action: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
  },
  {
    label: labels?.addColumnBefore || "Add column before",
    action: () => editor.chain().focus().addColumnBefore().run()
  },
  {
    label: labels?.addColumnAfter || "Add column after",
    action: () => editor.chain().focus().addColumnAfter().run()
  },
  {
    label: labels?.deleteColumn || "Delete Column",
    action: () => editor.chain().focus().deleteColumn().run()
  },
  {
    label: labels?.addRowBefore || "Add row before",
    action: () => editor.chain().focus().addRowBefore().run()
  },
  {
    label: labels?.addRowAfter || "Add row after",
    action: () => editor.chain().focus().addRowAfter().run()
  },
  {
    label: labels?.deleteRow || "Delete row",
    action: () => editor.chain().focus().deleteRow().run()
  },
  {
    label: labels?.deleteTable || "Delete table",
    action: () => editor.chain().focus().deleteTable().run()
  },
  {
    label: labels?.mergeCells || "Merge cells",
    action: () => editor.chain().focus().mergeCells().run()
  },
  {
    label: labels?.toggleHeaderColumn || "Toggle header column",
    action: () => editor.chain().focus().toggleHeaderColumn().run()
  },
  {
    label: labels?.toggleHeaderRow || "Toggle header row",
    action: () => editor.chain().focus().toggleHeaderRow().run()
  },
  {
    label: labels?.toggleHeaderCell || "Toggle header cell",
    action: () => editor.chain().focus().toggleHeaderCell().run()
  },
  {
    label: labels?.mergeOrSplit || "Merge or split",
    action: () => editor.chain().focus().mergeOrSplit().run()
  },
  {
    label: labels?.setCellAttribute || "Set cell attribute",
    action: () => editor.chain().focus().setCellAttribute("colspan", 2).run()
  }
];

type Props = {
  editor: Editor;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  labels?: ILabels["table"];
};
const TableMenuDialog = ({ editor, anchorEl, onClose, labels }: Props) => {
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
      {getTableMenus(editor, labels).map((menu, index) => (
        <MenuItem value={index} key={index} onClick={() => handleClick(menu)}>
          {menu.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default TableMenuDialog;
