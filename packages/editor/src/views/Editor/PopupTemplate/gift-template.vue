<script lang="ts" setup>
interface Props {
  sourceData: any[]
  arrange: { key: string }[]
}
const props = withDefaults(defineProps<Props>(), {
  sourceData: () => [],
  arrange: () => [],
})
</script>

<template>
  <div class="gift-list">
    <div
      v-for="(item, index) in sourceData"
      :key="index"
      :class="sourceData.length > 1 ? 'item ten' : 'item one'"
    >
      <div v-for="(tep, i) in arrange" :key="i" class="tep">
        <img :src="item[tep.key]" alt="">
      </div>
    </div>
  </div>
</template>

<style lang="less">
.gift-list {
  display: flex;
  flex-wrap: wrap;
  max-height: 100%;
  align-items: center;
  justify-content: center;
  overflow: auto;
  .item,
  .tep {
    display: inline-block;
  }
  .item {
    margin: 1%;
    img {
      width: 100%;
    }
  }
  .ten {
    flex: 17% 1;
  }
  .one {
    width: 50%;
  }
}
</style>
