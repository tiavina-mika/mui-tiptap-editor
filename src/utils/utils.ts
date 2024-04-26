import { ReactNode } from 'react';

import { escapeRegExp } from 'lodash';
import { FieldErrors } from 'react-hook-form';

import { EnvironmentEnum, IPagination, IQueriesInput, ISelectOption } from '@/types/app.type';

import { APP_NAME, CURRENCY, PERSISTED_STATE_KEY, SERVER_URL } from './constants';
import { boPalette, websitePalette } from './theme.utils';

const isCleanedString = (string: string | Record<string, any> | number): boolean => {
  return !!(!string || typeof string !== 'string' || (string && string.trim().length === 0));
};

export const capitalizeFirstLetter = (string: string): string => {
  if (isCleanedString(string)) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const lowerFirstLetter = (string: string): string => {
  if (isCleanedString(string)) return '';
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
};

export const parseDeepJSON = (json: string): Record<string, any> => {
  const object = JSON.parse(json);
  const transformedObject: Record<string, any> = {};
  for (const key of Object.keys(object)) {
    if (typeof object[key] !== 'object') {
      const nestedObject = JSON.parse(object[key]);
      transformedObject[key] = nestedObject;
    } else {
      transformedObject[key] = object[key];
    }
  }
  return transformedObject;
};

export const generateToken = (n = 22): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

/**
 * add currency to price
 * @param price
 * @returns
 */
export const formatPriceWithCurrency = (price = 0): string => {
  const text = price + ' ' + CURRENCY;
  return text;
};

/**
 * store data to the local storage
 * @param key key of the storage
 * @param value value to store
 */
export const setLocalStorage = (key: string, value: Record<string, any>): void => {
  try {
    if (!key || !value) {
      throw new Error('Missing key and data params');
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('setLocalStorage error:', e);
  }
};

/**
 * get the stored data to the local storage
 * @param key key of the storage
 */
export const getLocalStorage = (key: string): any => {
  try {
    if (!key) {
      throw new Error('Missing key params');
    }
    const value = localStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('getLocalStorage error:', e);
  }
};

/**
 * remove stored value to the local storage
 * @param key key of the storage
 */
export const removeLocalStorage = (key: string = PERSISTED_STATE_KEY): void => {
  try {
    if (!key) {
      throw new Error('Missing key params');
    }
    localStorage.removeItem(key);
  } catch (e) {
    console.error('deleteLocalStorage error:', e);
  }
};

export const isDev = (): boolean => process.env.ENVIRONMENT === EnvironmentEnum.DEV;

/**
 * get the server url
 * we need it to connect to the parse server or an server side api (ex: via axios)
 * NOTE: this function should be called after defining the window.LOCAL, window.PREPROD, window.PROD first
 * @returns
 */
export const getServerUrl = (): string => {
  if ((window as any).LOCAL) {
    const SERVER_PORT = 8088;
    const { location } = window;

    return location.protocol + '//' + location.hostname + ':' + SERVER_PORT;
  }

  if ((window as any).PREPROD) {
    return SERVER_URL.preprod;
  }

  return SERVER_URL.prod;
};

/**
 * head html balise title
 * @param {string} title
 * @returns {string}
 */
export const formatPageTitle = (title: string): string => {
  const appName = capitalizeFirstLetter(APP_NAME);

  if (title) {
    return title + ' - ' + appName;
  }

  return appName;
};

/**
 * @param object
 * @param {array|Set} names
 * @returns {*}
 */
 
export const filter = (object: Record<string, any>, names: Record<string, any>): Record<string, any> => {
  return Object.keys(object)
    .filter(key => (names.has ? names.has(key) : names.includes(key)))
    .reduce((obj, key) => {
      (obj as any)[key] = object[key];
      return obj;
    }, {});
};

/**
 * check if it's null ( 0, '', null, undefined, {}, [] )
 * @param item
 * @returns {boolean}
 */
export const isNull = (item: string): boolean => {
  // NOTE : typeof null = 'object', typeof undefined = 'undefined'
  // see Loose Equality Comparisons With == at ( https://www.sitepoint.com/javascript-truthy-falsy )
  const typeOfValue = typeof item;
  switch (typeOfValue) {
    case 'string':
      return item.trim() === '';
    case 'object':
      return Object.is(item, null) || Object.values(item).every(val => isNull(val));
    case 'number':
      return !item;
    default:
      return item == null;
  }
};

export const cutText = (text: string, limit = 100): string => {
  if (text.length > limit) {
    return `${text.substring(0, limit)}...`;
  }

  return text;
};

export const BOOLEAN_LIKES = ['true', 1, 'false', 0, '0', '1'];

export const isBoolean = (value: any): any => {
  return typeof value === 'boolean';
};

export const isString = (value: any): any => {
  return typeof value === 'string';
};

export const isStringOrNumber = (value: string | number | ReactNode): any => {
  return isString(value) || typeof value === 'number';
};

/**
 * change 'true' or 'false' to true or false
 * or 0 or 1 to false or true
 * @param value 0, 1, 'true', or 'false'
 * @returns
 */
export const booleanLikeToBoolean = (value: string | number): boolean => {
  if (['true', 1, '1'].includes(value)) {
    return true;
  }

  if (['false', 0, '0'].includes(value)) {
    return false;
  }

  return !!value;
};

/**
 * transform js object to url query string
 * ex: { name: 'john'} to ?name=john
 * @param object
 * @param begin
 * @returns
 */
export const objectToRouteSearchParams = (object?: Record<string, any>, begin = true): string => {
  let string = '';

  // return an empty string if there is no query params
  if (!object) {
    return string;
  }

  if (begin) {
    string += '?';
  }

  string += Object.keys(object)
    .map(key => key + '=' + object[key])
    .join('&');
  return string;
};

/**
 * tranform url search params to JS object
 * ex: ?seen=true => { seen: true }
 * @param searchParams
 * @returns
 */
export const routeSearchParamsToObject = (searchParams: Record<string, any>): Record<string, any> => {
  const object: Record<string, any> = {};
  for (const entry of searchParams.entries()) {
    const [param, value] = entry;

    if (BOOLEAN_LIKES.includes(value)) {
      (object as any)[param] = booleanLikeToBoolean(value);
    } else {
      (object as any)[param] = value;
    }
  }

  return object;
};

// text to search
export const escapeText = (text: string): any => new RegExp(escapeRegExp(text as string), 'ig');

export const pagePaginationToQueryInput = (pagination: IPagination): IQueriesInput => {
  const values: Record<string, any> = { ...pagination, limit: pagination.rowsPerPage, skip: pagination.currentPage };
  delete values.rowsPerPage;
  delete values.currentPage;

  return values as IQueriesInput;
};

/**
 * get errors for tabs (lang)
 * "title+fr": {
        "message": "Title required",
        "type": "too_small",
        "ref": {}
  }
 * to 
 * ['fr']
 */
export const getTranslatedFormTabErrors = (errors: FieldErrors, translatedFields: string[]): string[] => {
  const locales: string[] = [];
  for (const key of Object.keys(errors)) {
    const splittedKey = key.split('+');
    const field = splittedKey[0];

    // only for translated fields
    if (translatedFields.includes(field)) {
      const lang = splittedKey[splittedKey.length - 1];

      if (!locales.includes(lang)) {
        locales.push(lang);
      }
    }
  }

  return locales;
};

export const getMUIColorsList = (): string[] => {
  const newColors: string[] = [];
  [...Object.values(websitePalette), ...Object.values(boPalette)].forEach(
    (color: Record<string | number, string> | string): void => {
      newColors.push(...Object.values(color));
    },
  );

  return newColors;
};

/**
 * for ulr name
 * my Site => my-site
 * @param {*} text
 * @param {*} separator
 * @returns
 */
export const slugify = (text: string, separator = '-'): string => {
  text = text.trim();
  text = text.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  return text
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text
    .replace(/-/g, separator);
};

export const getOptionsByList = (items: string[]): ISelectOption[] => {
  return items.map(
    (item: string): ISelectOption<string> => ({
      value: item,
      label: item,
    }),
  );
};
