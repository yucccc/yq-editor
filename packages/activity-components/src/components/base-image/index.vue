<script lang="ts" setup>
import { Props } from './props'
defineProps(Props)
</script>

<script lang="ts">
export default {
  name: 'ActBaseImage',
}
</script>

<template>
  <img
    class="act-base-image"
    :src="src"
    :alt="alt"
    :draggable="false"
  >
</template>

<style lang="less">
.act-base-image {
  display: block;
  width: 100%;
}
</style>
