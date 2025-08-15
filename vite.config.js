import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  let isProd = mode === 'production'
  // isProd = false

  return {
    plugins: [
      vue(),
      vueJsx(),
      // 仅开发环境启用 DevTools，避免生产体积与潜在告警
      !isProd && vueDevTools(),
      legacy({
        targets: ['chrome >= 88'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: true,
        renderLegacyChunks: true
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      // 移除 build.target，避免与 legacy 插件的 targets 冲突导致告警
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vant: ['vant'],
            axios: ['axios']
          }
        }
      },
      // 放宽告警阈值，结合手动分包降低黄色告警干扰
      chunkSizeWarningLimit: 1200
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";`,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions']
        }
      }
    }
  }
})
