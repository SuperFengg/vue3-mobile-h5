/**
 * 开发服务器配置
 */

import { createServer } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 开发服务器选项
const serverOptions = {
  host: '0.0.0.0',
  port: 3000,
  open: true,
  cors: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}

// 创建开发服务器
async function createDevServer() {
  try {
    const server = await createServer({
      configFile: resolve(__dirname, '../vite.config.js'),
      server: serverOptions
    })

    await server.listen()
    server.printUrls()

    console.log('\n🚀 开发服务器启动成功!')
    console.log('📱 移动端预览: 请使用手机扫描二维码或访问网络地址')

  } catch (error) {
    console.error('❌ 开发服务器启动失败:', error)
    process.exit(1)
  }
}

// 启动开发服务器
createDevServer()
