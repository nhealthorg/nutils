<template>
  <div class="space-y-4">
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">
          Confirm Modal
        </h2>
      </template>
      <div class="space-y-6">
        <p class="text-sm text-slate-600">
          The confirm modal provides a flexible way to request user confirmation for important actions with various validation options.
        </p>

        <!-- Basic Confirm -->
        <div class="space-y-2">
          <p class="font-medium text-slate-900">
            Basic Confirmation
          </p>
          <UButton
            color="primary"
            @click="handleBasicConfirm"
          >
            Open Basic Confirm
          </UButton>
        </div>

        <!-- Destructive Action -->
        <div class="space-y-2">
          <p class="font-medium text-slate-900">
            Destructive Action
          </p>
          <UButton
            color="error"
            @click="handleDestructiveConfirm"
          >
            Delete Item
          </UButton>
        </div>

        <!-- With Input Validation -->
        <div class="space-y-2">
          <p class="font-medium text-slate-900">
            Input Validation
          </p>
          <UButton
            color="warning"
            @click="handleInputValidation"
          >
            Confirm with Text Input
          </UButton>
        </div>

        <!-- With Checkbox -->
        <div class="space-y-2">
          <p class="font-medium text-slate-900">
            Checkbox Validation
          </p>
          <UButton
            color="info"
            @click="handleCheckboxConfirm"
          >
            Confirm with Checkbox
          </UButton>
        </div>

        <!-- Result Display -->
        <div
          v-if="lastResult"
          class="rounded-lg bg-slate-50 p-4 border border-slate-200"
        >
          <p class="text-sm font-medium text-slate-600">
            Last Result:
          </p>
          <p class="text-sm text-slate-700 mt-2">
            <span
              v-if="lastResult.confirmed"
              class="text-emerald-600"
            >✓ Confirmed</span>
            <span
              v-else
              class="text-slate-600"
            >✗ Cancelled</span>
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

const lastResult = ref<{ confirmed: boolean } | null>(null)
const confirm = useConfirmModal()

async function handleBasicConfirm() {
  const result = await confirm({
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
    confirmLabel: 'Yes, proceed',
    cancelLabel: 'Cancel',
    icon: 'i-heroicons-question-mark-circle-20-solid',
    iconColor: 'info',
  })
  lastResult.value = result
}

async function handleDestructiveConfirm() {
  const result = await confirm({
    title: 'Delete Item',
    description: 'This action cannot be undone.',
    warning: 'All associated data will be permanently deleted.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    dangerous: true,
    icon: 'i-heroicons-trash',
    iconColor: 'error',
  })
  lastResult.value = result
}

async function handleInputValidation() {
  const result = await confirm({
    title: 'Confirm Important Action',
    description: 'This is a critical operation. Please type the confirmation text to proceed.',
    requireInputEquals: 'DELETE',
    inputLabel: 'Type "DELETE" to confirm',
    inputPlaceholder: 'Type here...',
    inputHint: 'Case sensitive',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    icon: 'i-heroicons-exclamation-triangle-20-solid',
    iconColor: 'warning',
  })
  lastResult.value = result
}

async function handleCheckboxConfirm() {
  const result = await confirm({
    title: 'Acknowledge Changes',
    description: 'You are about to apply changes that will affect your account.',
    items: [
      'Changes take effect immediately',
      'This action cannot be reversed',
      'All users will be notified',
    ],
    requireCheckbox: true,
    checkboxLabel: 'I understand the consequences and want to proceed',
    confirmLabel: 'Apply Changes',
    cancelLabel: 'Cancel',
    icon: 'i-heroicons-information-circle-20-solid',
    iconColor: 'info',
  })
  lastResult.value = result
}
</script>
