import i18n from "@/config/i18n";

export const invoiceStatus = [
  {
    value: 'WAITING',
    label: i18n.t('common:status.waiting'),
  },
  {
    value: 'IN_PROGRESS',
    label: i18n.t('common:status.inProgress'),
  },
  {
    value: 'SENT',
    label: i18n.t('common:status.sent'),
  },
  {
    value: 'PAID',
    label: i18n.t('common:status.paid'),
  },
];

export const getInvoiceStatusLabel = (status: string): string => {
  const statusObj = invoiceStatus.find((s) => s.value === status);
  return statusObj?.value || status;
}