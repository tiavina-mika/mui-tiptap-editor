import { Tooltip, useTheme } from "@mui/material";
import { Editor } from "@tiptap/react";

import { ChangeEvent, useEffect, useState } from "react";
import Icon from "../icons/Icon";
import TextColor from "../icons/TextColor";

const classes = {
  color: {
    WebkitAppearance: "none" as const,
    MozAppearance: "none" as const,
    appearance: "none" as const,
    width: 28,
    height: 28,
    visibility: "hidden" as const,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    "&::-webkit-color-swatch": {
      borderRadius: 4,
      border: "none"
    },
    "&::-moz-color-swatch": {
      borderRadius: 4,
      border: "none"
    }
  },
  colorPreview: (color: string) => ({
    height: 3,
    width: 18,
    backgroundColor: color,
    marginTop: -8,
    borderRadius: 3,
  })
};
type Props = {
  editor: Editor;
};
const ColorPicker = ({ editor }: Props) => {
  const [color, setColor] = useState<string>("");

  const theme = useTheme();

  // add default styles if not defined
  useEffect(() => {
    const currentColor = editor.getAttributes("textStyle").color;
    const defaultColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
    setColor(currentColor || defaultColor);
  }, [editor, theme.palette.mode])

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    editor.chain().focus().setColor(value).run();
    setColor(value);
  };

  return (
    <div className="flexRow center stretchSelf">
      {/* tooltip */}
      <Tooltip title="Text color">
        <label htmlFor="color-picker" className="flexCenter">
          <Icon size={28} css={{ cursor: 'pointer' }}>
            <TextColor />
            <div css={classes.colorPreview(color)} />
          </Icon>
        </label>
      </Tooltip>

      {/* input */}
      <input
        id="color-picker"
        type="color"
        onInput={handleInput}
        value={color}
        css={classes.color}
      />
    </div>
  );
};

export default ColorPicker;
