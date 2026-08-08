// import {describe, expect, test} from '@jest/globals';
import type { ImageAttributes } from '../../src/types/text-editor';
import type { IEditorToolbar } from '../../src/types/toolbar';

import {
  checkAlt,
  checkFilesNumber,
  checkIfValidHttpUrl,
  checkIsImage,
  checkIsValidUrl,
  checkIsValidYoutubeUrl,
  checkLegend,
  checkValidMimeType,
  filterValidImageAttributes,
  getFileSize,
  getIsFileSizeValid,
  showTextEditorToolbarMenu,
  validateUploadedFile,
} from '../../src/utils/app.utils';

describe('check valid url', () => {
  test('https url', () => {
    expect(checkIsValidUrl('https://my-website.com')).toBe(true);
  });

  test('email url', () => {
    expect(checkIsValidUrl('mailto:my-email.com')).toBe(true);
  });

  test('tel url', () => {
    expect(checkIsValidUrl('tel:0340000000')).toBe(true);
  });

  test('should return only valid image attributes', () => {
    const attrs: ImageAttributes = {
      src: 'image.png',
      alt: 'description',
      title: 'title',
      width: 100,
      height: 200,
      style: 'border:1px solid red;',
      foo: 'bar',
      bar: 123,
    } as any;

    const result = filterValidImageAttributes(attrs);

    expect(result).toEqual({
      src: 'image.png',
      alt: 'description',
      title: 'title',
      width: 100,
      height: 200,
      style: 'border:1px solid red;',
    });
    expect((result as any).foo).toBeUndefined();
    expect((result as any).bar).toBeUndefined();
  });
});

describe('check invalid url', () => {
  test('insecure url', () => {
    expect(checkIsValidUrl('http://my-website.com')).toBe(false);
  });

  test('not an url', () => {
    expect(checkIsValidUrl('my-website.com')).toBe(false);
  });
});

describe('check youtube url', () => {
  test('insecure youtube url', () => {
    expect(checkIsValidYoutubeUrl('http://youtube.com')).toBe(false);
  });

  test('not a youtube url', () => {
    expect(checkIsValidYoutubeUrl('https://my-website.com')).toBe(false);
  });
});

describe('check file size conversion', () => {
  test('should return the file size in MB with 4 decimals', () => {
    // Simulate a File object
    const file = { size: 1048576 } as File; // 1 Mo

    expect(getFileSize(file)).toBe(1.0);

    const file2 = { size: 512000 } as File; // 0.4883 Mo

    expect(getFileSize(file2)).toBeCloseTo(0.4883, 4);
  });
});

describe('checkIfValidHttpUrl', () => {
  test('valid https url', () => {
    expect(checkIfValidHttpUrl('https://my-website.com')).toBe(true);
  });

  test('invalid http url', () => {
    expect(checkIfValidHttpUrl('http://my-website.com')).toBe(false);
  });

  test('not an url', () => {
    expect(checkIfValidHttpUrl('my-website.com')).toBe(false);
  });
});

describe('showTextEditorToolbarMenu', () => {
  const toolbar: IEditorToolbar[] = ['bold', 'italic', 'history'];

  test('returns true when the string menu name is in the toolbar', () => {
    expect(showTextEditorToolbarMenu(toolbar, 'bold')).toBe(true);
  });

  test('returns false when the string menu name is not in the toolbar', () => {
    expect(showTextEditorToolbarMenu(toolbar, 'table')).toBe(false);
  });

  test('returns true when the menu object is marked as default', () => {
    expect(showTextEditorToolbarMenu(toolbar, { default: true })).toBe(true);
  });

  test('returns true when the menu object group matches a toolbar entry', () => {
    expect(showTextEditorToolbarMenu(toolbar, { group: 'history' })).toBe(true);
  });

  test('returns true when the menu object name matches a toolbar entry', () => {
    expect(showTextEditorToolbarMenu(toolbar, { name: 'italic' })).toBe(true);
  });

  test('returns false when the menu object name does not match any toolbar entry', () => {
    expect(showTextEditorToolbarMenu(toolbar, { name: 'table' })).toBe(false);
  });
});

describe('checkAlt', () => {
  test('valid alt text', () => {
    expect(checkAlt('a description').isValid).toBe(true);
  });

  test('empty alt text is invalid', () => {
    expect(checkAlt('').isValid).toBe(false);
  });
});

describe('checkLegend', () => {
  test('valid legend within the max length', () => {
    expect(checkLegend('a caption', 20).isValid).toBe(true);
  });

  test('empty legend is invalid', () => {
    expect(checkLegend('', 20).isValid).toBe(false);
  });
});

describe('getIsFileSizeValid', () => {
  test('file below the default max size (10mb) is valid', () => {
    const file = { size: 1048576 } as File; // 1 Mo

    expect(getIsFileSizeValid(file).isValid).toBe(true);
  });

  test('file above a custom max size is invalid', () => {
    const file = { size: 5 * 1024 * 1024 } as File; // 5 Mo

    expect(getIsFileSizeValid(file, 2).isValid).toBe(false);
  });
});

describe('checkIsImage', () => {
  test('image mime type is valid', () => {
    const file = { type: 'image/png' } as File;

    expect(checkIsImage(file).isValid).toBe(true);
  });

  test('non-image mime type is invalid', () => {
    const file = { type: 'application/pdf' } as File;

    expect(checkIsImage(file).isValid).toBe(false);
  });
});

describe('checkValidMimeType', () => {
  test('any mime type is valid when allowedMimeTypes is null', () => {
    const file = { type: 'image/png' } as File;

    expect(checkValidMimeType(file, null).isValid).toBe(true);
  });

  test('mime type included in the allowed list is valid', () => {
    const file = { type: 'image/png' } as File;

    expect(checkValidMimeType(file, ['image/png', 'image/jpeg']).isValid).toBe(true);
  });

  test('mime type not included in the allowed list is invalid', () => {
    const file = { type: 'image/gif' } as File;

    expect(checkValidMimeType(file, ['image/png', 'image/jpeg']).isValid).toBe(false);
  });
});

describe('checkFilesNumber', () => {
  test('number of files below the default max (5) is valid', () => {
    expect(checkFilesNumber([{} as File, {} as File]).isValid).toBe(true);
  });

  test('number of files above a custom max is invalid', () => {
    expect(checkFilesNumber([{} as File, {} as File, {} as File], 2).isValid).toBe(false);
  });
});

describe('validateUploadedFile', () => {
  const file = {} as File;
  const attrs: ImageAttributes = { src: 'placeholder.png' };
  const alertMock = jest.fn();

  /*
   * the source module reads `window.alert`, which only exists in a browser/jsdom
   * environment — stub it on the Node global object so that branch can run under Jest
   */
  beforeAll(() => {
    (global as any).window = { alert: alertMock };
  });

  test('returns the original attributes when no uploadFile function is provided', async () => {
    const result = await validateUploadedFile({ file, attrs });

    expect(result).toEqual(attrs);
  });

  test('sets src from a string response when it is a valid https url', async () => {
    const uploadFile = jest.fn().mockResolvedValue('https://cdn.example.com/image.png');

    const result = await validateUploadedFile({ uploadFile, file, attrs });

    expect(result?.src).toBe('https://cdn.example.com/image.png');
  });

  test('merges an object response with the existing attributes', async () => {
    const uploadFile = jest.fn().mockResolvedValue({ src: 'https://cdn.example.com/image.png', alt: 'alt text' });

    const result = await validateUploadedFile({ uploadFile, file, attrs });

    expect(result).toEqual({ src: 'https://cdn.example.com/image.png', alt: 'alt text' });
  });

  test('returns undefined when the string response is not a valid https url', async () => {
    const uploadFile = jest.fn().mockResolvedValue('not-a-url');

    const result = await validateUploadedFile({ uploadFile, file, attrs });

    expect(result).toBeUndefined();
    expect(alertMock).toHaveBeenCalled();
  });
});
