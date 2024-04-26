import Parse from 'parse';
import i18n from '@/config/i18n';

import { IRights, IRightsItem, IRole } from '@/types/role.type';

import { HIGHEST_LEVEL_DEFAULT_ROLES } from './constants';

export const defaultRights: IRights = {
  create: false,
  find: false,
  get: false,
  update: false,
  delete: false,
};

export const ENTITIES_WITH_RIGHTS_OPTIONS: Omit<IRightsItem, 'rights'>[] = [
  {
    label: i18n.t('user:users'),
    className: '_User', // database collection name
  },
  {
    label: i18n.t('user:role.roles'),
    className: '_Role',
  },
  {
    label: i18n.t('page:articles'),
    className: 'Article',
  },
  {
    label: i18n.t('common:estimates.estimates'),
    className: 'Estimate',
  },
  {
    label: i18n.t('common:invoices.invoices'),
    className: 'Invoice',
  },
  {
    label: i18n.t('cms:articles'),
    className: 'Article',
  },
  {
    label: i18n.t('cms:pages'),
    className: 'Page',
  },
  {
    label: i18n.t('cms:categories'),
    className: 'Category',
  },
];

/**
 * get list of users by roles
 * @param {Array<String>} roleNames
 * @returns {Promise.<Parse.User>}
 */
export const getUsersIdsFromRoles = async (roleNames = HIGHEST_LEVEL_DEFAULT_ROLES): Promise<string[]> => {
  const userIds: string[] = [];
  await new Parse.Query(Parse.Role).containedIn('name', roleNames).each(async role => {
    await role
      .getUsers()
      .query()
      .each((userRelation: any): any => userIds.push(userRelation.id));
  });

  return userIds;
};

/**
 * get roles of selected user
 * @param {ParseObject} user
 * @returns {Promise<IRole>}
 */
export const getRolesForUser = async (user?: Record<string, any> | null, toJson = true, all = false): Promise<any> => {
  let parseUser: any = user;

  // current user by default
  if (!user) {
    parseUser = await Parse.User.currentAsync();
  }

  // if json
  if (user && !user.className) {
    parseUser = await new Parse.Query(Parse.User).equalTo('objectId', user.objectId).first();
  }

  const query = new Parse.Query(Parse.Role)
    .equalTo('users', parseUser);

  if (!all) {
    query.notEqualTo('name', HIGHEST_LEVEL_DEFAULT_ROLES[0]);
  }

  const roles = await query.find();
  return toJson ? roles.map(role => role.toJSON()) : roles;
};

export const isAdmin = async (): Promise<boolean> => {
  const hasRole = await Parse.Cloud.run('hasRole', { roleNames: HIGHEST_LEVEL_DEFAULT_ROLES });
  return hasRole;
}

/**
 * action based on roles and rights
 * @param roles
 * @param className
 * @param action {find, get, update, delete}
 * @returns
 */
export const canAccessTo = (roles: IRole[], className: string | undefined, action = 'find'): boolean => {
  // high level roles can access to all
  const highestRoles = roles.filter((role: IRole) => HIGHEST_LEVEL_DEFAULT_ROLES.includes(role.name));

  if (highestRoles.length) {
    return true;
  }

  if (!className) {
    return true;
  }

  const roleHasRight = roles.find((role: IRole) => {
    const right = role.rights.find((right: IRightsItem) => {
      const isCurrentClassName = right.className === className;
      return isCurrentClassName && (right as any).rights[action];
    });
    return right;
  });

  return !!roleHasRight;
};
