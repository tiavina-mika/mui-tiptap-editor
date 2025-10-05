'use client';

import { Editor } from '@tiptap/react';

import type { ChangeEvent } from 'react';

type Props = {
  editor: Editor;
  id: string;
};
const ColorPicker = ({ editor, id }: Props) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // set color in editor instance
    editor.chain().focus().setColor(value).run();
  };

  return (
    <>
      <input
        css={{ width: 0, height: 0 }}
        id={id}
        type="color"
        value={editor.getAttributes('textStyle').color || '#000000'}
        /*
         * Use width and height to hide the color picker instead of display: none
         * Otherwise browser will place the picker in the corner (out of the Visual DOM tree)
         */
        onChange={handleInput}
      />
      {/*
        * The `colorPreview` div displays the selected color as a small rectangle below the color picker.
        * see Toolbar component for the implementation of icon
      */}
      <div
        css={{
          position: 'absolute' as const,
          bottom: 10,
          transform: 'translate(-20%, 0px)',
          height: 3,
          width: 14,
          backgroundColor: editor.getAttributes('textStyle').color || '#000000',
          borderRadius: 3,
        }}
      />
    </>
  );
};

export default ColorPicker;
