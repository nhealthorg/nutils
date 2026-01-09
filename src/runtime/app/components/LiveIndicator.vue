<template>
  <div
    class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors"
    :class="statusClasses"
  >
    <div
      class="w-2 h-2 rounded-full"
      :class="dotClasses"
    />
    <span>{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

type Status = 'connected' | 'reconnecting' | 'offline'

interface Props {
  status?: Status
}

const props = withDefaults(defineProps<Props>(), {
  status: 'offline',
})

const statusClasses = computed(() => {
  const classes: Record<Status, string> = {
    connected: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    reconnecting: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    offline: 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400',
  }
  return classes[props.status]
})

const dotClasses = computed(() => {
  const classes: Record<Status, string> = {
    connected: 'bg-emerald-500 animate-pulse',
    reconnecting: 'bg-amber-500 animate-pulse',
    offline: 'bg-gray-400',
  }
  return classes[props.status]
})

const statusText = computed(() => {
  const texts: Record<Status, string> = {
    connected: 'Live',
    reconnecting: 'Reconnecting',
    offline: 'Offline',
  }
  return texts[props.status]
})
</script>
