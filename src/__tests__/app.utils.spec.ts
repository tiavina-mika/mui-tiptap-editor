// import {describe, expect, test} from '@jest/globals';
import { checkIsValidUrl, checkIsValidYoutubeUrl } from '../utils/app.utils';

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
