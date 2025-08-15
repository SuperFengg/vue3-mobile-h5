/**
 * 构建脚本入口
 */

import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 构建配置
const buildConfigs = {
  development: {
    mode: 'development',
    build: {
      sourcemap: true,
      minify: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name].js',
          entryFileNames: 'js/[name].js',
          assetFileNames: '[ext]/[name].[ext]'
        }
      }
    }
  },

  production: {
    mode: 'production',
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
}

// 获取构建模式
const mode = process.argv[2] || 'production'
const config = buildConfigs[mode]

if (!config) {
  console.error(`Unknown build mode: ${mode}`)
  process.exit(1)
}

console.log(`Building for ${mode}...`)

// 执行构建
build({
  configFile: resolve(__dirname, '../vite.config.js'),
  ...config
}).then(() => {
  console.log(`Build completed for ${mode}`)
}).catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
