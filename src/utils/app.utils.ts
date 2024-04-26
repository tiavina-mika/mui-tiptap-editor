import { IEditorToolbar } from '@/index';

export const defaultEditorToolbar: IEditorToolbar[] = [
  "heading",
  "bold",
  "italic",
  "strike",
  "link",
  "underline",
  "image",
  "code",
  "orderedList",
  "bulletList",
  "align",
  "codeBlock",
  "blockquote",
  "table",
  "history",
  "youtube",
  "color",
  "mention",
  "ai"
];


// menus to display
export const showTextEditorToolbarMenu = (toolbar: IEditorToolbar[], menu: any): boolean => {
  return !!toolbar?.find((t: IEditorToolbar) => {
    if (typeof menu === "string") {
      return t === menu;
    }
    if (menu.default) return true;
    // if group is defined, otherwise check the name
    return menu.group ? menu.group === t : menu.name === t;
  });
};
