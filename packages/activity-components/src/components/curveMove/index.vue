<script>
export default {
  name: 'CurveMove',
  components: {},
  props: {
    curveMoveMsg: {
      type: Object,
      default: () => {
        return {
          speed: 200,
          cricle: 2,
        }
      },
    },
    moveStop: {
      type: Function,
    },
  },
  data() {
    return {
      left: this.curveMoveMsg.people.left,
      top: this.curveMoveMsg.people.top,
    }
  },
  computed: {},
  watch: {},
  methods: {
    play(number, count) {
      let cricleNum = 0
      const { people, cricle, isInit } = this.curveMoveMsg
      let { left, top } = people
      const len = this.curveMoveMsg.people.moveLeft.length

      if (isInit) {
        left = this.peopleInit.left
        top = this.peopleInit.top
        /* eslint-disable */
        this.curveMoveMsg.people.top = top
        this.curveMoveMsg.people.left = left
      }
      let counts = count || 0
      let timer = setInterval(() => {
        this.curveMoveMsg.people.left =
          this.curveMoveMsg.people.moveLeft[counts]
        this.curveMoveMsg.people.top = this.curveMoveMsg.people.moveTop[counts]
        if (counts == number && cricleNum / len >= cricle) {
          clearInterval(timer)
          setTimeout(() => {
            this.$props.moveStop(number)
          }, 500)
          return
        }
        cricleNum++
        counts++
        if (counts > len - 1) counts = 0
      }, this.curveMoveMsg.speed)
    },
  },
  created() {},
  // mounted() {},
}
</script>
<!--
    不规则移动抽奖
    moveStop  人物停止时触发的方法
    play(num,count)  num：人物需要停止下标 count：上一次的结束位置
    curveMoveMsg={           组件参数
    peopleImg:string ,       人物的图片
    speed:300,               人物移动速度   (定时器速度)
    cricle:1                  自定义圈数
    counts：0                  索引
    people:{                 人物移动参数
      left:10,               人物初始位置left   (单位为百分比)
      top:20,                人物初始位置top    (单位为百分比)
      moveLeft:[],           距离左边位置   (单位为百分比)
      moveTop:[],            距离上边位置     (单位为百分比)
    }
    cricleNum                圈数标识
  }
-->

<template>
  <div class="moveArea">
    <div
      class="moveImg"
      :style="{
        left: `${curveMoveMsg.people.left || 0}%`,
        top: `${curveMoveMsg.people.top || 0}%`,
      }"
    >
      <img :src="curveMoveMsg.peopleImg" alt="" />
    </div>
  </div>
</template>
<style lang="less">
.moveArea {
  width: 100%;
  height: 100%;
}
.curve-move {
  position: relative;
  width: 40vw;
  height: 30vw;
  background: url('http://lsfz-dl.hnjieao.cn/boat_bg.png') no-repeat;
  background-size: 100% 100%;
}
.moveImg {
  position: absolute;
  width: 15%;
  left: 1%;
  top: 1%;
  transition: all 0.3s;
}
</style>
