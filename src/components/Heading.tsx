import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade, Typography, Theme, Button } from "@mui/material";
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
    fontWeight: 700,
    textTransform: 'capitalize' as const,
    // TODO: may be changed later
    border: isActive ? "0px solid gray !important" : "none !important",
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    cursor: 'pointer',
    '& .MuiTypography-root': {
      marginRight: 12
    },
    '&:hover': {
      backgroundColor: 'transparent !important'
    }
  }),
  menuItem: (isActive: boolean, fontSize: number) => (theme: Theme) => ({
    backgroundColor: isActive ? theme.palette.grey[100] : "transparent",
    fontSize
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
    editor.chain().focus().setParagraph().run();
    setSelected(0);
    handleClose();
  }

  return (
    <div>
      {/* button */}
      <Button
        type="button"
        onClick={handleOpenHeadingMenu}
        css={classes.button(isActive(editor))}
        className="flexRow center"
        variant="text"
        color="inherit"
      >
        <Typography>
          {options.find(option => option.value === selected)?.label || "Normal text"}
        </Typography>
        {/* chevron icon */}
        <Icon>
          <ChevronDown />
        </Icon>
      </Button>
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
            css={classes.menuItem(
              editor.isActive("heading", { level: option.value }), // isActive
              (10 - index) * 3 // fontSize
            )}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>

  );
};

export default Heading;
