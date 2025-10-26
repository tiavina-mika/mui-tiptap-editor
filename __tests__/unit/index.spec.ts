// import {describe, expect, test} from '@jest/globals';
import type { ImageAttributes } from '../../src/types/text-editor';

import {
  checkIsValidUrl, checkIsValidYoutubeUrl, filterValidImageAttributes, getFileSize,
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
