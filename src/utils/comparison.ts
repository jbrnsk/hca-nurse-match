/**
 * Normalizes phone numbers to just digits for comparison.
 */
export const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

/**
 * Normalizes various Date formats to a standard YYYY-MM-DD.
 * Handles '2004-04-12' and '30-Jul-2001'
 */
export const normalizeDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? dateStr : date.toISOString().split('T')[0];
};

/**
 * Checks if two values are "effectively" the same after normalization.
 */
export const isMatch = (key: string, val1: unknown, val2: unknown) => {
  if (!val1 || !val2) return false;

  const s1 = String(val1).trim().toLowerCase();
  const s2 = String(val2).trim().toLowerCase();

  if (key === 'PhoneNumber') return normalizePhone(s1) === normalizePhone(s2);
  if (key === 'DOB') return normalizeDate(s1) === normalizeDate(s2);

  return s1 === s2;
};
