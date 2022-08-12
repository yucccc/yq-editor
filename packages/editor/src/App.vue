<script lang="ts" setup>
import locale from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<style>
:root {
  font-size: calc(0.5em + 1vw);
}
body, html, #app {
  height: 100%;
}
</style>
