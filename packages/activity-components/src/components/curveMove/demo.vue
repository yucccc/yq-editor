<script>
import CurveNove from './index.vue'
export default {
  name: 'CurveMove',
  components: {
    CurveNove,
  },
  props: {},
  data() {
    return {
      curveMoveMsg: {
        peopleImg: '//dl.ckhdvt.com/hd_activities/vn_silkRoad/cdn/hot/img/boat.2a717521.png',
        speed: 200,
        cricle: 2,
        isInit: true,
        people: {
          left: 75,
          top: 53,
          moveLeft: [61, 40, 27, 15, 16, 35, 48, 64],
          moveTop: [58, 55, 46, 35, 9, 24, 14, 32],
        },
      },
      count: 0,
    }
  },
  computed: {},
  watch: {},
  methods: {
    fn() {
      const number = parseInt(Math.random() * 6)
      // console.log(this.$refs.curveMove)
      this.$refs.curveMove.play(number, this.count)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<template>
  <div class="moveArea">
    <CurveNove ref="curveMove" :curve-move-msg="curveMoveMsg" />
    <button @click="fn">
      移动抽奖
    </button>
  </div>
</template>

<style lang="less">
.moveArea {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
