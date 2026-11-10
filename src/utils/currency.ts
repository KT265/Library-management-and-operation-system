/**
 * Currency Formatting and Parsing Utilities
 * Standard: Vietnamese Dong (VND), dot thousand separator, no cents/decimals.
 */

/**
 * Formats a numeric price into Vietnamese Dong standard format (e.g. "150.000 ₫")
 *
 * @param amount - Price amount in VND
 * @returns Formatted currency string with dot separators and currency symbol ₫
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₫';
  }
  return `${Math.round(amount).toLocaleString('vi-VN')} ₫`;
}

/**
 * Formats a numeric price into Vietnamese Dong plain format with VND text (e.g. "150.000 VND")
 * Useful for banking transfer memos and PayOS gateways.
 *
 * @param amount - Price amount in VND
 * @returns Formatted currency string with dot separators and VND suffix
 */
export function formatVNDPlain(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 VND';
  }
  return `${Math.round(amount).toLocaleString('vi-VN')} VND`;
}

/**
 * Parses a VND string back into numeric value
 * Example: "150.000 ₫" -> 150000, "1.225.000.000 VND" -> 1225000000
 *
 * @param formatted - Formatted string or raw currency text
 * @returns Integer value in VND
 */
export function parseVND(formatted: string): number {
  if (!formatted) {
    return 0;
  }
  const isNegative = formatted.trim().startsWith('-');
  const cleaned = formatted.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10) || 0;
  return isNegative ? -parsed : parsed;
}
