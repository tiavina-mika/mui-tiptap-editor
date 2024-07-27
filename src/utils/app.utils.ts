import { Theme } from "@mui/material";
import { IEditorToolbar } from "../types";

type FileValidationOutput = {
  isValid: boolean;
  message: string;
};

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
  "upload",
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

export const checkLegend = (text: string): boolean => {
  return checkAlt(text) && text.length <= 100;
}

const getFileSize = (file: File): number => {
  const size = (file.size / 1024) / 1024;
  return +size.toFixed(4);
}

/**
 * check if the file size is valid
 * below the maximum size
 * @param file
 * @param maxSize
 * @returns
 */
export const getIsFileSizeValid = (file: File, maxSize = 10): FileValidationOutput => {
  return {
    isValid: getFileSize(file) <= maxSize,
    message: `Files need to be less than ${maxSize}mb in size.`
  }
}

/**
 * check if the file is an image
 * by checking the file mime type
 * starts with "image/"
 * @param file
 * @returns
 */
export const checkIsImage = (file: File): FileValidationOutput => {
  return {
    isValid: file.type.startsWith("image/"),
    message: "Files need to be of type image."
  };
}

/**
 * check if the file mime type is valid
 * example: image/png, image/jpeg
 * @param file
 * @param allowedMimeTypes
 * @returns
 */
export const checkValidMimeType = (file: File, allowedMimeTypes: string[] | null): FileValidationOutput => {
  if (!allowedMimeTypes) {
    return {
      isValid: true,
      message: ""
    };
  }

  return {
    isValid: allowedMimeTypes.includes(file.type),
    message: `Files need to be of type ${allowedMimeTypes.join(", ")}.`
  };
}

/**
 * check if the number of files is lower than the maximum number required
 * @param files
 * @param maxFilesNumber
 * @returns
 */
export const checkFilesNumber = (files: FileList, maxFilesNumber = 5): FileValidationOutput => {
  return {
    isValid: files.length <= maxFilesNumber,
    message: `You can only upload ${maxFilesNumber} files at once.`
  };
}
