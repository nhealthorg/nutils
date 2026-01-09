<template>
  <UModal
    v-model:open="state.open"
    :ui="{ content: 'max-w-md' }"
    @update:open="onOpenUpdate"
  >
    <!-- Header with Icon -->
    <template #header>
      <div class="flex items-start gap-3">
        <div
          v-if="opts.icon"
          class="shrink-0 rounded-full p-2 w-10 h-10 flex items-center justify-center"
          :class="iconColorClasses"
        >
          <UIcon
            :name="opts.icon"
            class="size-5"
          />
        </div>
        <div class="flex-1 min-w-0 self-center">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ opts.title || 'Confirm' }}
          </h3>
        </div>
      </div>
    </template>

    <!-- Body -->
    <template #body>
      <div class="space-y-4">
        <!-- Description or text -->
        <div
          v-if="opts.description || opts.text"
          class="space-y-2"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ opts.description || opts.text }}
          </p>
        </div>

        <!-- Bullet list items -->
        <ul
          v-if="opts.items && opts.items.length > 0"
          class="space-y-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <li
            v-for="(item, index) in opts.items"
            :key="index"
            class="flex items-start gap-2"
          >
            <UIcon
              name="i-lucide-circle"
              class="size-1.5 mt-1.5 shrink-0"
            />
            <span>{{ item }}</span>
          </li>
        </ul>

        <!-- Warning message -->
        <p
          v-if="opts.warning"
          class="text-sm font-medium text-amber-600 dark:text-amber-400"
        >
          {{ opts.warning }}
        </p>

        <!-- Input validation gate -->
        <div v-if="opts.requireInputEquals">
          <UFormField
            :label="opts.inputLabel || 'Type to confirm'"
            :help="inputHelp"
          >
            <UInput
              v-model="state.confirmInput"
              :placeholder="opts.inputPlaceholder || ''"
            />
          </UFormField>
        </div>

        <!-- Checkbox validation gate -->
        <div v-if="opts.requireCheckbox">
          <UCheckbox
            v-model="state.confirmChecked"
            :label="opts.checkboxLabel || 'I understand and want to continue'"
          />
        </div>
      </div>
    </template>

    <!-- Footer with actions -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :label="opts.cancelLabel || 'Cancel'"
          :color="opts.cancelColor || 'neutral'"
          :variant="opts.cancelVariant || 'subtle'"
          :autofocus="opts.autofocus === 'cancel'"
          :disabled="state.loading"
          @click="actions.onCancel()"
        />

        <UButton
          :label="opts.confirmLabel || 'Confirm'"
          :color="(opts.dangerous ? 'error' : opts.confirmColor) || 'primary'"
          :variant="opts.confirmVariant || 'solid'"
          :disabled="confirmDisabled"
          :autofocus="opts.autofocus === 'confirm'"
          :loading="state.loading"
          @click="actions.onConfirm()"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, useConfirmModalState, useConfirmModalActions } from '#imports'
import type { ConfirmModalOptions } from '../composables/useConfirmModal'

const state = useConfirmModalState()
const actions = useConfirmModalActions()

const opts = computed<ConfirmModalOptions>(() => {
  // Prefer the snapshot to avoid flicker while closing
  const source = state.value.current?.options || state.value.renderOptions
  return (source as ConfirmModalOptions) || ({} as ConfirmModalOptions)
})

const iconColorClasses = computed(() => {
  switch (opts.value.iconColor) {
    case 'error':
      return 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
    default:
      return 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
  }
})

const inputHelp = computed(() => {
  if (opts.value?.inputHint)
    return opts.value.inputHint
  if (opts.value?.requireInputEquals) {
    return `Type "${opts.value.requireInputEquals}" to enable confirm`
  }
  return undefined
})

const confirmDisabled = computed<boolean>(() => {
  const o = opts.value
  if (!o)
    return true
  if (o.requireInputEquals && state.value.confirmInput !== o.requireInputEquals)
    return true
  if (o.requireCheckbox && !state.value.confirmChecked)
    return true
  if (state.value.loading)
    return true
  return false
})

function onOpenUpdate(v: boolean) {
  // If user closes the modal externally (overlay/esc), signal cancel
  if (!v && state.value.current) {
    actions.onClosedExternally()
  }
}
</script>
