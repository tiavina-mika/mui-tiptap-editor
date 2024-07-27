import { Editor } from "@tiptap/react";
import { Menu, MenuItem, Fade, Theme, Button } from "@mui/material";
import { Level } from "@tiptap/extension-heading";
import { MouseEvent, useMemo, useState } from "react";
import ChevronDown from "../icons/ChevronDown";
import Icon from "../icons/Icon";
import { ILabels } from "../types";
import { getBorderColor } from "../utils/app.utils";

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

const options: Level[] = [1, 2, 3, 4, 5, 6];

const classes = {
  heading: (split: boolean) => (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    alignSelf: "stretch",
    borderRight: split ? `1px solid ${getBorderColor(theme)}` : "none",
  }),
  button: (isActive: boolean) => (theme: Theme) => ({
    backgroundColor: "transparent",
    fontWeight: 500,
    paddingLeft: 8,
    paddingRight: 8,
    textTransform: 'capitalize' as const,
    // TODO: may be changed later
    border: isActive ? "0px solid gray !important" : "none !important",
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    fontSize: 14,
    lineHeight: 1,
    cursor: 'pointer',
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
  headingLabels?: ILabels["headings"];
  split?: boolean;
};
const Heading = ({ editor, headingLabels, split = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState(0);

  // get label for selected heading
  const selectedLabel = useMemo(() => {
    const heading = options.find(option => option === selected);

    if (heading) {
      if (headingLabels && headingLabels[`h${heading}`]) {
        return headingLabels[`h${heading}`];
      }
      return `Heading ${heading}`;
    }

    if (headingLabels && headingLabels.normalText) {
      return headingLabels.normalText;
    }
    return 'Normal text';
  }, [selected, headingLabels]);

  const handleOpenHeadingMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

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
    <span css={classes.heading(split)}>
      {/* button */}
      <Button
        type="button"
        onClick={handleOpenHeadingMenu}
        css={classes.button(isActive(editor))}
        className="flexRow center"
        variant="text"
        color="inherit"
      >
        <span css={{ marginRight: 8 }}>
          {selectedLabel}
        </span>
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
        {/* normal text option */}
        <MenuItem onClick={handleSelectNormalText}>
          {headingLabels?.normalText || "Normal text"}
        </MenuItem>
        {/* heading options */}
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSelectHeading(option)}
            css={classes.menuItem(
              editor.isActive("heading", { level: option }), // isActive
              (10 - index) * 3 // fontSize is decreasing
            )}
          >
            {/* override labels or default ones */}
            {headingLabels?.[`h${option}`] || `Heading ${option}`}
          </MenuItem>
        ))}
      </Menu>
    </span>

  );
};

export default Heading;
