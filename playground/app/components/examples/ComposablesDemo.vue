<template>
  <div class="space-y-4">
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">useCounter Composable</h2>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-sm text-slate-600">Count</p>
            <p class="text-3xl font-bold text-primary-600">{{ count }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-sm text-slate-600">Double</p>
            <p class="text-3xl font-bold text-primary-600">{{ double }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            icon="i-heroicons-minus-20-solid"
            color="error"
            @click="decrement"
          >
            Decrement
          </UButton>
          <UButton
            icon="i-heroicons-plus-20-solid"
            color="success"
            @click="increment"
          >
            Increment
          </UButton>
          <UButton
            icon="i-heroicons-arrow-path-20-solid"
            color="neutral"
            @click="reset"
          >
            Reset
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { count, double, increment, decrement, reset } = useCounter(0)
</script>
