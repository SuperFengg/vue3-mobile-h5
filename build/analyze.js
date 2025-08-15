/**
 * 性能分析脚本
 */

import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 分析构建结果
async function analyzeBuild() {
  try {
    console.log('🔍 开始构建分析...')

    // 构建并生成分析数据
    const result = await build({
      configFile: resolve(__dirname, '../vite.config.js'),
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // 将第三方库分离
              vendor: ['vue', 'vue-router', 'pinia'],
              vant: ['vant'],
              utils: ['axios', 'lib-flexible']
            }
          }
        }
      }
    })

    console.log('✅ 构建完成')

    // 生成分析报告
    generateAnalysisReport(result)

  } catch (error) {
    console.error('❌ 构建分析失败:', error)
    process.exit(1)
  }
}

// 生成分析报告
function generateAnalysisReport(buildResult) {
  const report = {
    timestamp: new Date().toISOString(),
    buildTime: Date.now(),
    chunks: [],
    assets: [],
    summary: {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      chunkCount: 0
    }
  }

  // 分析构建结果
  if (buildResult && buildResult.output) {
    buildResult.output.forEach(chunk => {
      if (chunk.type === 'chunk') {
        report.chunks.push({
          name: chunk.fileName,
          size: chunk.code ? chunk.code.length : 0,
          modules: chunk.modules ? Object.keys(chunk.modules).length : 0
        })
        report.summary.chunkCount++
        report.summary.jsSize += chunk.code ? chunk.code.length : 0
      } else if (chunk.type === 'asset') {
        report.assets.push({
          name: chunk.fileName,
          size: chunk.source ? chunk.source.length : 0
        })

        if (chunk.fileName.endsWith('.css')) {
          report.summary.cssSize += chunk.source ? chunk.source.length : 0
        } else if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(chunk.fileName)) {
          report.summary.imageSize += chunk.source ? chunk.source.length : 0
        }
      }
    })
  }

  report.summary.totalSize = report.summary.jsSize + report.summary.cssSize + report.summary.imageSize

  // 保存报告
  const reportPath = resolve(__dirname, '../dist/build-analysis.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))

  // 打印摘要
  console.log('\n📊 构建分析报告:')
  console.log(`📦 总大小: ${formatSize(report.summary.totalSize)}`)
  console.log(`📄 JS 大小: ${formatSize(report.summary.jsSize)}`)
  console.log(`🎨 CSS 大小: ${formatSize(report.summary.cssSize)}`)
  console.log(`🖼️ 图片大小: ${formatSize(report.summary.imageSize)}`)
  console.log(`🧩 代码块数量: ${report.summary.chunkCount}`)
  console.log(`📋 详细报告已保存到: ${reportPath}`)

  // 性能建议
  provideSuggestions(report)
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 提供性能建议
function provideSuggestions(report) {
  console.log('\n💡 性能优化建议:')

  const { totalSize, jsSize, cssSize } = report.summary

  if (totalSize > 1024 * 1024) { // 1MB
    console.log('⚠️ 总包大小较大，建议进行代码分割和懒加载')
  }

  if (jsSize > 512 * 1024) { // 512KB
    console.log('⚠️ JS 文件较大，建议分离第三方库和按需加载')
  }

  if (cssSize > 100 * 1024) { // 100KB
    console.log('⚠️ CSS 文件较大，建议移除未使用的样式')
  }

  if (report.chunks.length > 10) {
    console.log('⚠️ 代码块数量较多，可能影响加载性能')
  }

  console.log('✅ 建议使用 gzip 压缩减小传输大小')
  console.log('✅ 建议配置 CDN 加速静态资源加载')
}

// 执行分析
analyzeBuild()
