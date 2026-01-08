# nutils

A comprehensive Nuxt v4 module providing shared components, composables, utilities, and a component-based router for nhealth.org packages.

## ✨ Features

- 🎨 **Auto-registered Components** - Use components without explicit imports
- 🔧 **Auto-imported Composables** - Access composables anywhere in your Nuxt app
- 🛠️ **Utility Functions** - Common utility functions auto-imported
- 🧭 **Component-based Routing** - Dynamic component rendering with query/hash/memory routing modes
- 📊 **Pre-built UI Components** - StatCard, StatCounter, LiveIndicator, ConfirmModal, and more
- ⚡ **Tailwind + Nuxt UI** - Modern styling with Tailwind CSS and Nuxt UI v4
- 📱 **Fully Responsive** - Mobile-first components
- 🌙 **Dark Mode Support** - All components support light and dark modes
- 📦 **TypeScript Support** - Full TypeScript support with type definitions
- ⚡ **Nuxt 4 Compatible** - Built for Nuxt v4

## 🚀 Quick Setup

### 1. Install the module

```bash
npm install @nhealth/nutils
```

### 2. Add to `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: [
    '@nhealth/nutils'
  ]
})
```

### 3. (Optional) Add Nuxt UI and Tailwind for full styling

If you want to use the styled components with Nuxt UI and Tailwind CSS:

```bash
npm install @nuxt/ui tailwindcss
```

Then add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nhealth/nutils'
  ],
  colorMode: {
    preference: 'light'
  }
})
```

That's it! You can now use all components, composables, and utilities ✨

## 📚 Documentation

### Components

#### StatCard
A flexible stat display card with multiple variants and optional descriptions.

```vue
<template>
  <NUtilsStatCard
    label="Total Users"
    :value="42500"
    icon="i-heroicons-users-20-solid"
    variant="primary"
    description="Active this month"
  />
</template>
```

**Props:**
- `label` (string, required) - Label text
- `value` (number | string, required) - The value to display (numbers are formatted: 1M, 1K, etc.)
- `icon` (string, optional) - Icon name (Heroicons compatible)
- `description` (string, optional) - Additional description text
- `variant` (string, default: 'gray') - Color variant: `'gray' | 'primary' | 'success' | 'warning' | 'error' | 'info'`
- `trend` (string, default: 'neutral') - Trend indicator: `'up' | 'down' | 'neutral'`

#### StatCounter
Compact inline counter for quick status displays.

```vue
<template>
  <NUtilsStatCounter
    label="Pending"
    :count="12"
    color="warning"
  />
</template>
```

**Props:**
- `label` (string, required) - Label text
- `count` (number, optional) - Counter value
- `color` (string, default: 'neutral') - Color variant: `'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'`

#### LiveIndicator
Status indicator for connection, system, or service status.

```vue
<template>
  <NUtilsLiveIndicator status="connected" />
  <NUtilsLiveIndicator status="reconnecting" />
  <NUtilsLiveIndicator status="offline" />
</template>
```

**Props:**
- `status` (string, default: 'offline') - Status: `'connected' | 'reconnecting' | 'offline'`

#### ComponentRouter
A slot-based component for dynamic component rendering with routing capabilities.

```vue
<template>
  <NUtilsComponentRouter
    v-slot="{ component }"
    :routes="routes"
    base="page"
    mode="query"
  >
    <component :is="component" />
  </NUtilsComponentRouter>
</template>

<script setup>
const routes = {
  '/home': () => import('./pages/Home.vue'),
  '/about': () => import('./pages/About.vue'),
  '/contact': () => import('./pages/Contact.vue'),
}
</script>
```

**Props:**
- `routes` (Record<string, Component | AsyncComponentLoader>, required) - Route definitions
- `base` (string, default: 'fp') - Query/hash parameter name
- `mode` (string, default: 'query') - Routing mode: `'query' | 'hash' | 'memory'`
- `initial` (string, optional) - Initial route path
- `debug` (boolean, default: false) - Enable debug logging

**Slot Props:**
- `component` - Current component to render
- `route` - Current route object with path, params, and query
- `push` - Function to navigate to a route

#### ComponentShell
Layout component with integrated navigation and content area.

```vue
<template>
  <NUtilsComponentShell
    orientation="vertical"
    :items="navigationItems"
    :pageOffset="0"
  >
    <div class="p-4">
      <!-- Content goes here -->
    </div>
  </NUtilsComponentShell>
</template>

<script setup>
const navigationItems = [
  [
    { label: 'Home', path: '/', icon: 'i-heroicons-home-20-solid' },
    { label: 'About', path: '/about', icon: 'i-heroicons-information-circle-20-solid' },
  ]
]
</script>
```

**Props:**
- `orientation` (string, default: 'horizontal') - Layout: `'horizontal' | 'vertical'`
- `items` (NavigationMenuItem[][], optional) - Navigation items
- `activeMatch` (string, default: 'prefix') - Active match mode: `'exact' | 'prefix'`
- `pageOffset` (string | number, default: 0) - Height offset for container (e.g., "4rem", 64)

**Slots:**
- `leading` - Additional content above navigation
- `trailing` - Additional content below navigation
- Default slot - Main content area

#### ConfirmModal
Modal dialog for requesting user confirmation with optional validation gates.

```vue
<template>
  <NUtilsConfirmModal />
  <UButton @click="handleDelete">Delete Item</UButton>
</template>

<script setup>
const confirm = useConfirmModal()

async function handleDelete() {
  const result = await confirm({
    title: 'Delete Item',
    description: 'This action cannot be undone.',
    dangerous: true,
    icon: 'i-heroicons-trash-20-solid',
    iconColor: 'error',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })
  
  if (result.confirmed) {
    // Handle deletion
  }
}
</script>
```

**Configuration Options:**
- `title` (string) - Modal title
- `description` (string) - Description text
- `text` (string) - Alternative to description
- `items` (string[]) - Bullet list items
- `warning` (string) - Warning message
- `icon` (string) - Icon name
- `confirmLabel` (string, default: 'Confirm') - Confirm button label
- `cancelLabel` (string, default: 'Cancel') - Cancel button label
- `dangerous` (boolean) - Style for destructive actions
- `requireInputEquals` (string) - Require typed confirmation
- `inputPlaceholder` (string) - Placeholder for input field
- `requireCheckbox` (boolean) - Require checkbox confirmation
- `checkboxLabel` (string) - Checkbox label
- `confirmColor` (string) - Button color
- `iconColor` (string) - Icon color variant

### Composables

#### useCounter
Simple reactive counter state management.

```vue
<script setup>
const { count, double, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

**Returns:**
- `count` - Current count (Ref<number>)
- `double` - Double of current count (Computed<number>)
- `increment()` - Increment by 1
- `decrement()` - Decrement by 1
- `reset()` - Reset to initial value

#### useComponentRouter
Dynamic component routing without Nuxt's file-based routing.

```vue
<script setup>
const { component, route, push, makePath } = useComponentRouter({
  routes: {
    '/dashboard': () => import('./Dashboard.vue'),
    '/users': () => import('./Users.vue'),
    '/users/:id': () => import('./UserDetail.vue'),
  },
  mode: 'query',
  base: 'view',
  initial: '/dashboard'
})

const goToUser = (id) => {
  push(`/users/${id}`)
}
</script>
```

**Options:**
- `routes` (Record<string, Component | AsyncComponentLoader>) - Route definitions
- `mode` ('query' | 'hash' | 'memory') - Routing mode
- `base` (string) - Query/hash parameter name
- `initial` (string) - Initial route
- `debug` (boolean) - Enable debug logging

**Returns:**
- `component` - Current component (ShallowRef<Component | null>)
- `route` - Current route info (ShallowRef)
- `push(path)` - Navigate to path
- `replace(path)` - Replace current route
- `makePath(pattern, params)` - Build path from pattern
- `makeHref(pattern, params)` - Build href from pattern
- `pushTo(pattern, params)` - Navigate with pattern
- `replaceTo(pattern, params)` - Replace with pattern
- `hooks` - Navigation hooks

#### useConfirmModal
Modal confirmation dialog management.

```vue
<script setup>
const confirm = useConfirmModal({
  confirmLabel: 'Yes',
  cancelLabel: 'No'
})

const result = await confirm({
  title: 'Confirm?',
  description: 'Are you sure?'
})

if (result.confirmed) {
  // Handle confirmation
}
</script>
```

### Utilities

#### formatDate
Format dates to readable strings.

```typescript
const date = formatDate(new Date())
// Output: "January 8, 2026"

const date = formatDate(new Date(), 'de-DE')
// Output: "8. Januar 2026"
```

#### formatNumber
Format numbers with locale-specific separators.

```typescript
const number = formatNumber(1234567.89)
// Output: "1,234,567.89"

const number = formatNumber(1234567.89, 'de-DE')
// Output: "1.234.567,89"
```

#### truncate
Truncate strings to maximum length.

```typescript
const text = truncate('This is a long text', 10)
// Output: "This is..."

const text = truncate('This is a long text', 10, '→')
// Output: "This is→"
```

## 🎨 Setup with Nuxt UI + Tailwind

For a complete styled experience, follow these steps:

### 1. Install dependencies

```bash
npm install @nuxt/ui @nuxtjs/tailwindcss
```

### 2. Configure `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nhealth/nutils'
  ],
  
  colorMode: {
    preference: 'light'
  },
  
  tailwindcss: {
    exposeConfig: true
  }
})
```

### 3. Create `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      }
    }
  }
} satisfies Config
```

### 4. Create `app.vue`

```vue
<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <NuxtPage />
  </div>
</template>
```

### 5. Create CSS entry point `app.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🔧 Development

### Setup

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run linting
npm run lint

# Run tests
npm run test

# Run type checking
npm run test:types
```

### Adding New Features

#### Components

Add `.vue` files to `src/runtime/app/components/` - they'll be auto-registered with the `NUtils` prefix.

```vue
<!-- src/runtime/app/components/MyComponent.vue -->
<template>
  <div><!-- Your component --></div>
</template>

<script setup lang="ts">
// Your script
</script>
```

Usage:
```vue
<NUtilsMyComponent />
```

#### Composables

Add `.ts` files to `src/runtime/app/composables/` - they'll be auto-imported.

```typescript
// src/runtime/app/composables/useMyComposable.ts
export function useMyComposable() {
  // Your composable logic
}
```

Usage:
```typescript
const myComposable = useMyComposable()
```

#### Utilities

Add `.ts` files to `src/runtime/shared/` - they'll be auto-imported.

```typescript
// src/runtime/shared/myUtil.ts
export function myUtil(input: string): string {
  return input.toUpperCase()
}
```

Usage:
```typescript
const result = myUtil('hello')
```

## 📦 Module Options

Configure the module in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nhealth/nutils'
  ],
  nutils: {
    enabled: true // Enable or disable the module
  }
})
```

## 🎯 Playground

The module includes a comprehensive playground at `playground/app.vue` demonstrating all components and composables. Run `npm run dev` to explore.

## 📄 License

MIT