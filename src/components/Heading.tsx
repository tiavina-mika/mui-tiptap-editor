import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade, Typography, Theme } from "@mui/material";
import { Level } from "@tiptap/extension-heading";
import { ITextEditorOption } from "../type";
import { MouseEvent, useState } from "react";
import ChevronDown from "../icons/ChevronDown";
import Icon from "../icons/Icon";

const isActive = (editor: Editor) => {
  return (
    editor.isActive("heading", { level: 1 }) ||
    editor.isActive("heading", { level: 2 }) ||
    editor.isActive("heading", { level: 3 }) ||
    editor.isActive("heading", { level: 4 }) ||
    editor.isActive("heading", { level: 5 }) ||
    editor.isActive("heading", { level: 6 })
  );
}

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

const classes = {
  button: (isActive: boolean) => (theme: Theme) => ({
    backgroundColor: "transparent",
    // TODO: may be changed later
    border: isActive ? "0px solid gray" : "none",
    borderRight: `1px solid ${theme.palette.grey[100]}`,
    cursor: 'pointer',
    '& .MuiTypography-root': {
      marginRight: 12
    }
  })
}
type Props = {
  editor: Editor;
};
const Heading = ({ editor }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selected, setSelected] = useState(0);

  const handleOpenHeadingMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectHeading = (heading: Level) => {
    editor.chain().focus().toggleHeading({ level: heading }).run();
    setSelected(heading);
    handleClose();
  };

  const handleSelectNormalText = () => {
    editor.chain().focus().setParagraph();
    setSelected(0);
    handleClose();
  }

  return (
    <div>
      {/* button */}
      <button
        type="button"
        onClick={handleOpenHeadingMenu}
        css={classes.button(isActive(editor))}
        className="flexRow center"
      >
        <Typography>
          {options.find(option => option.value === selected)?.label || "Normal text"}
        </Typography>
        {/* chevron icon */}
        <Icon>
          <ChevronDown />
        </Icon>
      </button>
      {/* menu */}
      <Menu
        id="select-heading-menu"
        MenuListProps={{
          "aria-labelledby": "select-heading-button"
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleSelectNormalText}>
          Normal text
        </MenuItem>
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
    </div>

  );
};

export default Heading;
