import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// 解析 Vite 配置：当 Vite 配置导出为函数时，需在测试模式下先执行得到对象
const baseViteConfig = typeof viteConfig === 'function' ? viteConfig({ mode: 'test' }) : viteConfig

export default mergeConfig(
  baseViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: ['./src/utils/test-setup.js'],
      deps: {
        inline: [/^vant\//, /vant/]
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/utils/test-utils.js',
          'src/utils/test-setup.js',
          '**/*.spec.js',
          '**/*.test.js',
          'build/',
          'dist/',
          'cypress/'
        ]
      }
    },
  }),
)
