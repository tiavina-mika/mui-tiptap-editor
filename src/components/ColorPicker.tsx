import { useTheme } from "@mui/material";
import { Editor } from "@tiptap/react";

import { ChangeEvent, useEffect, useState } from "react";

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
    position: 'absolute' as const,
    bottom: 10,
    transform: 'translate(-20%, 0px)',
    height: 3,
    width: 14,
    backgroundColor: color,
    borderRadius: 3,
  })
};
type Props = {
  editor: Editor;
  id: string;
};
const ColorPicker = ({ editor, id }: Props) => {
  const [color, setColor] = useState<string>("");

  const theme = useTheme();

  // add default styles if not defined
  useEffect(() => {
    // get current color from editor instance
    const currentColor = editor.getAttributes("textStyle").color;
    // set default color based on theme
    const defaultColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
    setColor(currentColor || defaultColor);
  }, [editor, theme.palette.mode])

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // set color in editor instance
    editor.chain().focus().setColor(value).run();
    setColor(value);
  };

  return (
    <>
      <input
        id={id}
        type="color"
        onInput={handleInput}
        value={color}
        // Use width and height to hide the color picker instead of display: none
        // Otherwise browser will place the picker in the corner (out of the Visual DOM tree)
        css={{ width: 0, height: 0 }}
      />
      {/*
        * The `colorPreview` div displays the selected color as a small rectangle below the color picker.
        * see Toolbar component for the implementation of icon
      */}
      <div css={classes.colorPreview(color)} />
    </>
  );
};

export default ColorPicker;
