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
 * get the image size by creating a new image element
 * from the file object and returning the width and height
 * @param file
 * @returns
 */
const getImageSize = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
  });
}

// ------------------------------------------------ //
// ------------- validation functions ------------- //
// ------------------------------------------------ //

/**
 * The function `checkIsValidUrl` in TypeScript checks if a given URL string starts with "http://",
 * "https://", "mailto:", or "tel:".
 * @param {string} url
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

/**
 * check if the alt text is valid
 * @param text
 * @returns
 */
export const checkAlt = (text: string): FileValidationOutput => {
  return {
    isValid: text.length > 0 && typeof text === 'string',
    message: "Alt text is required."
  };
}

/**
 * check if the legend text is valid
 * @param text
 * @param maxLength
 * @returns
 */
export const checkLegend = (text: string, maxLength: number): FileValidationOutput => {
  return {
    isValid: checkAlt(text) && text.length <= maxLength,
    message: `Legend is required and be less than ${maxLength} characters.`
  };
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

export const checkValidFileDimensions = async (file: File, maxWidth = 1920, maxHeight = 1080): Promise<FileValidationOutput> => {
  const size = await getImageSize(file);
  return {
    isValid: size.width <= maxWidth && size.height <= maxHeight,
    message: `Image dimensions should be less than ${maxWidth}x${maxHeight}.`
  };
}
