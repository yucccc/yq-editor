<script lang="ts" setup>
import type { FormConfig } from '@yq-editor/global-types'
import { message } from 'ant-design-vue'
import DynamicForm from '@/components/DynamicForm.vue'
import { useUserStore } from '@/store/user'
import router from '@/router'
const userStore = useUserStore()
const formItemConfig: Record<string, FormConfig> = {
  name: {
    label: 'github名称',
    formItemProps: {
      required: true,
    },
    tips: '随便填写一个存在的GitHub用户名即可成功登陆',
  },
}
const value = {}
const submit = (value: { name: string }) => {
  userStore.fetchCurrentUser(value).then((res) => {
    router.back()
  }).catch((err) => {
    message.error(err.message)
  })
}
</script>

<template>
  <div class="container-login">
    <DynamicForm class="w60% m-auto pt-10%" :value="value" :form-item-config="formItemConfig" sub-text="登陆" @submit="submit" />
  </div>
</template>

<style lang="less">
  .container-login {
    background-image: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg");
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    width: 100%;
    margin: 0;
    height: 100% ;
  }
</style>