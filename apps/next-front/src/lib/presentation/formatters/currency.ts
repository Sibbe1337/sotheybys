export const fmtCurrency = (n: number, locale = 'fi-FI') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(n);

