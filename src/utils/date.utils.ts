import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

import i18n from '@/config/i18n';

import { Lang, Langs } from '@/types/setting.type';
import { DateType, ParseServerDate } from '@/types/util.type';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

/**
 * return date from parse server database date
 * parse an object to date
 * @param date
 * @returns
 */
export const parseServerDateToDate = (date: ParseServerDate): Date => dayjs(date.iso).toDate();

export const isBeforeCurrentDate = (date: DateType): boolean => dayjs().isBefore(dayjs(date));

/**
 * format date to display depending to current year
 * @param date
 * @returns
 */
export const formatDate = (date: DateType | ParseServerDate, onlyHour = false, isParseServerDate = false): string => {
  let newDate = date;
  // if the date is a object with iso field
  if (isParseServerDate) {
    newDate = parseServerDateToDate(date as ParseServerDate);
  }

  if (onlyHour) {
    return dayjs(newDate as DateType).format('hh:mm');
  }
  const currentYear = dayjs().year();
  const year = dayjs(newDate as DateType).year();
  let format;

  // other date than current year
  if (year !== currentYear) {
    format = 'DD MMM YYYY';
  } else {
    format = 'DD MMM à hh:mm';
  }

  return dayjs(newDate as DateType).format(format);
};

/**
 * get (translated) date from now format (ago)
 * @param date
 * @returns
 */
export const fromNow = (date: DateType, custom = false): any => {
  const dateNow = dayjs();
  const selectedDate = dayjs(date);
  const defaultFromNow = selectedDate.fromNow();
  const diff = dateNow.diff(selectedDate, 'hour');

  // different format if later than 24 hours
  if (diff > 24 && custom) {
    return formatDate(selectedDate);
  }
  return defaultFromNow;
};

/**
 * translate basic date worlds depending on language
 * for mg language, it is not available in dayjs locales, so I hack it with other language (de here)
 * @param lang
 */
export const translateDateLocale = (lang: Lang): void => {
  switch (lang) {
    case 'en':
      dayjs.updateLocale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: 'a few seconds',
          m: 'a minute',
          mm: '%d minutes',
          h: 'an hour',
          hh: '%d hours',
          d: 'a day',
          dd: '%d days',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years',
        },
        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        calendar: {
          lastDay: '[Yesterday at] LT',
          sameDay: '[Today at] LT',
          nextDay: '[Tomorrow at] LT',
          lastWeek: '[last] dddd [at] LT',
          nextWeek: 'dddd [at] LT',
          sameElse: 'L',
        },
      });
      break;
    case 'mg':
      dayjs.updateLocale('de', {
        relativeTime: {
          future: 'afaka %s',
          past: '%s lasa',
          s: 'segondra kely',
          m: 'iray minitra',
          mm: '%d minitra',
          h: 'ora iray',
          hh: '%d ora',
          d: 'iray andro',
          dd: '%d andro',
          M: 'iray volana',
          MM: '%d volana',
          y: 'iray taona',
          yy: '%d taona',
        },
        weekdaysShort: ['Alah', 'Alat', 'Tal', 'Alar', 'Alak', 'Zoma', 'Sab'],
        weekdays: ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jon', 'Jol', 'Aog', 'Sep', 'Okt', 'Nov', 'Des'],
        months: [
          'Janoary',
          'Febroary',
          'Martsa',
          'Aprily',
          'May',
          'Jona',
          'Jolay',
          'Aogositra',
          'Septambra',
          'Oktobra',
          'Novambra',
          'Desambra',
        ],
        calendar: {
          lastDay: '[Omaly t@] LT',
          sameDay: '[Androany t@] LT',
          nextDay: '[Rahampitso @] LT',
          lastWeek: '[farany teo] dddd [t@] LT',
          nextWeek: 'dddd [@] LT',
          sameElse: 'L',
        },
      });
      break;
    default:
      dayjs.updateLocale('fr', {
        relativeTime: {
          future: 'dans %s',
          past: 'il y a %s',
          s: 'quelques secondes',
          m: 'une minute',
          mm: '%d minutes',
          h: 'une heure',
          hh: '%d heures',
          d: 'un jour',
          dd: '%d jours',
          M: 'un mois',
          MM: '%d mois',
          y: 'un an',
          yy: '%d ans',
        },
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        monthsShort: ['Janv', 'Fevr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
        months: [
          'Janvier',
          'Fevrier',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juillet',
          'Aout',
          'Septembre',
          'Octobre',
          'Novembre',
          'Decembre',
        ],
        calendar: {
          lastDay: '[Hier à] LT',
          sameDay: "[Ajourd'hui à] LT",
          nextDay: '[Demain à] LT',
          lastWeek: '[dernier] dddd [à] LT',
          nextWeek: 'dddd [à] LT',
          sameElse: 'L',
        },
      });
      break;
  }
};

/**
 * get date format depending of the app language
 * @param lang app language
 * @returns
 */
export const getDateFormatByLang = (lang: Lang, withHour = false): string => {
  let dateFormat = 'DD/MM/YYYY';
  // english / american format
  if (lang === Langs.ENGLISH) {
    dateFormat = 'YYYY/MM/DD';
  }

  if (withHour) {
    dateFormat += i18n.t('common:at') + ' hh:mm';
  }

  // malagasy and french format
  return dateFormat;
};

/**
 * format hour unix (number) type to string
 * @param lang app language
 * @returns
 */
export const displayHour = (date: DateType, withHourLabel = true): string => {
  const format = withHourLabel ? 'HH[h]mm' : 'HH:mm';
  const formattedDate = dayjs(date as DateType).format(format);
  return formattedDate;
};

/**
 * add the selected date from the date picker to another input value
 * @param form react hook form form props
 * @param name name of the field
 * @param lang app language
 * @returns string
 */
export const formatDateInputToString = (form: Record<string, any>, name: string, lang: Lang): string => {
  const format = getDateFormatByLang(lang);
  // get all values of the form
  const values = form.getValues();
  // get the value of the current date field
  const value = values[name];
  const stringifiedDate = dayjs(value).format(format);
  return stringifiedDate;
};

export const formatTimeInputToString = (form: Record<string, any>, name: string): string => {
  const values = form.getValues();
  // get the value of the current date field
  const value = values[name];
  const stringifiedDate = dayjs(value).format('HH[h]mm');
  return stringifiedDate;
};

export const dateToUnix = (date: Date): number => {
  const unix = dayjs.utc(date).valueOf();
  return unix;
};

export const unixToDate = (unix: number): Date => {
  const day = dayjs.utc(unix).toDate();
  return day;
};

/**
 * display date with translated format
 * @param date
 * @param withHour show hour
 * @param isMonthsShort show 3 to 4 first month name
 * @returns
 */
export const displayDate = (date: DateType, withHour = true, isMonthsShort = false): string => {
  let format = withHour ? i18n.t('common:fullDateFormat') : i18n.t('common:dateOnlyFormat');

  const currentYear = dayjs().year();
  const year = dayjs(date).year();

  if (isMonthsShort) {
    // other date than current year
    if (year !== currentYear) {
      // display day and month only
      format = withHour ? i18n.t('common:monthsShortFormat') : i18n.t('common:monthsShortDateOnlyFormat');
    } else {
      // display day, month and year (other than current year)
      format = withHour
        ? i18n.t('common:monthsShortCurrentYearFormat')
        : i18n.t('common:monthsShortCurrentYearFormatOnlyFormat');
    }
  }

  const formattedDate = dayjs(date as DateType).format(format);

  return formattedDate;
};

/**
 * calculate age by birthday
 * @param date
 * @returns
 */
export const getAgeByBirthday = (date: DateType): number => {
  const dayjsDate = dayjs(date as DateType);
  const age = dayjs().diff(dayjsDate, 'year');
  return age;
};

export const toDayJsDate = (date?: Date): Date => {
  if (date) {
    return dayjs(date).toDate();
  }

  const now = dayjs().toDate();
  return now;
};

export const isPastDate = (date: DateType): boolean => dayjs().isBefore(dayjs(date));
export const isBeforeDate = (start: DateType, end: DateType): boolean => dayjs(end).isBefore(dayjs(start));
