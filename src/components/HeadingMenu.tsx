import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade } from "@mui/material";
import { Level } from "@tiptap/extension-heading";
import { ITextEditorOption } from "../type";

type IOption = ITextEditorOption<Level>;

const options: IOption[] = [
  {
    value: 1,
    label: "Heading 1"
  },
  {
    value: 2,
    label: "Heading 2"
  },
  {
    value: 3,
    label: "Heading 2"
  },
  {
    value: 4,
    label: "Heading 3"
  },
  {
    value: 5,
    label: "Heading 5"
  },
  {
    value: 6,
    label: "Heading 6"
  }
];

type Props = {
  editor: Editor;
  anchorEl: null | HTMLElement;
  onClose: () => void;
};
const HeadingMenu = ({ editor, anchorEl, onClose }: Props) => {
  const handleSelectHeading = (heading: Level) => {
    editor.chain().focus().toggleHeading({ level: heading }).run();
    onClose();
  };

  return (
    <Menu
      id="select-heading-menu"
      MenuListProps={{
        "aria-labelledby": "select-heading-button"
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      TransitionComponent={Fade}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          onClick={() => handleSelectHeading(option.value)}
          css={{
            backgroundColor: editor.isActive("heading", { level: option.value })
              ? "gray"
              : "transparent",
            fontSize: (10 - index) * 3
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default HeadingMenu;
