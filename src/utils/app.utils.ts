import i18n from '@/config/i18n';

import { closeMessageSlice, endLoadingSlice, getAppMessageSelector, setErrorSlice, startLoadingSlice } from '@/redux/reducers/app.reducer';
import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';
import { IEditorToolbar, IListTabValue, ISelectOption } from '@/types/app.type';

// options for select input
export const booleanOptions: ISelectOption<boolean>[] = [
  {
    label: i18n.t('common:yes'),
    value: true,
  },
  {
    label: i18n.t('common:no'),
    value: false,
  },
];

export const orderSelectOptions: ISelectOption[] = [
  {
    value: 'asc',
    label: i18n.t('common:ascending'),
  },
  {
    value: 'desc',
    label: i18n.t('common:descending'),
  },
];

/**
 * mainly a translated key from server
 * @param text 
 * @returns 
 */
const translatedError = (text: string): string => {
  const hasDot = text.includes(':');
  if (hasDot) {
    return i18n.t(text);
  }

  return text;
};

/**
 * wrapper for thunk, return a thunk
 * @param longPromiseCreatorOrPromise
 * @returns
 */
export const actionWithLoader = (
  longPromiseCreatorOrPromise: AppThunkAction,
  localLoadingAction?: (value: boolean) => any,
): AppThunkAction => {
  return async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.() as RootState;
    const message = getAppMessageSelector(state);
    // --------------- start loading --------------- //
    if (localLoadingAction) {
      dispatch(localLoadingAction(true));
    } else {
      dispatch(startLoadingSlice());
    }
    try {
      // --------------- dispatch action --------------- //
      await longPromiseCreatorOrPromise(dispatch, getState ?? undefined);
    } catch (error) {
      // clear success message first
      if (message) {
        dispatch(closeMessageSlice());
      }

      // display error message
      if (typeof error === 'string') {
        dispatch(setErrorSlice(translatedError(error)));
      } else if (error instanceof Error) {
        dispatch(setErrorSlice(translatedError((error as any).message)));
      }
    } finally {
      // --------------- end loading --------------- //
      if (localLoadingAction) {
        dispatch(localLoadingAction(false));
      } else {
        dispatch(endLoadingSlice());
      }
    }

    return Promise.resolve();
  };
};

/**
 * change tab name (search params) to database queries
 * ex: ?tab=new to { seen: false };
 * @param tab
 * @returns
 */
export const convertTabToFilters = (tabs: IListTabValue[], tabValue: IListTabValue['tab'], filters: any) => {
  const currentTab = tabs?.find((tab: IListTabValue): boolean => tab.tab === tabValue);

  const newFilters: Record<string, any> = { ...filters };

  if (currentTab) {
    newFilters[currentTab.key] = currentTab.value as any;
  }

  return newFilters;
}

/**
 * tab to always show
 */
export const defaultTabOptions = [
  {
    label: i18n.t('common:recycleBin'),
    tab: i18n.t('common:route.recycleBin'),
    key: 'deleted',
    value: true,
    forAdmin: true,
  },
];

/**
 * check if the url has search params ?tab=recycleBin
 * @param searchParamsTab 
 * @returns 
 */
export const isRecycleBinTab = (searchParamsTab: string): boolean => searchParamsTab === i18n.t('common:route.recycleBin');

export const defaultEditorToolbar: IEditorToolbar[] = [
  "heading",
  "bold",
  "italic",
  "strike",
  "link",
  "underline",
  "image",
  "code",
  "orderedList",
  "bulletList",
  "align",
  "codeBlock",
  "blockquote",
  "table",
  "history",
  "youtube",
  "color",
  "mention",
  "ai"
];


// menus to display
export const showTextEditorToolbarMenu = (toolbar: IEditorToolbar[], menu: any): boolean => {
  return !!toolbar?.find((t: IEditorToolbar) => {
    if (typeof menu === "string") {
      return t === menu;
    }
    if (menu.default) return true;
    // if group is defined, otherwise check the name
    return menu.group ? menu.group === t : menu.name === t;
  });
};
