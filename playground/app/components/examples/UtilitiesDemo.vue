<template>
  <div class="space-y-4">
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">
          Utility Functions
        </h2>
      </template>
      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-sm font-medium text-slate-600">
            Formatted Date
          </p>
          <UAlert
            icon="i-heroicons-calendar-20-solid"
            color="info"
            variant="soft"
            :title="formattedDate"
          />
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium text-slate-600">
            Formatted Number
          </p>
          <UAlert
            icon="i-heroicons-hashtag-20-solid"
            color="info"
            variant="soft"
            :title="formattedNumber"
          />
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium text-slate-600">
            Truncated Text
          </p>
          <UAlert
            icon="i-heroicons-document-text-20-solid"
            color="info"
            variant="soft"
            :title="truncatedText"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const formattedDate = formatDate(new Date())
const formattedNumber = formatNumber(1234567.89)
const truncatedText = truncate('This is a very long text that needs to be truncated for display purposes', 30)
</script>
