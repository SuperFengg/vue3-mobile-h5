/**
 * 项目优化建议脚本
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { resolve, extname } from 'path'

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
  tip: (msg) => console.log(`${colors.cyan}💡 ${msg}${colors.reset}`)
}

// 分析项目结构
function analyzeProjectStructure() {
  log.info('分析项目结构...')

  const analysis = {
    totalFiles: 0,
    fileTypes: {},
    largeFiles: [],
    emptyDirs: []
  }

  function analyzeDir(dir, basePath = '') {
    try {
      const files = readdirSync(dir)

      if (files.length === 0) {
        analysis.emptyDirs.push(basePath || dir)
        return
      }

      files.forEach(file => {
        const filePath = resolve(dir, file)
        const relativePath = basePath ? `${basePath}/${file}` : file

        try {
          const stat = statSync(filePath)

          if (stat.isDirectory()) {
            // 跳过 node_modules 和 .git
            if (!['node_modules', '.git', 'dist', '.vscode'].includes(file)) {
              analyzeDir(filePath, relativePath)
            }
          } else {
            analysis.totalFiles++

            const ext = extname(file).toLowerCase()
            analysis.fileTypes[ext] = (analysis.fileTypes[ext] || 0) + 1

            // 检查大文件 (>100KB)
            if (stat.size > 100 * 1024) {
              analysis.largeFiles.push({
                path: relativePath,
                size: stat.size
              })
            }
          }
        } catch (error) {
          // 忽略无法访问的文件
        }
      })
    } catch (error) {
      // 忽略无法访问的目录
    }
  }

  analyzeDir('.')

  return analysis
}

// 分析依赖
function analyzeDependencies() {
  log.info('分析依赖...')

  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const { dependencies = {}, devDependencies = {} } = packageJson

    const analysis = {
      totalDeps: Object.keys(dependencies).length,
      totalDevDeps: Object.keys(devDependencies).length,
      heavyDeps: [],
      unusedDeps: []
    }

    // 检查可能的重型依赖
    const heavyPackages = ['lodash', 'moment', 'antd', 'element-ui', 'bootstrap']
    Object.keys(dependencies).forEach(dep => {
      if (heavyPackages.some(heavy => dep.includes(heavy))) {
        analysis.heavyDeps.push(dep)
      }
    })

    return analysis
  } catch (error) {
    log.error('分析依赖失败')
    return null
  }
}

// 分析构建产物
function analyzeBuildOutput() {
  log.info('分析构建产物...')

  if (!existsSync('dist')) {
    log.warning('构建产物不存在，请先运行 npm run build')
    return null
  }

  try {
    const reportPath = 'dist/build-analysis.json'
    if (!existsSync(reportPath)) {
      log.warning('构建分析报告不存在，请运行 npm run analyze')
      return null
    }

    const report = JSON.parse(readFileSync(reportPath, 'utf8'))
    return report
  } catch (error) {
    log.error('读取构建分析报告失败')
    return null
  }
}

// 检查代码质量
function analyzeCodeQuality() {
  log.info('分析代码质量...')

  const issues = []

  try {
    // 检查是否有 TODO 注释
    const result = execSync('grep -r "TODO\\|FIXME\\|HACK" src/ --include="*.js" --include="*.vue" --include="*.ts" || true', { encoding: 'utf8' })
    if (result.trim()) {
      issues.push({
        type: 'todo',
        count: result.split('\n').filter(line => line.trim()).length,
        description: '代码中存在 TODO/FIXME/HACK 注释'
      })
    }
  } catch (error) {
    // 忽略错误
  }

  try {
    // 检查是否有 console.log
    const result = execSync('grep -r "console\\.log" src/ --include="*.js" --include="*.vue" --include="*.ts" || true', { encoding: 'utf8' })
    if (result.trim()) {
      issues.push({
        type: 'console',
        count: result.split('\n').filter(line => line.trim()).length,
        description: '代码中存在 console.log 调试语句'
      })
    }
  } catch (error) {
    // 忽略错误
  }

  return issues
}

// 生成优化建议
function generateOptimizationSuggestions(projectAnalysis, depsAnalysis, buildAnalysis, codeIssues) {
  const suggestions = []

  // 项目结构建议
  if (projectAnalysis) {
    if (projectAnalysis.emptyDirs.length > 0) {
      suggestions.push({
        category: '项目结构',
        type: 'cleanup',
        title: '清理空目录',
        description: `发现 ${projectAnalysis.emptyDirs.length} 个空目录，建议清理`,
        details: projectAnalysis.emptyDirs,
        priority: 'low'
      })
    }

    if (projectAnalysis.largeFiles.length > 0) {
      suggestions.push({
        category: '项目结构',
        type: 'optimization',
        title: '优化大文件',
        description: `发现 ${projectAnalysis.largeFiles.length} 个大文件 (>100KB)`,
        details: projectAnalysis.largeFiles.map(f => `${f.path} (${formatSize(f.size)})`),
        priority: 'medium'
      })
    }
  }

  // 依赖建议
  if (depsAnalysis) {
    if (depsAnalysis.heavyDeps.length > 0) {
      suggestions.push({
        category: '依赖管理',
        type: 'optimization',
        title: '替换重型依赖',
        description: '发现可能的重型依赖，建议考虑轻量级替代方案',
        details: depsAnalysis.heavyDeps,
        priority: 'high'
      })
    }

    if (depsAnalysis.totalDeps > 50) {
      suggestions.push({
        category: '依赖管理',
        type: 'cleanup',
        title: '依赖数量过多',
        description: `当前有 ${depsAnalysis.totalDeps} 个生产依赖，建议审查是否都必要`,
        priority: 'medium'
      })
    }
  }

  // 构建产物建议
  if (buildAnalysis) {
    const { summary } = buildAnalysis

    if (summary.totalSize > 1024 * 1024) { // 1MB
      suggestions.push({
        category: '构建优化',
        type: 'optimization',
        title: '包体积过大',
        description: `总包大小 ${formatSize(summary.totalSize)}，建议进行代码分割`,
        priority: 'high'
      })
    }

    if (summary.jsSize > 512 * 1024) { // 512KB
      suggestions.push({
        category: '构建优化',
        type: 'optimization',
        title: 'JS 文件过大',
        description: `JS 文件大小 ${formatSize(summary.jsSize)}，建议分离第三方库`,
        priority: 'high'
      })
    }

    if (summary.chunkCount > 20) {
      suggestions.push({
        category: '构建优化',
        type: 'optimization',
        title: '代码块过多',
        description: `代码块数量 ${summary.chunkCount}，可能影响加载性能`,
        priority: 'medium'
      })
    }
  }

  // 代码质量建议
  if (codeIssues) {
    codeIssues.forEach(issue => {
      suggestions.push({
        category: '代码质量',
        type: 'cleanup',
        title: issue.description,
        description: `发现 ${issue.count} 处问题`,
        priority: issue.type === 'console' ? 'high' : 'low'
      })
    })
  }

  return suggestions
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 输出建议
function outputSuggestions(suggestions) {
  if (suggestions.length === 0) {
    log.success('🎉 项目已经很好了，没有发现需要优化的地方！')
    return
  }

  console.log('\n📋 优化建议:')
  console.log('='.repeat(50))

  const categories = [...new Set(suggestions.map(s => s.category))]

  categories.forEach(category => {
    console.log(`\n📂 ${category}:`)

    const categorySuggestions = suggestions.filter(s => s.category === category)
    categorySuggestions.forEach((suggestion, index) => {
      const priorityIcon = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
      }[suggestion.priority]

      console.log(`\n${index + 1}. ${priorityIcon} ${suggestion.title}`)
      console.log(`   ${suggestion.description}`)

      if (suggestion.details && suggestion.details.length > 0) {
        console.log('   详情:')
        suggestion.details.slice(0, 5).forEach(detail => {
          console.log(`   - ${detail}`)
        })
        if (suggestion.details.length > 5) {
          console.log(`   ... 还有 ${suggestion.details.length - 5} 项`)
        }
      }
    })
  })

  // 优化建议总结
  const highPriority = suggestions.filter(s => s.priority === 'high').length
  const mediumPriority = suggestions.filter(s => s.priority === 'medium').length
  const lowPriority = suggestions.filter(s => s.priority === 'low').length

  console.log('\n📊 优化建议统计:')
  console.log(`🔴 高优先级: ${highPriority} 项`)
  console.log(`🟡 中优先级: ${mediumPriority} 项`)
  console.log(`🟢 低优先级: ${lowPriority} 项`)

  if (highPriority > 0) {
    log.warning('建议优先处理高优先级问题')
  }
}

// 主函数
async function main() {
  console.log('🔍 开始项目优化分析...\n')

  const projectAnalysis = analyzeProjectStructure()
  const depsAnalysis = analyzeDependencies()
  const buildAnalysis = analyzeBuildOutput()
  const codeIssues = analyzeCodeQuality()

  const suggestions = generateOptimizationSuggestions(
    projectAnalysis,
    depsAnalysis,
    buildAnalysis,
    codeIssues
  )

  outputSuggestions(suggestions)

  console.log('\n💡 通用优化建议:')
  console.log('1. 启用 Gzip 压缩减小传输大小')
  console.log('2. 配置 CDN 加速静态资源加载')
  console.log('3. 使用 WebP 格式优化图片')
  console.log('4. 实施懒加载策略')
  console.log('5. 定期更新依赖版本')
}

// 运行分析
main().catch(error => {
  log.error('优化分析过程中出现错误:', error.message)
  process.exit(1)
})
