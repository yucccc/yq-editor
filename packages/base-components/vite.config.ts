import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://github.com/qmhc/vite-plugin-dts  导出.d.ts 文件
import dts from 'vite-plugin-dts'

// https://github.com/wheatjs/vite-plugin-vue-type-imports 支持导入typescript
// import VueTypeImports from 'vite-plugin-vue-type-imports'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5180,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'baseComponents',
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
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    // VueTypeImports(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      cleanVueFileName: true,
    }),
  ],
})
