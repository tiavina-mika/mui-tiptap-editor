import i18n, { locales } from '@/config/i18n';

import { IStoredData, Lang } from '@/types/setting.type';

import { ISelectOption } from '@/types/app.type';
import { DEFAULT_LANGUAGE, PERSISTED_STATE_KEY } from './constants';
import { getLocalStorage, parseDeepJSON, setLocalStorage } from './utils';

/**
 * get stored data from local storage and parse it (from json to js object)
 * @param key key to retrieve the value
 * @returns
 */
export const getStoredData = (key = PERSISTED_STATE_KEY): IStoredData | undefined => {
  const persistedLocale = getLocalStorage(key);
  if (!persistedLocale) return;
  const storedData = parseDeepJSON(persistedLocale) as IStoredData;
  return storedData;
};

/**
 * get the app language stored to the local storage
 * @returns
 */
export const getStoredLanguage = (): Lang | undefined => {
  const storedData = getStoredData();
  const language = storedData?.settings.lang;

  return language;
};

/**
 * store the app language to the local storage
 * @param lang
 */
export const setStoredLanguage = (lang: Lang): void => {
  const persistedLocale = getStoredData();
  const newData = {
    ...persistedLocale,
    settings: {
      ...persistedLocale?.settings,
      lang,
    },
  };

  setLocalStorage(PERSISTED_STATE_KEY, newData);
};

export const renderLanguageLabel = (lang: Lang): string => {
  switch (lang) {
    case 'mg':
      return i18n.t('lang.malagasy');
    case 'en':
      return i18n.t('lang.english');
    default:
      return i18n.t('lang.french');
  }
};

export const languagesOptions = locales.map(
  (lang: string): ISelectOption => ({
    label: renderLanguageLabel(lang as Lang),
    value: lang,
  }),
);

/**
 * get translated field value from database
 * ex: { translated: { fr: { title: 'xxx' }, en: { title: '' } } }
 * => { fr: { title: 'xxx' }}
 * @param entity 
 * @param language 
 * @param field 
 * @param withInfo 
 * @returns 
 */
export const getDefaultTranslatedField = (
  object: Record<string, any>,
  language: string,
  field: string,
  withInfo = true,
): string => {
  const { translated } = object;
  if (translated[language]?.[field]) {
    return translated[language][field];
  }

  const defaultFieldValue = translated[DEFAULT_LANGUAGE][field];

  if (withInfo) {
    return `${defaultFieldValue} (${i18n.t('common:errors.notTranslated')})`;
  }

  return defaultFieldValue;
};

export const getTranslatedField = <T extends Record<string, any>>(
  translated: T,
  language: string,
  field: string,
): string => {
  const value = translated[language]?.[field];

  if (!value) {
    const defaultFieldValue = translated[DEFAULT_LANGUAGE][field];
    return `${defaultFieldValue} (${i18n.t('common:errors.notTranslated')})`;
  }

  return translated[language]?.[field];
};
