import { cloneDeep } from "lodash";
import i18n, { locales } from "@/config/i18n";
import { defaultTabOptions } from "./app.utils";
import { IArticle, IArticleInput } from "@/types/article.type";
import { PAGE_IMAGES_FIELDS, PAGE_SINGLE_IMAGE_FIELDS } from "@/validations/file.validation";
import { getFileFromUrl } from "./file.utils";
import { IFileCloud } from "@/types/file.type";
import { CategoryEntityEnum, ICategory, ICategoryEntityOption, ICategoryInput, ICategoryTranslatedFields } from "@/types/category.type";
import { getTranslatedField } from "./settings.utils";
import { Lang } from "@/types/setting.type";
import { Category } from "@/redux/actions/category.action";
import { ISelectOption } from "@/types/app.type";
import { IPage, IPageBlocksStepTwoInput, IPageStepOneInput, IPageStepThreeInput, IPageStepTwoInput } from "@/types/page.type";

export const articlesTabOptions = defaultTabOptions;
export const pagesTabOptions = defaultTabOptions;
export const categoriesTabOptions = defaultTabOptions;

export const imagePositionOptions: ISelectOption[] = [
  {
    label: i18n.t('cms:bottom'),
    value: 'bottom',
  },
  {
    label: i18n.t('cms:right'),
    value: 'right',
  },
  {
    label: i18n.t('cms:left'),
    value: 'left',
  },
];

export const pageLinkLocationOptions: ISelectOption[] = [
  {
    label: i18n.t('cms:inTheMenu'),
    value: 'menu',
  },
  {
    label: i18n.t('cms:inTheFooter'),
    value: 'footer',
  },
];

/**
 * in the database, these translated fields is transformed to have this schema
 * { "fr": { "title": "xxx_fr", "description": "yyyy_fr" },  "en": { "title": "xxx_en", "description": "yyyy_en" }, ... }
 */
export const TRANSLATED_CMS_FIELDS = [
  'name',
  'title',
  'description',
  'content',
  'slug',
  'metaTitle',
  'metaDescription',
  'tags',
  'blocksTitle',
  'blocksDescription',
];

export const ALL_PAGE_FIELDS = [
  'active',
  'category',
  ...PAGE_SINGLE_IMAGE_FIELDS,
  ...PAGE_IMAGES_FIELDS,
];

export const activeOptions: ISelectOption<boolean>[] = [
  {
    label: i18n.t('cms:published'),
    value: true,
  },
  {
    label: i18n.t('cms:notPublished'),
    value: false,
  },
];

export const categoryEntityOptions: ICategoryEntityOption[] = [
  {
    label: i18n.t('cms:article'),
    value: 'article',
  },
  {
    label: i18n.t('cms:page'),
    value: 'page',
  },
];

export const getCategoryEntityLabel = (entity: CategoryEntityEnum): string => {
  const entityOption = categoryEntityOptions.find((option) => option.value === entity);
  return entityOption ? entityOption.label : '';
}

/**
 * format translated form fields name to data base fields
 * ex: { "fr:title": "my-title-fr", active: true } to { active: true, translated: {{ "fr": { "title" : "my-title-fr" }}}}
 * @param values
 * @returns
 */
export const formatTranslatedFormValuesToSave = (values: Record<string, any>): any => {
  const newValues: Record<string, any> = {};
  const translated: Record<string, any> = {};

  for (const key of Object.keys(values)) {
    // important: all translated fields must be in this key (ex: { translated: { fr: { title: 'xxx' }, en: { title: 'yyy' } } })
    const separatedKey = key.split(':');
    const keyLang = separatedKey[0]; // ex: fr
    const keyName = separatedKey[separatedKey.length - 1]; // ex: title

    // add translated key to "translated" key
    if (keyName && TRANSLATED_CMS_FIELDS.includes(keyName)) {
      if (locales.includes(keyLang)) {
        translated[keyLang] = {
          ...translated[keyLang],
          [keyName]: values[key],
        };
      }
    }
    // otherwise outside the "translated" field
    else {
      newValues[key] = values[key];
    }
  }

  return {
    ...newValues,
    translated
  };
};

/**
 * transform form values to values to save
 * @param values 
 * @returns 
 */
export const formatTranslatedPageFormValuesToSave = (values: Record<string, any>) => {
  // other fields transformation
  const newValues: Record<string, any> = {};

  // translated blocks transformation
  if (values.blocks) {
    const translatedBlocks = []
    for (const block of values.blocks) {
      const translatedBlock = formatTranslatedFormValuesToSave(block)
      translatedBlocks.push(translatedBlock)
    }
    newValues.blocks = translatedBlocks;
  }

  return newValues;
}

/**
 * parse data base fields to translated form fields name to data base field
 * ex: { "fr": { "title" : "my-title-fr" }} to { "title+fr": "my-title-fr" }
 * @param values
 * @returns
 */
export const parseSavedTranslatedValuesToForm = (
  values: Record<string, any>,
  otherFields: string[] = [],
): any => {
  const newValues: Record<string, any> = {};

  Object.keys(values).forEach(key => {
    // translated fields
    if (key === 'translated') {
      Object.keys(values[key]).forEach((subKey) => {
        const translated = key; // translated
        const locale = subKey; // fr, en, ...
        // article['translated']['fr']
        Object.keys(values[translated][locale]).forEach(field => {
          // article['fr:title'] = 'Bonjour'
          newValues[locale + ':' + field] = values[translated][locale][field];
        })
      });
      // other fields
    } else if (otherFields.includes(key)) {
      newValues[key] = values[key];
    }
  });

  return newValues;
};

/**
 * category format for select option
 * @param language 
 * @returns 
 */
const getCategoryInputValue = (language: Lang) => (category: ICategory) => {
  return {
    label: getTranslatedField(category.translated, language, 'name'),
    value: {
      objectId: category.objectId,
    }
  }
}

const getCMSImagesInitialValues = async (
  page: IArticle | IPage,
) => {
  const [bannerImage, previewImage] = await Promise.all([
    page.bannerImage ? getFileFromUrl(page.bannerImage.url) : [],
    page.previewImage ? getFileFromUrl(page.previewImage.url) : [],
  ]);

  const images = await Promise.all(page.images?.map((image: IFileCloud) => getFileFromUrl(image.url)) ?? []);

  return {
    bannerImage: Array.isArray(bannerImage) ? bannerImage : [bannerImage], // should be an array
    previewImage: Array.isArray(previewImage) ? previewImage : [previewImage], // should be an array
    images,
  };
}

export const getCmsEditionCmsInitialValues = async (
  page: IArticle | null | undefined,
  language: Lang,
): Promise<IArticleInput | undefined> => {
  if (!page) return;
  const formattedTranslatedValues = parseSavedTranslatedValuesToForm(page);
  const imagesFields = await getCMSImagesInitialValues(page);

  const defaultValues = {
    ...formattedTranslatedValues,
    ...imagesFields,
  };

  // for article
  // array of pointer json to form select option
  if (page.categories) {
    defaultValues.categories = page.categories.map(getCategoryInputValue(language));
  }

  return defaultValues;
};

/**
 * form initial values for page edition
 * @param page 
 * @param language 
 * @returns 
 */
export const getPageStepOneEditionInitialValues = async (
  page: IPage | null | undefined,
): Promise<IPageStepOneInput | undefined> => {
  if (!page) return;
  const clonedPage = cloneDeep(page); // immutability
  const formattedTranslatedValues = parseSavedTranslatedValuesToForm(clonedPage);

  return formattedTranslatedValues;
};

export const getPageStepTwoEditionInitialValues = async (
  page: IPage | null | undefined,
): Promise<IPageStepTwoInput | undefined> => {
  if (!page) return;
  const clonedPage = cloneDeep(page); // immutability
  const imagesFields = await getCMSImagesInitialValues(clonedPage);

  return imagesFields;
};

export const getPageStepThreeEditionInitialValues = async (
  page: IPage | null | undefined,
  language: Lang,
): Promise<IPageStepThreeInput | undefined> => {
  if (!page) return;
  const clonedPage = cloneDeep(page); // immutability
  const values: Record<string, any> = {
    active: !!clonedPage.active,
  };
  // -------- category -------- //
  if (clonedPage.category) {
    values.category = getCategoryInputValue(language)(clonedPage.category);
  }

  return values;
};

// ------------------------ //
// -------- blocks -------- //
// ------------------------ //
export const getPageBlocksEditionCmsInitialValues = async (
  page: IPage | null | undefined,
): Promise<IPageBlocksStepTwoInput | undefined> => {
  if (!page) return;
  const clonedPage = cloneDeep(page); // immutability

  // -------- blocks -------- //
  const blocks = [];
  if (clonedPage.blocks) {
    for (const block of clonedPage.blocks) {
      const formattedBlock = parseSavedTranslatedValuesToForm(block);
      const values = { ...formattedBlock };

      if (block.image) {
        const file = await getFileFromUrl(block.image.url);
        values.image = [file]; // should be an array
        values.imagePosition = block.imagePosition;
      }

      blocks.push(values);
    }
    
    clonedPage.blocks = blocks;
  }

  return clonedPage;
};


/**
 * initial form values for creation or edition
 * @param category
 * @returns
 */
export const getCategoryFormInitialValues = async (category: ICategory | null | undefined): Promise<ICategoryInput> => {
  // ----------- creation ----------- //
  if (!category) {
    return {
      active: true,
    };
  }

  // ----------- update ----------- //
  const translatedValues = parseSavedTranslatedValuesToForm(category);
  const values = {
    ...translatedValues,
    active: category.active,
    entity: category.entity
  }

  if (category.image) {
    const file = await getFileFromUrl(category.image.url);
    values.image = [file]; // should be an array
  }

  return values;
};

/**
 * create a pointer by category id
 * ex: 'myId' => pointer
 * @param categoryId 
 * @returns 
 */
export const getCategoryPointer= (categoryId: string): Parse.Object => {
  // array of pointers
  const category = new Category();
  category.id = categoryId;
  return category;
}

/**
 * create a list of pointer by a list of category id
 * ex: ['myId'] => [pointer]
 * @param categoryIds 
 * @returns 
 */
export const getCategoryPointersFromIds = (categoryIds: string[]): Parse.Object[] | void => {
  if (!categoryIds) return;

  // array of pointers
  const categories = categoryIds.map(getCategoryPointer);

  return categories;
}

/**
 * get categories name separated by comma
 * @param categories 
 * @param lang 
 * @returns 
 */
export const getTranslatedCategoriesName = (categories: ICategory[], lang: Lang) => {
  return categories.map((category: ICategory) => getTranslatedField<ICategoryTranslatedFields>(category.translated, lang, 'name')).join(', ');
}

export const getImagePositionLabel = (position: string): string => {
  const option = imagePositionOptions.find((option) => option.value === position);
  return option ? option.label : '';
}

export const getLinkEmplacementLabel = (emplacement: string): string => {
  const option = pageLinkLocationOptions.find((option) => option.value === emplacement);
  return option ? option.label : '';
}