<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import type { FormConfig } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
import { getCdnList } from '@/api/index'
import { testUserInfo } from '@/config/testData'
import type { PreSettingType } from '@/store/editor'

export interface SettingType {
  // 区服id
  serverId: string
  // 角色id
  roleId: string
  // 用户id
  userId: string
  // 游戏id
  appId: string
  // 子游戏id
  subAppId: string
  // 渠道id
  channelId: string
  // fromArea
  fromArea: string
  // 设备id
  deviceId: string
}

export default defineComponent({
  name: 'PreSetting',
  components: {
    DynamicForm,
  },
  props: {
    cdnSn: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'create',
    },
    settingModalVisible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['confirm', 'cancel', 'update:visible'],
  setup(props: any, ctx) {
    const settingConfig: { [key in keyof SettingType]: FormConfig } = {
      serverId: {
        label: '区服ID（serverId）',
      },
      roleId: {
        label: '角色ID（roleId）',
      },
      userId: {
        label: '用户ID（userId）',
      },
      appId: {
        label: '游戏ID（appId）',
      },
      subAppId: {
        label: '子游戏ID（subAppId）',
      },
      channelId: {
        label: '渠道ID（channelId）',
      },
      fromArea: {
        label: 'fromArea（fromArea）',
      },
      deviceId: {
        label: '设备ID（deviceId）',
      },
    }
    const state = reactive({
      settingModalVisible: props.settingModalVisible,
      shortName: '',
      cdnList: [],
      cdnUrl: '',
    })
    // 获取cdn列表
    getCdnList().then((res) => {
      state.cdnList = res.data.list || []
      state.shortName = props.cdnSn || res.data.list[0].shortName
      state.cdnUrl = props.cdnUrl || res.data.list[0].cdn
    })

    const filterOption = (input: string, option: any) => {
      return (
        option.children[0].children
          .toLowerCase()
          .includes(input.toLowerCase())
      )
    }
    const currentTestUserInfoKey = ref('')
    const stateValue = reactive({ value: props.value })

    watch(currentTestUserInfoKey, (nv) => {
      stateValue.value = testUserInfo.filter(
        (item: any) => item.label === nv,
      )[0].value
    })

    const handleChange = (val: string, option: any) => {
      state.cdnUrl = option.cdnUrl
      state.shortName = val
    }

    const onSubmit = (val: SettingType) => {
      const obj: PreSettingType = {
        shortName: '',
        userInfo: {},
        cdnUrl: '',
        cdnSn: '',
      }
      obj.shortName = state.shortName
      obj.cdnUrl = state.cdnUrl
      obj.userInfo = val

      ctx.emit('confirm', obj)
      ctx.emit('update:visible', false)
    }
    const onCancel = () => {
      ctx.emit('cancel')
      ctx.emit('update:visible', false)
    }
    return {
      state,
      settingConfig,
      filterOption,
      handleChange,
      onSubmit,
      onCancel,
      stateValue,
      testUserInfo,
      currentTestUserInfoKey,
    }
  },
})
</script>

<template>
  <a-modal
    v-model:visible="state.settingModalVisible"
    class="setting"
    title="区服参数设置"
    width="600px"
    footer=""
    @cancel="onCancel"
  >
    <a-divider>CDN地址</a-divider>
    <a-select
      show-search
      option-filter-prop="label"
      :filter-option="filterOption"
      style="width: 100%"
      placeholder="CDN地址"
      :value="state.shortName"
      @change="handleChange"
    >
      <a-select-option
        v-for="item in state.cdnList"
        :key="item.name"
        :value="item.shortName"
        :cdn-url="item.cdn"
      >
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-divider>登录信息（用于测试）</a-divider>
    <a-row class="mb-10">
      <a-col :span="7">
        测试账号列表
      </a-col>
      <a-col>
        <a-select v-model:value="currentTestUserInfoKey" style="width: 300px">
          <a-select-option
            v-for="item in testUserInfo"
            :key="item.label"
            :value="item.label"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <DynamicForm
      :form-item-config="settingConfig"
      :value="stateValue.value"
      :label-col="{ span: 7 }"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </a-modal>
</template>

<style lang="less">
.setting {
  .ant-modal-body {
    padding-top: 0;
  }
}
</style>
