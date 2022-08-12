<script lang="ts">
import type { PropType } from 'vue'
import { computed, reactive } from 'vue'
import type { ActionSetType } from './ActionSet.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import { useEditorStore } from '@/store/editor'

const fbShareConfig = {
  // shareUrl: {
  //   label: '分享页面地址',
  //   props: { disabled: true },
  // },
  nextStep: {
    label: '下一步',
    component: 'modal-button',
    props: {
      btnProps: {
        slot: '设置交互',
      },
      modalProps: {
        slot: 'action-set',
        isComponent: true,
        componentsProps: { hasDataFlow: true },
      },
    },
  },
}
export interface facebookShareCommitType {
  shareUrl: string
  nextStep: ActionSetType
  code: string
}
export default {
  name: 'UrlSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<facebookShareCommitType>,
      default: () => ({}),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: any, ctx: any) {
    const store = useEditorStore()
    const preSetting = computed(() => store.preSetting)
    const isFacebookShareUsing = computed(() => store.page?.thirdSetting?.facebookShare?.isUsing || false)

    const formValue = reactive({ ...props.value })
    if (!formValue.shareUrl) { formValue.shareUrl = `${preSetting.value.cdnUrl}/osstest/${preSetting.value.workId}-${preSetting.value.uuid}/jump.html` }

    const onSubmit = (value: facebookShareCommitType) => {
      const newValue = { ...value }
      if (!newValue.code) {
        newValue.code = `
          function fn(props) {
                FB.ui(
                    {
                        method: 'share',
                        href: '${newValue.shareUrl}', //分享的链接
                    },
                    function(response){
                        // 仅仅安卓成功分享会执行此回调
                    }
                )
            }
          `
      }
      ctx.emit('submit', newValue)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      formValue,
      onCancel,
      onSubmit,
      fbShareConfig,
      isFacebookShareUsing,
    }
  },
}
</script>

<template>
  <div v-show="!isFacebookShareUsing" class="warn">
    警告：页面设置的第三方设置未开启facebook分享，此交互不起作用
  </div>
  <DynamicForm :form-item-config="fbShareConfig" :value="formValue" @submit="onSubmit" @cancel="onCancel" />
</template>

<style scoped lang="less">
.warn {
  color: #faad14;
  padding-bottom: 10px;
}
</style>
