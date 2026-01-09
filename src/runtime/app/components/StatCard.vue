<template>
  <div
    class="rounded-lg border p-4 transition-all hover:shadow-md"
    :class="[variantClasses, 'border-gray-200 dark:border-gray-800']"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <p
          class="text-xs font-semibold uppercase tracking-widest"
          :class="labelColor"
        >
          {{ label }}
        </p>
        <p class="text-3xl font-bold mt-2 tracking-tight">
          {{ formatValue(value) }}
        </p>
        <p
          v-if="description"
          class="text-xs mt-2"
          :class="descriptionColor"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="icon"
        class="flex-shrink-0"
      >
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="iconColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

type Variant = 'gray' | 'primary' | 'success' | 'warning' | 'error' | 'info'

interface Props {
  label: string
  value: number | string
  icon?: string
  description?: string
  variant?: Variant
  trend?: 'up' | 'down' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  trend: 'neutral',
})

const variantClasses = computed(() => {
  const variants: Record<Variant, string> = {
    gray: 'bg-gray-50 dark:bg-gray-900/50',
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    success: 'bg-emerald-50 dark:bg-emerald-900/20',
    warning: 'bg-amber-50 dark:bg-amber-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
  }
  return variants[props.variant]
})

const labelColor = computed(() => {
  const colors: Record<Variant, string> = {
    gray: 'text-gray-600 dark:text-gray-400',
    primary: 'text-primary-600 dark:text-primary-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  }
  return colors[props.variant]
})

const descriptionColor = computed(() => {
  const colors: Record<Variant, string> = {
    gray: 'text-gray-500 dark:text-gray-500',
    primary: 'text-primary-600 dark:text-primary-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  }
  return colors[props.variant]
})

const iconColor = computed(() => {
  const colors: Record<Variant, string> = {
    gray: 'text-gray-400 dark:text-gray-600',
    primary: 'text-primary-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }
  return colors[props.variant]
})

function formatValue(value: number | string): string {
  if (typeof value === 'string') return value
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}
</script>
