<script lang="ts">
import { defineComponent } from 'vue'
// 手机壳子
export default defineComponent({
  name: 'PhoneView',
  props: {
    url: {
      type: String,
    },
    teleport: String,
    title: String,
    style: Object,
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <teleport :to="teleport" :disabled="!teleport">
    <div class="final-preview-inner" :style="style">
      <div class="preview-title">
        {{ title }}
      </div>
      <div id="phone-view-container">
        <slot>
          <iframe
            :src="url"
            width="375"
            class="iframe-placeholder"
            height="700px"
          />
        </slot>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="less">
.final-preview-inner {
  position: relative;
  background: url('../assets/iphone_x.png') no-repeat;
  background-size: cover;
  width: 435px;
  height: 864px;
  z-index: 99999;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -60%);
  #phone-view-container {
    min-width: 375px;
    min-height: 700px;
    transform: matrix(1, 0, 0, 1, 0, 0);
    left: 30px;
    top: 100px;
    position: absolute;
  }
}

.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
  top: 56px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.iframe-placeholder {
  /*background: url('~@/assets/loading.svg') 50% 50% no-repeat;*/
  background-size: 50px;
  border: none;
}
</style>
