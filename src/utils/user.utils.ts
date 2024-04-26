import Parse from 'parse';
import i18n from '@/config/i18n';

import { ISelectOption } from '@/types/app.type';
import { Phone, Sex, SexEnum, IUser, PlatformEnum } from '@/types/user.type';

import { cutText } from './utils';
import { defaultTabOptions } from './app.utils';

// options for user platform
export const userPlatformOptions: ISelectOption[] = [
  {
    label: 'IOS',
    value: 'ios',
  },
  {
    label: 'Android',
    value: 'android',
  },
  {
    label: 'Macos',
    value: 'macos',
  },
  {
    label: 'Windows',
    value: 'windows',
  },
  {
    label: 'Web',
    value: 'web',
  },
  {
    label: 'Back office',
    value: 'bo',
  },
];

// options for select input
export const sexOptions: ISelectOption[] = [
  {
    label: i18n.t('user:male'),
    value: SexEnum.MALE,
  },
  {
    label: i18n.t('user:female'),
    value: SexEnum.FEMALE,
  },
];

// options for select input
export const onlineOptions: ISelectOption<boolean>[] = [
  {
    label: i18n.t('user:online'),
    value: true,
  },
  {
    label: i18n.t('user:offline'),
    value: false,
  },
];

// options for select input
export const accountVerificationOptions: ISelectOption<boolean>[] = [
  {
    label: i18n.t('user:verified'),
    value: true,
  },
  {
    label: i18n.t('user:unverified'),
    value: false,
  },
];

export const getSexLabelByValue = (sex: Sex): string => {
  const sexOption = sexOptions.find((option: ISelectOption) => option.value === sex);

  if (!sexOption) return '';

  return sexOption?.label;
};

/**
 * validate phone number (from Madagascar)
 * @param str
 * @returns
 */
export const validatePhoneNumber = (str: string): boolean => {
  /**
   * valid number are
   * 0341865749, 341865749, 034 18 657 49, 034-18-657-49, 0321865749, 0331865749, 0381865749
   */
  const phoneRegex = /^0?(32|33|34|38)[- ]?(\d{2})[- ]?(\d{3})[- ]?(\d{2})$/; // malagasy phone number

  if (str.match(phoneRegex)) {
    return true;
  }

  return false;
};

/**
 * replace first 0, white space, first +0 and - from phone number
 * @param str
 * @returns
 */
export const formatPhoneNumber = (str: string): string => {
  return str.replace(/^0|\s+|-|^\+0?/g, '');
};

/**
 * get user full name
 * @param person
 * @returns
 */
export const getUserFullName = (person: Record<string, any>): string => {
  if (!person) return '';
  let name = person.lastName;
  if (person.firstName) {
    name += ' ' + person.firstName;
  }
  return name;
};

/**
 * get full name abbreviation
 * ex: Tiavina Michael to TM
 * @param person
 * @returns
 */
export const getUserFullNameAbbreviation = (person: Record<string, any>): string => {
  if (!person.lastName && !person.firstName) {
    return 'US';
  }
  let abbreviatedName = person.lastName.charAt(0);
  if (person.firstName) {
    abbreviatedName += person.firstName.charAt(0);
  }
  return abbreviatedName.toUpperCase();
};

// ---------------------------------------------------------//
// ---- fixing bug for await Parse.User.currentAsync() ---- //
// ---------------------------------------------------------//
/**
 * await Parse.User.currentAsync() save an user as bad ParseUser into localStorage
 * see https://github.com/parse-community/Parse-SDK-JS/issues/992
 */
const currentUserPath = 'Parse/ento/currentUser';

/**
 * get currentUser from LocalStorage
 * @returns {Parse.Object}
 */
export const retrieveUserFromLocalStorage = (): Record<string, any> | null => {
  const userIntoLocalStorage = localStorage.getItem(currentUserPath);
  if (!userIntoLocalStorage) return null;
  const userData = JSON.parse(userIntoLocalStorage);
  // see https://github.com/parse-community/Parse-SDK-JS/issues/992
  userData.className = '_User';
  return Parse.Object.fromJSON(userData);
};

/**
 * clear user into localStorage
 */
export const clearUserIntoLocalStorage = (): void => {
  localStorage.removeItem(currentUserPath);
};

/**
 * update currentUser into localStorage
 * @param user
 */
export const updateUserIntoLocalStorage = (user: IUser): void | null => {
  if (!user) return null;

  delete user.password;
  const userData = JSON.stringify(user);
  localStorage.setItem(currentUserPath, userData);
};

export const getCuttedFirstName = (user: IUser): string => {
  if (user.firstName) {
    const name = user.firstName.split(' ')[0];
    return cutText(name);
  }
  return cutText(user.lastName);
};

export const getFullPhoneNumber = (phone: Phone): string => {
  return '+' + phone.code + phone.number;
};

// user created from back office
export const isUserFromBO = (user: IUser): boolean => user.platform === PlatformEnum.BO;

export const usersTabOptions = [
  {
    label: i18n.t('common:news'),
    tab: i18n.t('common:route.new'),
    key: 'seen',
    value: false,
  },
  {
    label: i18n.t('user:administrators'),
    tab: i18n.t('common:route.administrators'),
    key: 'platform',
    value: PlatformEnum.BO,
    forAdmin: true
  },
  ...defaultTabOptions,
];
