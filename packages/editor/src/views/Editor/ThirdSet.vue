<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive, watch } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'
import share from '@/config/third/share'
import login from '@/config/third/login'
import type { SettingType } from '@/store/editor'
const mapList: any = {
  ...share,
  ...login,
}
// TODO: 待考虑
export default defineComponent({
  name: 'ThirdSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<SettingType>,
      require: true,
    },
    modalVisible: Boolean,
  },
  emits: ['submit', 'cancel', 'change-type'],
  setup(props, ctx) {
    const state = reactive({
      currentKey: 'facebookShare',
    })

    const currentValue = computed(() => {
      // @ts-expect-error
      const c = props.value[state.currentKey]
      if (state.currentKey) {
        if (c) {
          return c
        }
        else {
          return {
            key: state.currentKey,
            text: mapList[state.currentKey].text.label,
          }
        }
      }
      else {
        return {}
      }
    })
    const currentConfig = computed(() => {
      if (state.currentKey) { return mapList[state.currentKey] }
      return {}
    })

    const checkCurrent = (key: string) => {
      state.currentKey = key
    }

    const submit = (e: any) => {
      // 保存时候只保存页面当前停留的设置
      ctx.emit('submit', {
        [e.key]: e,
      })
    }
    const cancel = () => {
      ctx.emit('cancel')
    }
    return {
      share,
      state,
      mapList,
      checkCurrent,
      currentConfig,
      currentValue,
      login,
      submit,
      cancel,
    }
  },
})
</script>

<template>
  <a-row :style="{ marginBottom: '10px' }">
    <a-col :span="4">
      第三方分享
    </a-col>
    <a-col :span="20">
      <a-button
        v-for="(key, i) in Object.keys(share)"
        :key="i"
        :type="key === state.currentKey ? 'primary' : 'default'"
        @click="checkCurrent(key)"
      >
        {{ share[key].text.label }}
      </a-button>
    </a-col>
  </a-row>
  <a-row :style="{ marginBottom: '10px' }">
    <a-col :span="4">
      第三方登陆
    </a-col>
    <a-col :span="20">
      <a-button
        v-for="(key, i) in Object.keys(login)"
        :key="i"
        :type="key === state.currentKey ? 'primary' : 'default'"
        @click="checkCurrent(key)"
      >
        {{ login[key].text.label }}
      </a-button>
    </a-col>
  </a-row>
  <div v-if="state.currentKey">
    <DynamicForm
      :form-item-config="currentConfig"
      :value="currentValue"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped></style>
