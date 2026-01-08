<template>
  <div>
    <h1>NUtils Module Playground</h1>
    
    <section>
      <h2>Component Example</h2>
      <NUtilsHello />
      <NUtilsHello 
        title="Custom Title" 
        message="This demonstrates component customization"
      />
    </section>

    <section>
      <h2>Composable Example (useCounter)</h2>
      <div>
        <p>Count: {{ count }}</p>
        <p>Double: {{ double }}</p>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
        <button @click="reset">Reset</button>
      </div>
    </section>

    <section>
      <h2>Utilities Example</h2>
      <div>
        <p>Formatted Date: {{ formattedDate }}</p>
        <p>Formatted Number: {{ formattedNumber }}</p>
        <p>Truncated Text: {{ truncatedText }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// The composable is auto-imported from the module
const { count, double, increment, decrement, reset } = useCounter(0)

// The utilities are auto-imported from the module
const formattedDate = formatDate(new Date())
const formattedNumber = formatNumber(1234567.89)
const truncatedText = truncate('This is a very long text that needs to be truncated for display purposes', 30)
</script>

<style scoped>
section {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #00dc82;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background-color: #00b96b;
}
</style>
