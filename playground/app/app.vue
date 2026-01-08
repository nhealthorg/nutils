<template>
  <UApp>
    <NUtilsComponentRouter
      v-slot="{ component }"
      :routes="routes"
      base="p"
      mode="query"
    >
      <NUtilsComponentShell
        orientation="vertical"
        :items="navigationItems"
      >
        <template #leading>
          <div class="p-4 border-b border-gray-200">
            <h1 class="text-lg font-semibold text-slate-900">NUtils Playground</h1>
          </div>
        </template>
        <div class="p-4">
          <component :is="component" />
        </div>
        <template #trailing>
          <div class="p-4 border-t border-gray-200">
            <p class="text-sm text-slate-600">© 2026 NUtils</p>
          </div>
        </template>
      </NUtilsComponentShell>
    </NUtilsComponentRouter>

    <!-- Confirm Modal -->
    <NUtilsConfirmModal />
  </UApp>
</template>

<script setup lang="ts">
// Define routes for the component router
const routes = {
  '/stats': async () => await import('./components/examples/StatsDemo.vue'),
  '/composables': async () => await import('./components/examples/ComposablesDemo.vue'),
  '/utilities': async () => await import('./components/examples/UtilitiesDemo.vue'),
  '/router': async () => await import('./components/examples/RouterDemo.vue'),
  '/confirm-modal': async () => await import('./components/examples/ConfirmModalDemo.vue'),
}

// Navigation items with labels and paths
const navigationItems = [
  [
    {
      label: 'Stats Components',
      path: '/stats',
      icon: 'i-heroicons-chart-bar-20-solid',
    },
    {
      label: 'Composables',
      path: '/composables',
      icon: 'i-heroicons-cog-6-tooth-20-solid',
    },
    {
      label: 'Utilities',
      path: '/utilities',
      icon: 'i-heroicons-wrench-20-solid',
    },
    {
      label: 'Component Router',
      path: '/router',
      icon: 'i-heroicons-map-20-solid',
    },
    {
      label: 'Confirm Modal',
      path: '/confirm-modal',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
    },
  ],
]
</script>
