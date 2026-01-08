import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, truncate } from '../src/runtime/utils/formatters'

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format a date object', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })

    it('should format a timestamp', () => {
      const timestamp = new Date('2024-01-15').getTime()
      const formatted = formatDate(timestamp)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })
  })

  describe('formatNumber', () => {
    it('should format a number with thousand separators', () => {
      const formatted = formatNumber(1234567.89)
      expect(formatted).toBe('1,234,567.89')
    })

    it('should handle small numbers', () => {
      const formatted = formatNumber(42)
      expect(formatted).toBe('42')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long text that needs truncation'
      const truncated = truncate(text, 20)
      expect(truncated).toBe('This is a very lo...')
      expect(truncated.length).toBe(20)
    })

    it('should not truncate short strings', () => {
      const text = 'Short text'
      const truncated = truncate(text, 20)
      expect(truncated).toBe('Short text')
    })

    it('should use custom suffix', () => {
      const text = 'This is a very long text that needs truncation'
      const truncated = truncate(text, 20, '---')
      expect(truncated).toBe('This is a very lo---')
    })
  })
})
