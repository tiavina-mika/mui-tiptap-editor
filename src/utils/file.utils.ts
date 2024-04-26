import { http, protectRequest } from '@/config/http';

import { IFileCloud, IMultipleUploadResponse, IUploadFile, IUploadFileAPI, IUploadFilesAPI } from '@/types/file.type';
import { PAGE_SINGLE_IMAGE_FIELDS } from '@/validations/file.validation';

/**
 * get the original filename from the url
 * instead of define manually a new name
 */
const getFilenameFromContentDisposition = (res: Record<string, any>): string | null => {
  let filename = null;

  const disposition = res.headers.get('content-disposition');

  if (disposition?.includes('attachment')) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches?.[1]) {
      filename = matches[1].replace(/['"]/g, '');
      // Sometimes the filename comes in a URI encoded format so decode it
      filename = decodeURIComponent(filename);
      // Sometimes the filename starts with UTF-8, remove that
      filename = filename.replace(/^UTF-8/i, '').trim();
    }
  }

  return filename;
};

/**
 * transform a file url to input file
 */
export const getFileFromUrl = async (url: string): Promise<File> => {
  const fileRes = await fetch(url);
  const blob = await fileRes.blob();

  let fileName = getFilenameFromContentDisposition(fileRes);
  if (!fileName) {
    fileName = url.split('/').pop() as string;
  }

  const file = new File([blob], fileName, {
    type: blob.type,
  });

  return file;
};

/**
 * convert bytes to file sizes
 */
export const convertBytesToFileSize = (
  bytes: number,
  unit: 'mb' | 'kb' | 'gb' = 'mb',
  withUnit = false,
): number | string => {
  let size = 1;
  switch (unit) {
    case 'kb':
      size = 1;
      break;
    case 'mb':
      size = 2;
      break;
    case 'gb':
      size = 3;
      break;
    default:
      size = 2;
  }

  const transformedSize = bytes / (1024 ** size);
  const fixedSize = +transformedSize.toFixed(3);

  if (withUnit) {
    return fixedSize + unit;
  }
  return fixedSize;
};

export const extensionsToMimeType = (extensions: string[]): Record<string, any> => {
  const mimeTypes: Record<string, any> = {};
  extensions.forEach(extension => {
    mimeTypes['image/' + extension] = [];
  });

  return mimeTypes;
};

/**
 * convert kb, mb, gb to bytes
 */
export const convertFileSizeToBytes = (size: number, type = 'mb'): number => {
  const types = ['B', 'KB', 'MB', 'GB', 'TB'];

  const key = types.indexOf(type.toUpperCase());

  if (typeof key !== 'boolean') {
    return size * 1024 ** key;
  }

  return 0;
};

/**
 * check for file's max size limit to upload
 */
export const hasFilesMaxSize = (files: File[], maxSize: number): boolean => {
  const sizes = files.map((file: File): number => file.size);
  const hasMaxSize = sizes.some((size: number) => {
    const byte = convertFileSizeToBytes(maxSize);

    if (byte === 0) return false;
    return size > convertFileSizeToBytes(maxSize);
  });

  return hasMaxSize;
};

/**
 * check for accepted file's type to upload
 */
export const hasAcceptedFileTypes = (files: File[], acceptedTypes: string[]): boolean => {
  const types = files.map((file: File): string => file.type);
  const hasAcceptedFileTypes = types.some(
    (type: string) => !!acceptedTypes.find((acceptedType: string): boolean => type.includes(acceptedType)),
  );

  return hasAcceptedFileTypes;
};

/**
 * upload a single file
 * @param file input file
 * @param folder folder to save the files (in cloud)
 * @param userId id of the current user
 * @param sessionToken token of the current user
 * @param endpoint url of the endpoint
 * @returns
 */
export const uploadFileAPI = async ({
  file,
  folder,
  userId,
  sessionToken,
  endpoint = '/files',
}: IUploadFileAPI): Promise<IFileCloud> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  if (userId) {
    formData.append('userId', userId);
  }

  const response = await http.post<FormData, IFileCloud>(endpoint, formData, protectRequest(sessionToken, true));

  return response;
};

/**
 * upload multiple files
 * @param files list of input file
 * @param folder folder to save the files (in cloud)
 * @param userId id of the current user
 * @param sessionToken token of the current user
 * @param endpoint url of the endpoint
 * @returns
 */
export const uploadFilesAPI = async ({
  files,
  folder,
  userId,
  sessionToken,
  endpoint = '/files/multiple',
}: IUploadFilesAPI): Promise<IFileCloud[]> => {
  const formData = new FormData();

  files.forEach((file: File) => {
    formData.append('files', file);
  });

  formData.append('folder', folder);

  if (userId) {
    formData.append('userId', userId);
  }

  const response = await http.post<FormData, IMultipleUploadResponse>(
    endpoint,
    formData,
    protectRequest(sessionToken, true),
  );

  return response.uploadedFiles;
};

interface ISyncUploadFilesToDatabase {
  fields: string[];
  entity: Parse.Object;
  formValues: Record<string, any>;
  uploadInput: Omit<IUploadFile, 'endpoint'>;
}
/**
 * upload the new files to the api
 * add the new upload files url to database with the old ones
 * remove the unused old foles from the list
 * in the server, remove these removed files from the cloud
 * @param fields list of field name, ex: ['images']
 * @param entity parse entity, ex: Page
 * @param formValues values from form
 * @param uploadInput data to send to the upload api
 * @returns
 */
export const updateUploadedMultipleFilesToSave = async ({
  fields,
  entity,
  formValues,
  uploadInput,
}: ISyncUploadFilesToDatabase): Promise<Record<string, any>> => {
  const newValues: Record<string, any> = {};
  for (const field of fields) {
    const oldFieldValue = entity.get(field);
    // input values
    if (formValues[field] && Array.isArray(formValues[field])) {
      const inputFiles = formValues[field];
      const newInputFilesToUpload = [];
      const oldSavedFilesToKeep = [];
      for (const inputFile of inputFiles) {
        // get the input file name
        const inputFileName = inputFile.name.split('.')[0];
        // check if the file name exist in data base file list
        const oldSavedFileToKeep = oldFieldValue?.find((oldFile: IFileCloud) =>
          oldFile.publicId.includes(inputFileName),
        );

        if (oldSavedFileToKeep) {
          oldSavedFilesToKeep.push(oldSavedFileToKeep);
        } else {
          newInputFilesToUpload.push(inputFile);
        }
      }

      // upload the new files
      const fileUploadInput = { ...uploadInput, files: newInputFilesToUpload };
      const uploadedFilesUrls = await uploadFilesAPI(fileUploadInput);
      // will save the new files and the unremove old ones
      newValues[field] = [...uploadedFilesUrls, ...oldSavedFilesToKeep];
    }
  }

  return newValues;
};

export const updateUploadedSingleFileToSave = async ({
  fields,
  entity,
  formValues,
  uploadInput,
}: ISyncUploadFilesToDatabase): Promise<Record<string, any>> => {
  const newValues: Record<string, any> = {};
  for (const field of fields) {
    const oldFieldValue = entity.get(field);
    if (formValues[field]) {
      const fileName = formValues[field].name.split('.')[0];

      // new uploaded file
      if (!oldFieldValue?.publicId.includes(fileName)) {
        // if (!oldFieldValue || (oldFieldValue && !oldFieldValue.publicId.includes(fileName))) {

        const fileUploadInput = { ...uploadInput, file: formValues[field] };
        const uploadedFilesUrl = await uploadFileAPI(fileUploadInput);

        newValues[field] = uploadedFilesUrl;
      } else {
        newValues[field] = oldFieldValue;
      }
    }
  }

  return newValues;
};


/**
 * upload all single file and multiple files fields files
 * ex: bannerImage, previewImage, images, ...
 */
type UploadInput<T> = {
  folder: string;
  userId?: string;
  sessionToken: string;
  values: T;
  singleUploadFields?: string[];
  multipleUploadFields?: string[]
};

export const uploadFormFiles = async <T extends Record<string, any>>({
  folder,
  sessionToken,
  userId,
  values,
  singleUploadFields = PAGE_SINGLE_IMAGE_FIELDS,
  multipleUploadFields,
}: UploadInput<T>): Promise<Record<string, IFileCloud | IFileCloud[]>> => {
  const uploadInput = {
    folder,
    userId,
    sessionToken,
  };

  const newValues: Record<string, any> = {};

  // --------- single file fields --------- //
  for (const field of singleUploadFields) {
    if (values[field]) {
      const fileUploadInput = { ...uploadInput, file: values[field] };
      const uploadedFileUrl = await uploadFileAPI(fileUploadInput);

      newValues[field] = uploadedFileUrl;
    }
  }

  // --------- multiple files fields --------- //
  if (multipleUploadFields) {
    for (const field of multipleUploadFields) {
      if (values[field] && Array.isArray(values[field])) {
        const fileUploadInput = { ...uploadInput, files: values[field] };
        const uploadedFilesUrls = await uploadFilesAPI(fileUploadInput);
        newValues[field] = uploadedFilesUrls;
      }
    }
  }

  return newValues;
}

export const isUpdatedFileChanged = (prevField: IFileCloud, formField: Record<string, string>): boolean => {
  const fileName = formField.name.split('.')[0];
  const hasTheName = prevField?.publicId.includes(fileName);

  return hasTheName;
}
/**
 * upload all single file and multiple files fields files
 * ex: bannerImage, previewImage, images, ...
 */
type UpdatedUploadInput<T> = {
  page: Parse.Object;
} & UploadInput<T>;

export const uploadUpdatedFormFiles = async <T extends Record<string, any>>({
  page,
  folder,
  sessionToken,
  userId,
  values,
  singleUploadFields = PAGE_SINGLE_IMAGE_FIELDS,
  multipleUploadFields,
}: UpdatedUploadInput<T>): Promise<any> => {
  const uploadInput = {
    folder,
    userId,
    sessionToken,
  };

  const newValues: Record<string, any> = {};

  // --------- single file fields --------- //
  for (const field of singleUploadFields) {
    if (values[field]) {
      const oldFieldValue = page.get(field);
      const isNew = isUpdatedFileChanged(oldFieldValue, values[field]);

      // new uploaded file
      if (!isNew) {
        const fileUploadInput = { ...uploadInput, file: values[field] };
        const uploadedFilesUrl = await uploadFileAPI(fileUploadInput);

        newValues[field] = uploadedFilesUrl;
      } else {
        newValues[field] = oldFieldValue;
      }
    }
  }

  if (multipleUploadFields) {
    for (const field of multipleUploadFields) {
      const oldSavedFiles = page.get(field);
      // input values
      if (values[field] && Array.isArray(values[field])) {
        const inputFiles = values[field];
        const newInputFilesToUpload = [];
        const oldSavedFilesToKeep = [];
  
        for (const inputFile of inputFiles) {
          // get the input file name
          const inputFileName = inputFile.name.split('.')[0];
          // check if the file name exist in database file list
          const oldSavedFileToKeep = oldSavedFiles?.find((oldFile: IFileCloud) =>
            oldFile.publicId.includes(inputFileName),
          );
  
          if (oldSavedFileToKeep) {
            oldSavedFilesToKeep.push(oldSavedFileToKeep);
          } else {
            newInputFilesToUpload.push(inputFile);
          }
        }
  
        // upload the new files
        const fileUploadInput = { ...uploadInput, files: newInputFilesToUpload };
        const uploadedFilesUrls = await uploadFilesAPI(fileUploadInput);
        // will save the new files and the remove old ones
        newValues[field] = [...uploadedFilesUrls, ...oldSavedFilesToKeep];
      }
    }
  }

  return newValues;
}

