<template>
  <div class="space-y-4">
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">Component Router</h2>
      </template>
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          The component router allows dynamic component rendering with route-like navigation using query parameters or hash.
        </p>
        <div class="space-y-3">
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-xs font-mono text-slate-500">Current route: {{ route?.path || '/' }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <p class="text-sm text-slate-700">
              <span class="font-semibold">Features:</span> Query-based routing, hash-based routing, memory mode, dynamic routes with parameters
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useComponentRouter()
const route = computed(() => router.route?.value)
</script>
