<template>
  <slot
    :component="component"
    :route="route"
    :push="push"
  />
</template>

<script setup lang="ts">
import { useComponentRouter, type Component } from '#imports'

type AsyncComponentLoader = () => Promise<Component | { default: Component }>
type ComponentRouteRecord = { path: string, component: Component | AsyncComponentLoader, name?: string }
type ComponentRouterMode = 'query' | 'hash' | 'memory'

const props = withDefaults(
  defineProps<{
    routes: ComponentRouteRecord[] | Record<string, Component | AsyncComponentLoader>
    base?: string
    mode?: ComponentRouterMode
    initial?: string
    debug?: boolean
  }>(),
  {
    base: 'fp',
    mode: 'query',
    debug: false,
  },
)

const { component, route, push, replace } = useComponentRouter({
  routes: props.routes,
  base: props.base,
  mode: props.mode,
  initial: props.initial,
  debug: props.debug,
})

defineExpose({ push, replace, route })
</script>
