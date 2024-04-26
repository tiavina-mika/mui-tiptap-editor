import i18n from "@/config/i18n";

export const PATH_NAMES = {
  home: '/',
  users: '/' + i18n.t('route:users'),
  articles: '/' + i18n.t('route:articles'),
  pages: '/' + i18n.t('route:pages'),
  categories: '/' + i18n.t('route:categories'),
  admins: '/' + i18n.t('route:admins'),
  login: '/' + i18n.t('route:login'),
  signUp: '/' + i18n.t('route:signup'),
  changePassword: '/' + i18n.t('route:users'),
  profile: '/' + i18n.t('route:profile'),
  roles: '/' + i18n.t('route:roles'),
  settings: '/' + i18n.t('route:settings'),
  logout: '/' + i18n.t('route:logout'),
  notFound: '/' + i18n.t('route:notFound'),
  account: {
    root: '/' + i18n.t('route:account'),
    confirmResetPasswordCode: '/' + i18n.t('route:confirmCode'),
    resetPassword: '/' + i18n.t('route:emailResetPassword'),
    verifyAccount: '/' + i18n.t('route:verifyAccount'),
  },
  estimates: '/' + i18n.t('route:estimates'),
  invoices: '/' + i18n.t('route:invoices'),

  // static pathnames (no '/' at the beginning)
  create: i18n.t('route:add'),
  edit: i18n.t('route:edit'),
  blocks: i18n.t('route:blocks'),
};