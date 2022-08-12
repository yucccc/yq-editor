<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import defaultAvatar from '../assets/avatar.png'
import { createWorkApi } from '@/api/works'
import PreSetting from '@/components/PreSetting.vue'
import { useUserStore } from '@/store/user'
import { useEditorStore } from '@/store/editor'

export default defineComponent({
  name: 'MyHeader',
  components: {
    PreSetting,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userInfo = useUserStore()
    const eStore = useEditorStore()
    const workId = route.params.id
    const preSetting = computed(() => eStore.preSetting)
    const login = () => {
      router.push('/login')
    }
    const state = reactive({
      settingModalVisible: false,
      mode: 'create',
    })
    const onCancel = () => {
      state.settingModalVisible = false
    }
    const onConfirm = (result: any) => {
      state.settingModalVisible = false
      result.cdnSn = result.shortName
      if (state.mode === 'create') {
        createWorkApi({
          content: {
            baseSetting: {
              title: `作品${Date.now()}`,
              description: '作品描述',
            },
          },
        })
          .then((res) => {
            router.push({
              path: `/editor/${res.data._id}`,
              query: result.userInfo,
            })
            // 创建成功 清楚上一个模板vuex信息
            eStore.resetEditorState()
            // 存入信息
            result.workId = res.data._id
            eStore.updatePreSetting(result)
          })
          .catch((err) => {
            console.log(`创建失败${JSON.stringify(err)}`)
          })
      }
      else {
        router.push({
          query: result.userInfo,
        })
        result.workId = workId
        eStore.updatePreSetting(result)
      }
    }
    const updateWork = async () => {
      state.settingModalVisible = true
      state.mode = 'update'
    }
    const createWork = async () => {
      state.settingModalVisible = true
      state.mode = 'create'
    }
    const logout = async () => {
      localStorage.removeItem('user')
      router.push('/login')
    }
    return {
      workId,
      userInfo,
      preSetting,
      login,
      createWork,
      updateWork,
      state,
      onCancel,
      onConfirm,
      logout,
      defaultAvatar,
    }
  },
})
</script>

<template>
  <a-layout>
    <a-layout-header class="header">
      <router-link to="/">
        yq-editor
      </router-link>
      <div class="right">
        <slot name="right" />
        <template v-if="userInfo.data">
          <div>
            <a-button size="large" @click="createWork">
              创建作品
            </a-button>
          </div>

          <div>
            <router-link key="myWork" to="/myWork">
              <a-button size="large">
                我的作品
              </a-button>
            </router-link>
          </div>
        </template>
        <template v-if="workId">
          <div>
            <a-button size="large" @click="updateWork">
              修改登录信息
            </a-button>
          </div>
        </template>
        <div>
          <a-dropdown v-if="userInfo.data" placement="bottom">
            <a class="ant-dropdown-link" @click.prevent>
              <a-avatar :src=" userInfo.data.avatar_url || defaultAvatar" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="logout">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <router-link v-else to="/login">
            <a-button>
              登陆
            </a-button>
          </router-link>
        </div>
      </div>
    </a-layout-header>
    <PreSetting
      v-if="state.settingModalVisible"
      v-model:visible="state.settingModalVisible"
      :mode="state.mode"
      :value="state.mode === 'update' && preSetting && preSetting.userInfo ? preSetting.userInfo : {}"
      :cdn-sn="state.mode === 'update' && preSetting ? preSetting.cdnSn : ''"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </a-layout>
</template>

<style lang="less">
.ant-layout-header.header {
  background-color: #fff;
  border-bottom: 1px solid #eef2f8;
  padding: 0 16px;
}
.header {
  color: #fff;
  display: flex;
  justify-content: space-between;
  .logo {
    img {
      width: 40px;
    }
  }
}
.right {
  display: flex;

  > div {
    margin: 0 8px;
    align-items: center;
  }
}
.ant-dropdown-link {
  display: inline-block;
}
</style>
