/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/qmhc/vite-plugin-dts  导出.d.ts 文件
import dts from 'vite-plugin-dts'

// https://github.com/wheatjs/vite-plugin-vue-type-imports 支持导入typescript 目前在vite3.0会报错 先使用2.9.9
import VueTypeImports from 'vite-plugin-vue-type-imports'

export default defineConfig({
  css: {
    // 全局cc变量
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve('src/styles/variables.less')}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 9994,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'activityComponents',
    },

    rollupOptions: {
      // 排除vue
      external: [
        'vue',
      ],
      output: {
        exports: 'named',
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    VueTypeImports(),
    // 编辑typescript
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      cleanVueFileName: true,
    }),
  ],
  test: { },
})

