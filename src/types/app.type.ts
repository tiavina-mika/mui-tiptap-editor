import { z } from "zod";
import { MouseEvent, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IUser } from "./user.type";
import { autoCompleteOptionSchema, confirmDeletionSchema, settingsSchema, tabAndCategoryRouteSearchParams } from "@/validations/app.validations";
import { Store } from "@/redux/store";
import { DateType } from "./util.type";

export type ISettingsInput = z.infer<typeof settingsSchema>;
export type ConfirmDeletionInput = z.infer<typeof confirmDeletionSchema>;
export type ITabAndCategorySearchParams = z.infer<typeof tabAndCategoryRouteSearchParams>;
export type IAutocompleteOption = z.infer<typeof autoCompleteOptionSchema>;
export interface ISelectOption<T = string> {
  label: string;
  value: T,
  icon?: string | ReactNode;
  hide?: boolean;
}

// export interface IAutocompleteOption<T extends object> extends Omit<ISelectOption<T>, 'hide'> {}

type AppSnackBar = {
  open: boolean;
  type: string;
  message: string;
  duration: number;
};

export type ISeverity = 'success' | 'info' | 'warning' | 'error' | '';
export interface IAlert {
  severity: ISeverity;
  type?: 'accountVerification' | 'resetPassword'; // add another type later
  message?: string;
  title?: string;
  duration?: 'permanent' | 'temporary';
}
export interface IAppState {
  loading: boolean;
  error: string;
  message: string;
  infoMessage: string;
  appSnackBar: AppSnackBar;
  currentUser?: IUser | null;
  accountEmail?: string;
  pageTitle: string;
  notifications: Record<string, number>;
  alert: IAlert | null;
}

export enum EnvironmentEnum {
  DEV = 'DEV',
  PROD = 'PROD',
}

export type OrderType = 'desc' | 'asc';
export interface IOrderList {
  orderBy: string;
  order: OrderType;
}

export type IFilterInput = {
  filters: Record<string, any>;
  search: Record<string, any>;
};

export interface IQueriesInput extends Partial<IFilterInput> {
  limit?: number;
  skip?: number;
  orderBy?: string;
  order?: string;
  select?: string[];
  include?: string[];
}

export interface TableHeadCell<D> {
  disablePadding?: boolean;
  id: D;
  label: string;
  numeric?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface IPagination extends IOrderList {
  selected?: any[];
  currentPage: number;
  rowsPerPage: number;
}

// image returned by the upload ap
export interface IDefaultPagination extends Omit<IPagination, 'currentPage'> {
  rowsPerPageOptions?: number[];
}

export type IIdParams = {
  id: string;
};

export type IRouteContext = {
  store: Store | null;
}


export interface ICardRadio<T = string> extends ISelectOption<T> {
  readonly icon?: any;
  readonly description?: string;
}

export type INavigate = ReturnType<typeof useNavigate>;

export interface INotificationMenu {
  objectId: string;
  user?: IUser;
  title: string;
  description: string;
  date: DateType;
  onClick?: () => void; // mainly id
}

export interface IApiError {
  error: string;
  details: {
    // mainly a translated key
    // @see: middlewars/validation.middleware in the server
    message: string;
    key: string;
  }[];
}

export type IRenderSearchProps = {
  onSearch: (name: string, value: string) => void;
  onAdvancedSearch: (values: Record<string, any>) => void;
}

export interface IMenu<TOnClick = MouseEvent<HTMLElement>> {
  label: string;
  icon?: ReactNode;
  onClick: (value: TOnClick) => void;
  display?: boolean;
}

export interface ITabSearchParams<T = string> {
  tab: T;
}

/**
 * ex: { key: 'active', value: true, label: 'Active', tab: 'active' }
 * => ?tab=active => { active: true }
 */
export interface IListTabValue<T = string | boolean> {
  key: string; // key in database
  value: T; // value in database
  label: string; // label to display (translated)
  tab: string; // tab search param (translated)
  forAdmin?: boolean;
}

export interface IAdvancedSearchOption {
  label: string;
  name: string;
  checked: boolean;
  component: ReactNode;
}

export interface ISEOFields {
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
}

export enum EditorToolbarEnum {
  heading = 'heading',
  bold = 'bold',
  italic = 'italic',
  strike = 'strike',
  link = 'link',
  underline = 'underline',
  image = 'image',
  code = 'code',
  orderedList = 'orderedList',
  bulletList = 'bulletList',
  align = 'align',
  codeBlock = 'codeBlock',
  blockquote = 'blockquote',
  table = 'table',
  history = 'history',
  youtube = 'youtube',
  color = 'color',
  mention = 'mention',
  ai = 'ai'
}

export type IEditorToolbar = `${EditorToolbarEnum}`;
