<script lang="ts" setup>
import ActList from './index.vue'
const sourceData = [
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
]
const arrange = [
  { key: 'a', style: { width: '100px' } },
  { key: 'b', style: JSON.stringify({ width: '200px' }) },
  { key: 'c' },
]
</script>

<template>
  <ActList
    :source-data="sourceData"
    :arrange="arrange"
    height="100px"
  />
</template>

<style scoped>

</style>
