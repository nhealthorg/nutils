# @nhealthorg/nutils

A Nuxt.js v4 module providing shared components, composables, and utilities for nhealth.org packages.

## Features

- 🎨 **Auto-registered Components** - Use components without explicit imports
- 🔧 **Auto-imported Composables** - Access composables anywhere in your Nuxt app
- 🛠️ **Utility Functions** - Common utility functions auto-imported
- 📦 **TypeScript Support** - Full TypeScript support with type definitions
- ⚡ **Nuxt 3 & 4 Compatible** - Works with Nuxt 3.x and 4.x

## Quick Setup

1. Install the module to your Nuxt application:

```bash
npm install @nhealthorg/nutils
```

2. Add `@nhealthorg/nutils` to the `modules` section of `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nhealthorg/nutils'
  ]
})
```

That's it! You can now use all components, composables, and utilities in your Nuxt app ✨

## Usage

### Components

Components are automatically registered and can be used in any template:

```vue
<template>
  <div>
    <NUtilsHello />
    <NUtilsHello 
      title="Custom Title" 
      message="Custom message"
    />
  </div>
</template>
```

### Composables

Composables are auto-imported and available throughout your app:

```vue
<script setup>
const { count, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### Utilities

Utility functions are auto-imported:

```vue
<script setup>
const date = formatDate(new Date())
const number = formatNumber(1234567.89)
const text = truncate('Long text...', 20)
</script>
```

## Module Options

You can configure the module in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@nhealthorg/nutils'],
  nutils: {
    enabled: true // Enable or disable the module
  }
})
```

## Available Exports

### Components

- `NUtilsHello` - Example hello component

### Composables

- `useCounter(initialValue?)` - Counter state management composable

### Utilities

- `formatDate(date, locale?)` - Format dates to readable strings
- `formatNumber(num, locale?)` - Format numbers with thousand separators
- `truncate(str, maxLength?, suffix?)` - Truncate strings

## Development

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

# Release new version
npm run release
```

### Adding New Features

#### Components

Add `.vue` files to `src/runtime/components/` - they'll be auto-registered.

#### Composables

Add `.ts` files to `src/runtime/composables/` - they'll be auto-imported.

#### Utilities

Add `.ts` files to `src/runtime/utils/` - they'll be auto-imported.

## License

MIT