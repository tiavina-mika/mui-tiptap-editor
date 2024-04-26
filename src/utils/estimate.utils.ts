import i18n from "@/config/i18n";
import { defaultTabOptions } from "./app.utils";

export const estimateStatusOptions = [
  {
    value: 'WAITING',
    label: i18n.t('common:status.waiting'),
  },
  {
    value: 'DONE',
    label: i18n.t('common:status.done'),
  },
];

export const getEstimateStatusLabel = (status: string): string => {
  const statusObj = estimateStatusOptions.find((s) => s.value === status);
  return statusObj?.value || status;
}

export const estimatesTabOptions = [
  {
    label: i18n.t('common:news'),
    tab: i18n.t('common:route.new'),
    key: 'seen',
    value: false,
  },
  ...defaultTabOptions,
];
