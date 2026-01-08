<template>
  <div
    class="rounded-lg border px-3 py-2 inline-flex flex-col gap-1 text-center transition-colors hover:bg-opacity-75"
    :class="[variantClasses, 'border-current']"
  >
    <span class="text-xs font-semibold uppercase tracking-wider opacity-75">{{ label }}</span>
    <span class="text-lg font-bold tabular-nums">{{ count ?? 0 }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ColorVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'

interface Props {
  label: string
  count?: number
  color?: ColorVariant
}

const props = withDefaults(defineProps<Props>(), {
  color: 'neutral',
})

const variantClasses = computed(() => {
  const variants: Record<ColorVariant, string> = {
    neutral: 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300',
    primary: 'border-primary-400 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
    success: 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
    warning: 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
    error: 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    info: 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  }
  return variants[props.color]
})
</script>
