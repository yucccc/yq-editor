<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { StateConfigType } from 'activity-components/dist/components/state-btn/types'
const stateObj: StateConfigType = {
  key: '',
  text: '',
  imgSrc: '',
  isNeedGrayClass: false,
  disabled: false,
  actionConfig: { type: '' },
}

export default defineComponent({
  name: 'StateSet',
  components: {
  },
  props: {
    value: {
      type: Array as PropType<StateConfigType[]>,
      require: true,
      default: () => [cloneDeep(stateObj)],
    },
    modalVisible: Boolean,
    componentsProps: Object,
  },
  emits: ['submit', 'cancel', 'change-type'],
  setup(props, ctx) {
    const stateConfigArr = reactive<StateConfigType[]>(
      props.value.length ? props.value : [cloneDeep(stateObj)],
    )
    const addState = () => {
      stateConfigArr.push(cloneDeep(stateObj))
    }
    const deleteState = (index: number) => {
      stateConfigArr.splice(index, 1)
    }

    const submit = () => {
      ctx.emit('submit', stateConfigArr)
    }
    const cancel = () => {
      ctx.emit('cancel')
    }
    return {
      stateConfigArr,
      addState,
      deleteState,
      submit,
      cancel,
    }
  },
})
</script>

<template>
  <a-button class="mb-10" @click="addState">
    增加新状态配置
  </a-button>
  <a-card v-for="(config, index) in stateConfigArr" :key="index" class="card">
    <a-form :model="config">
      <a-form-item required label="状态名" name="text">
        <a-input v-model:value="config.text" />
      </a-form-item>

      <a-form-item required label="状态key" name="key">
        <a-input v-model:value="config.key" />
      </a-form-item>
    </a-form>

    <a-row class="row">
      <a-col :span="6">
        <span class="label">命中状态图片显示</span>
      </a-col>
      <a-col :span="18">
        <ImageProcessor v-model:value="config.imgSrc" />
      </a-col>
    </a-row>

    <a-row class="row">
      <a-col :span="6">
        <span class="label">是否置灰</span>
      </a-col>
      <a-col :span="18">
        <a-switch v-model:checked="config.isNeedGrayClass" />
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="6">
        <span class="label">是否不可点击</span>
      </a-col>
      <a-col :span="18">
        <a-switch v-model:checked="config.disabled" />
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col>
        <modal-button
          v-model:value="config.actionConfig"
        />
      </a-col>
    </a-row>
    <a-button danger @click="deleteState(index)">
      删除该状态配置
    </a-button>
  </a-card>
  <a-row align="middle">
    <a-col :span="4" :offset="4">
      <a-button type="primary" @click="submit">
        保存
      </a-button>
    </a-col>
    <a-col>
      <a-button style="margin-left: 10px" @click="cancel">
        取消
      </a-button>
    </a-col>
  </a-row>
</template>

<style scoped>
.card {
  margin-bottom: 10px;
}

.row {
  margin-bottom: 10px;
}
</style>
