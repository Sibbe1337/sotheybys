export const fmtArea = (n?: number, locale = 'fi-FI') =>
  n == null ? '' : `${n.toLocaleString(locale)} m²`;

