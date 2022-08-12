import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '@/store/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import('../views/Editor.vue'),
    meta: { requiredLogin: true, title: '编辑我的设计' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiredLogin: false, title: '登陆' },
  },
  {
    path: '/myWork',
    name: 'myWork',
    component: () => import('../views/MyWork.vue'),
    meta: { requiredLogin: true, title: '我的作品' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const u = useUserStore()
  const { requiredLogin } = to.meta
  // 不存在信息就跳转到登录页
  if (!u.data && requiredLogin) {
    router.push('/lgoin')
  }
})

export default router
