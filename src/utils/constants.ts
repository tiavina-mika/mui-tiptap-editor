import { IDefaultPagination, IPagination } from '@/types/app.type';
import { Lang } from '@/types/setting.type';

export const LAYOUT_CONTENT_PADDING = 24;
export const FORCE_DEBUG = false; // show console.log for important data
export const FORCE_DELETE_STORED_DATA = false; // force to delete local stored data
export const SPACING = 16;
export const SPACING_X = 30;
export const SPACING_Y = 16;
export const DEFAULT_LANGUAGE: Lang = 'fr';
export const PERSISTED_STATE_KEY = 'persist:root';
export const CURRENCY = 'Ar';

export const SIGNUP_TOTAL_STEP = 3;
export const APP_NAME = 'ento.io';
export const SERVER_URL = {
  preprod: 'https://ento.io.herokuapp.com',
  prod: 'https://ento.io.herokuapp.com',
};

export const PREVIEW_PAGE_GRID = {
  left: { xs: 12, md: 8, lg: 9 },
  right: { xs: 12, md: 4, lg: 3 },
  spacing: 2,
};

export const NOTIFICATIONS_COUNT = 10;

export const IMAGES = {
  whiteIconLogo: '/images/icon-logo-white.svg',
  blackIconLogo: '/images/icon-logo-black.svg',
  whiteLogo: '/images/logo-white.svg',
  defaultLogo: '/images/logo.svg',
};

export const COLORS = {
  authBackground: "#000",
  authTextFieldPlaceholder: '#fff',
};

export const HIGHEST_LEVEL_DEFAULT_ROLES = ['Owner', 'Administrator'];
export const DEFAULT_ROLES = ['Manager'];
export const SHOW_NOTIFICATIONS_APP_BAR = false;

export const ROLE_DEFAULT_LIMIT = 10;
export const RELATION_OPTIONS_LIMIT = 200;

const DEFAULT_LIMIT = 20;

export const PAGINATION: IDefaultPagination = {
  selected: [],
  rowsPerPage: DEFAULT_LIMIT,
  rowsPerPageOptions: [DEFAULT_LIMIT, 50, 75],
  orderBy: 'updatedAt',
  order: 'desc',
};

export const DEFAULT_PAGINATION: IPagination = {
  currentPage: 0,
  rowsPerPage: PAGINATION.rowsPerPage,
  orderBy: PAGINATION.orderBy,
  order: PAGINATION.order,
};

export const DEFAULT_QUERIES_INPUT = {
  limit: PAGINATION.rowsPerPage,
  skip: 0,
  orderBy: 'updatedAt',
  order: 'desc',
};

export const DISABLE_USER_ACCOUNT_CONFIRMATION = false;
export const RESPONSIVE_BREAKPOINT = 'lg';
export const SIDEBAR_WIDTH = 266;
export const TOOLBAR_SMALL_SCREEN_HEIGHT = 56;
export const VERIFICATION_CODE_LENGTH = 6;
/**
 * change this to your ipv4 ip address if you are using LAN network for example
 * NOTE: this should be the same as the server hostname
 */
export const LOCAL_NETWORK_HOSTNAME = '192.168.88.10';
// export const LOCAL_NETWORK_HOSTNAME = 'localhost';

export const SERVER_CUSTOM_ERROR_CODES = {
  invoiceAlreadyExists: '1000',
}