<script lang="ts" setup>
import { reactive } from 'vue'
import ActStateBtnDemo from '@/components/state-btn/demo.vue'
import ListDemo from '@/components/list/demo.vue'
import NiceDraw from '@/components/track/demo.vue'
import Turntable from '@/components/turntable/demo.vue'
import Egg from '@/components/egg/demo.vue'
import CurveMove from '@/components/curveMove/demo.vue'
import Magnifier from '@/components/magnifier/demo.vue'
</script>

<template>
  <h2>list组件</h2>
  <ListDemo />
  <h2>状态组件</h2>
  <ActStateBtnDemo />
  <h2>轨道组件</h2>
  <NiceDraw />

  <div style="height: 400px">
    <Turntable />
  </div>
  <div style="height: 400px">
    <Egg />
  </div>

  <div style="height: 400px">
    <CurveMove />
  </div>

  <div style="height: 300px">
    <Magnifier />
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
