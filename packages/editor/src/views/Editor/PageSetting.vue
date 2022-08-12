<script lang="ts" setup>
import { computed } from 'vue'
import { useEditorStore } from '@/store/editor'
import PropertiesPanel from '@/components/PropertiesPanel.vue'
const store = useEditorStore()
const page = computed(() => store.page)
const handleChangePageProps = ({ key, value }) => {
  store.updatePage(`page.props.${key}`, value)
}
const handleChangePage = ({ key, value }) => {
  store.updatePage(`page.${key}`, value)
}
</script>

<template>
  <PropertiesPanel :properties="page.props" @change="handleChangePageProps" />
  <PropertiesPanel
    :properties="{ thirdSetting: page.thirdSetting }"
    @change="handleChangePage"
  />
  <PropertiesPanel
    :properties="{ baseSetting: page.baseSetting }"
    @change="handleChangePage"
  />
</template>

<style scoped lang="less"></style>
