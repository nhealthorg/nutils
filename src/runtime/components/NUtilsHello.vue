<template>
  <div class="nutils-hello">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Hello from NUtils',
  message: 'This is a shared component from the @nhealthorg/nutils module'
})
</script>

<style scoped>
.nutils-hello {
  padding: 1rem;
  border: 2px solid #00dc82;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
}

.nutils-hello h2 {
  color: #00dc82;
  margin-top: 0;
}

.nutils-hello p {
  color: #333;
}
</style>
