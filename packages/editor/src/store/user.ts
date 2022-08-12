import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import { removeURLParameter } from '@/shared'
import { getUserInfoApi } from '@/api/user'
export interface UserDataProps {
  'login': string
  'id': number
  'node_id': string
  'avatar_url': string
  'gravatar_id': string
  'url': string
  'html_url': string
  'followers_url': string
  'following_url': string
  'gists_url': string
  'starred_url': string
  'subscriptions_url': string
  'organizations_url': string
  'repos_url': string
  'events_url': string
  'received_events_url': string
  'type': 'User'
  'site_admin': boolean
  'name': string
  'company': string
  'blog': string
  'location': string
  'email': string
  'hireable': boolean
  'bio': string
  'twitter_username': string
  'public_repos': number
  'public_gists': number
  'followers': number
  'following': number
  'created_at': string
  'updated_at': string
  'private_gists': number
  'total_private_repos': number
  'owned_private_repos': number
  'disk_usage': number
  'collaborators': number
  'two_factor_authentication': boolean
  'plan': {
    'name': string
    'space': number
    'private_repos': number
    'collaborators': number
  }
}
export interface UserProps {
  data: UserDataProps | null
}

export const useUserStore = defineStore('user', {
  state: (): UserProps => ({
    data: null,
  }),
  actions: {
    // 获取当前用户
    async fetchCurrentUser(params: { name: string }) {
      const res = await getUserInfoApi(params)
      this.data = res.data
    },
  },
  persist: true,
})

