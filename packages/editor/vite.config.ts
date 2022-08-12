/// <reference types="vitest" />

import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {},
  server: {
    port: 9990,
    proxy: {
      '/api': 'http://0.0.0.0:9993',
      '/_mock': 'http://0.0.0.0:9993',
    },
    open: true,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../../dist',
  },
  plugins: [
    vue(),
    Components({
      // 组件库按需加载
      resolvers: [
        VantResolver(),
      ],
    }),
    vueJsx(),
    monacoEditorPlugin({}),
    Unocss(),
  ],
})
