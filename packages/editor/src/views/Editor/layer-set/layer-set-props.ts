import type { ActionSetType } from '../ActionSet.vue'
export interface LayerCommitType {
  status: 'show' | 'hide' | 'toggle'
  actionCid: string
  nextStep: ActionSetType
}