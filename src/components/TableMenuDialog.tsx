import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade } from "@mui/material";

type IOption = {
  label: string;
  action: () => void;
};
const getTableMenus = (editor: Editor): IOption[] => [
  {
    label: "Insert table",
    action: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
  },
  {
    label: "Add column before",
    action: () => editor.chain().focus().addColumnBefore().run()
  },
  {
    label: "Add column after",
    action: () => editor.chain().focus().addColumnAfter().run()
  },
  {
    label: "Delete Column",
    action: () => editor.chain().focus().deleteColumn().run()
  },
  {
    label: "Add row before",
    action: () => editor.chain().focus().addRowBefore().run()
  },
  {
    label: "Add row after",
    action: () => editor.chain().focus().addRowAfter().run()
  },
  {
    label: "Delete row",
    action: () => editor.chain().focus().deleteRow().run()
  },
  {
    label: "Delete table",
    action: () => editor.chain().focus().deleteTable().run()
  },
  {
    label: "Merge cells",
    action: () => editor.chain().focus().mergeCells().run()
  },
  {
    label: "Toggle header column",
    action: () => editor.chain().focus().toggleHeaderColumn().run()
  },
  {
    label: "Toggle header row",
    action: () => editor.chain().focus().toggleHeaderRow().run()
  },
  {
    label: "Toggle header cell",
    action: () => editor.chain().focus().toggleHeaderCell().run()
  },
  {
    label: "Merge or split",
    action: () => editor.chain().focus().mergeOrSplit().run()
  },
  {
    label: "Set cell attribute",
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
