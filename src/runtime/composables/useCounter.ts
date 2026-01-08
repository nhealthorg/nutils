import { ref, computed } from 'vue'

/**
 * A simple counter composable that demonstrates shared state management
 * @param initialValue - Initial counter value (default: 0)
 * @returns Counter state and methods
 */
export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  const double = computed(() => count.value * 2)

  return {
    count,
    increment,
    decrement,
    reset,
    double
  }
}
