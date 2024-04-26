import Parse, { Attributes } from "parse";
import { filter, isNull } from "./utils";

/**
 * initialize parse server
 * depending in the environment, it will use the local server or the remote server
 */
export const initParse = () => {
  Parse.initialize(import.meta.env.VITE_PARSE_APP_ID);

  const { origin } = window.location;
  
  const LOCAL = origin.includes('localhost') || origin.includes('127.0.0.1');
  const PREPROD = origin.includes('preprod');
  const PROD = !LOCAL && !PREPROD;
  
  (window as any).LOCAL = LOCAL;
  (window as any).PREPROD = PREPROD;
  (window as any).PROD = PROD;
  
  const parseServerURL = LOCAL ? 'http://localhost:8088/parse' : `${origin}/parse`;
  
  Parse.serverURL = parseServerURL;
}

export const setValue = (parseObject: Attributes, name: string, value: any): void => {
  const oldValue = parseObject.get(name);
  if (isNull(value)) {
    parseObject.unset(name);
  } else if (oldValue !== value) {
    parseObject.set(name, value);
  }
};

/**
 * . null or undefined values aren't set
 * . a value is set only when it's different
 * @param parseObject
 * @param values
 * @param {Array|Set} names (optional), ensures we only set the right properties
 */
export const setValues = (parseObject: Attributes, values: Record<string, any>, names: Record<string, any>): void => {
  if (names) {
    values = filter(values, names);
  }
  for (const key in values) {
    /* eslint-disable-next-line no-prototype-builtins */
    if (!values.hasOwnProperty(key)) {
      /* eslint-disable-next-line no-continue */
      continue;
    }
    const value = values[key];
    setValue(parseObject, key, value);
  }
};

export const convertIdToPointer = (className: string, id: string): Parse.Object => new Parse.Object(className, { objectId: id });
export const convertIdsToPointer = (className: string,ids: string[]): Parse.Object[] => {
  return ids.map((id: string) => convertIdToPointer(className, id));
};
