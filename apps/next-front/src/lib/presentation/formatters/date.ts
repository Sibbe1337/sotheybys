export const fmtDate = (d?: Date | string, locale = 'fi-FI') => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat(locale).format(date);
};

