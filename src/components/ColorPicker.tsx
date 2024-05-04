import { IconButton, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";

import { ChangeEvent, useEffect, useState } from "react";
import Icon from "@/icons/Icon";
import TextColor from "@/icons/TextColor";

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

  useEffect(() => {
    const currentColor = editor.getAttributes("textStyle").color;
    setColor(currentColor || '#000000');
  }, [editor])

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    editor.chain().focus().setColor(value).run();
    setColor(value);
  };

  return (
    <div className="flexRow center stretchSelf">
      <label htmlFor="color-picker" className="flexCenter">
          <Icon size={28}>
            <Tooltip title="Text color">
              <IconButton className="flexCenter" css={{ borderRadius: 2 }}>
                <TextColor />
                <div css={classes.colorPreview(color)} />
              </IconButton>
            </Tooltip>
          </Icon>
      </label>
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
