import { describe, it, expect } from 'vitest'
import { useCounter } from '../src/runtime/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
    increment()
    expect(count.value).toBe(2)
  })

  it('should decrement count', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
    decrement()
    expect(count.value).toBe(3)
  })

  it('should reset to initial value', () => {
    const { count, increment, reset } = useCounter(10)
    increment()
    increment()
    expect(count.value).toBe(12)
    reset()
    expect(count.value).toBe(10)
  })

  it('should compute double value', () => {
    const { count, double, increment } = useCounter(5)
    expect(double.value).toBe(10)
    increment()
    expect(double.value).toBe(12)
  })
})
