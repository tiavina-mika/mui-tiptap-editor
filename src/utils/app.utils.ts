import { Theme } from "@mui/material";
import { IEditorToolbar } from "../types";

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
  // "ai"
];

export const getBorderColor = (theme: Theme) => {
  return theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800];
}

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

/**
 * The function `checkIsValidUrl` in TypeScript checks if a given URL string starts with "http://",
 * "https://", "mailto:", or "tel:".
 * @param {string} url - The `checkIsValidUrl` function takes a URL string as input and checks if it
 * starts with either "http://", "https://", "mailto:", or "tel:". If it starts with any of these
 * prefixes, the function returns `true`, indicating that the URL is valid. Otherwise, it
 * @returns A boolean value is being returned, indicating whether the input URL is valid based on the
 * specified conditions.
 */
export const checkIsValidUrl = (url: string): boolean => {
  return (
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  )
}

export const checkIsValidYoutubeUrl = (url: string): boolean => {
  return (
    url.startsWith("https://") &&
    url.includes("youtube")
  );
}

export const checkAlt = (text: string): boolean => {
  return (
    text.length > 0 &&
    typeof text === "string"
  );
}
