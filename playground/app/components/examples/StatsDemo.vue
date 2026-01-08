<template>
  <div class="space-y-6">
    <!-- StatCard Examples -->
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">StatCard Component</h2>
      </template>
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Flexible stat cards with multiple variants, icons, and optional descriptions.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NUtilsStatCard
            label="Total Users"
            :value="42_500"
            icon="i-heroicons-users-20-solid"
            variant="primary"
            description="Active this month"
          />
          <NUtilsStatCard
            label="Revenue"
            value="$125,430"
            icon="i-heroicons-currency-dollar-20-solid"
            variant="success"
            description="This quarter"
          />
          <NUtilsStatCard
            label="Issues"
            :value="1_250_000"
            icon="i-heroicons-exclamation-triangle-20-solid"
            variant="error"
            description="Needs attention"
          />
          <NUtilsStatCard
            label="Performance"
            value="98.5%"
            icon="i-heroicons-chart-bar-20-solid"
            variant="info"
            description="Uptime"
          />
          <NUtilsStatCard
            label="Warnings"
            :value="342"
            icon="i-heroicons-exclamation-circle-20-solid"
            variant="warning"
            description="In progress"
          />
          <NUtilsStatCard
            label="Database"
            value="256 GB"
            icon="i-heroicons-server-20-solid"
            variant="gray"
            description="Storage used"
          />
        </div>
      </div>
    </UCard>

    <!-- StatCounter Examples -->
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">StatCounter Component</h2>
      </template>
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Compact inline counters with color variants for quick status displays.
        </p>
        <div class="flex flex-wrap gap-3">
          <NUtilsStatCounter
            label="Pending"
            :count="12"
            color="warning"
          />
          <NUtilsStatCounter
            label="Completed"
            :count="156"
            color="success"
          />
          <NUtilsStatCounter
            label="Failed"
            :count="3"
            color="error"
          />
          <NUtilsStatCounter
            label="Total"
            :count="171"
            color="primary"
          />
          <NUtilsStatCounter
            label="Queued"
            :count="42"
            color="info"
          />
          <NUtilsStatCounter
            label="Skipped"
            :count="0"
            color="neutral"
          />
        </div>
      </div>
    </UCard>

    <!-- LiveIndicator Examples -->
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">LiveIndicator Component</h2>
      </template>
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Status indicators for connection, system, or service status.
        </p>
        <div class="space-y-3">
          <div class="flex items-center gap-4">
            <NUtilsLiveIndicator status="connected" />
            <span class="text-sm text-slate-600">System is connected and live</span>
          </div>
          <div class="flex items-center gap-4">
            <NUtilsLiveIndicator status="reconnecting" />
            <span class="text-sm text-slate-600">Attempting to reconnect</span>
          </div>
          <div class="flex items-center gap-4">
            <NUtilsLiveIndicator status="offline" />
            <span class="text-sm text-slate-600">System is offline</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Interactive Demo -->
    <UCard class="shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900">Interactive Demo</h2>
      </template>
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Toggle the indicator status to see real-time updates.
        </p>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex gap-2">
              <UButton
                v-for="status in ['connected', 'reconnecting', 'offline']"
                :key="status"
                :variant="currentStatus === status ? 'soft' : 'ghost'"
                :color="currentStatus === status ? 'primary' : 'gray'"
                @click="currentStatus = status as any"
                class="capitalize"
              >
                {{ status }}
              </UButton>
            </div>
            <NUtilsLiveIndicator :status="currentStatus" />
          </div>
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-xs font-mono text-slate-500">Current status: {{ currentStatus }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentStatus = ref<'connected' | 'reconnecting' | 'offline'>('connected')
</script>
