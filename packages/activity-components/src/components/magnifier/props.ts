import type { PropType } from 'vue'

export const runnerProps = {
  giftImgs: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    },
  },
  iconWidth: {
    default: '50px',
    type: [String, Number],
  },
  runningTime: {
    default: 4,
    type: Number,
  },
  minTurns: { default: 5, type: Number },
  iconW: { default: 60, type: Number },
  unit: { default: 'px', type: String },
  scale: {
    default: 1.4,
    type: Number,
  },
  CALLBACK: {
    type: [Function, Object],
  },
}
