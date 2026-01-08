/**
 * Format a date to a readable string
 * @param date - Date object or timestamp
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | number, locale = 'en-US'): string => {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format a number with thousand separators
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  return num.toLocaleString(locale)
}

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength = 50, suffix = '...'): string => {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - suffix.length) + suffix
}
