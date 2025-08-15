/**
 * 项目健康检查脚本
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`)
}

// 检查项目配置
function checkProjectConfig() {
  log.info('检查项目配置...')

  const requiredFiles = [
    'package.json',
    'vite.config.js',
    'vitest.config.js',
    'eslint.config.js',
    '.prettierrc.json',
    '.nvmrc',
    'README.md'
  ]

  let allExists = true

  requiredFiles.forEach(file => {
    if (existsSync(file)) {
      log.success(`${file} 存在`)
    } else {
      log.error(`${file} 不存在`)
      allExists = false
    }
  })

  return allExists
}

// 检查依赖版本
function checkDependencies() {
  log.info('检查依赖版本...')

  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const { dependencies, devDependencies } = packageJson

    const expectedVersions = {
      'vue': '^3.5.18',
      'vite': 'npm:rolldown-vite@latest',
      'vant': '^4.9.21',
      'pinia': '^3.0.3',
      'vue-router': '^4.5.1'
    }

    let allCorrect = true

    Object.entries(expectedVersions).forEach(([pkg, expectedVersion]) => {
      const actualVersion = dependencies[pkg] || devDependencies[pkg]
      if (actualVersion === expectedVersion) {
        log.success(`${pkg}: ${actualVersion}`)
      } else {
        log.warning(`${pkg}: 期望 ${expectedVersion}, 实际 ${actualVersion || '未安装'}`)
        if (!actualVersion) allCorrect = false
      }
    })

    return allCorrect
  } catch (error) {
    log.error('读取 package.json 失败')
    return false
  }
}

// 检查代码质量
function checkCodeQuality() {
  log.info('检查代码质量...')

  try {
    // 运行 ESLint 检查
    execSync('npm run lint:check', { stdio: 'pipe' })
    log.success('ESLint 检查通过')

    // 运行 Prettier 检查
    execSync('npm run format:check', { stdio: 'pipe' })
    log.success('Prettier 检查通过')

    // JavaScript项目，跳过类型检查
    log.success('JavaScript 项目，无需类型检查')

    return true
  } catch (error) {
    log.error('代码质量检查失败')
    console.log(error.stdout?.toString())
    return false
  }
}

// 检查测试
function checkTests() {
  log.info('运行测试...')

  try {
    // 运行单元测试
    execSync('npm run test:unit:run', { stdio: 'pipe' })
    log.success('单元测试通过')

    return true
  } catch (error) {
    log.error('测试失败')
    console.log(error.stdout?.toString())
    return false
  }
}

// 检查构建
function checkBuild() {
  log.info('检查构建...')

  try {
    // 运行构建
    execSync('npm run build', { stdio: 'pipe' })
    log.success('构建成功')

    // 检查构建产物
    const distExists = existsSync('dist')
    if (distExists) {
      log.success('构建产物存在')
    } else {
      log.error('构建产物不存在')
      return false
    }

    return true
  } catch (error) {
    log.error('构建失败')
    console.log(error.stdout?.toString())
    return false
  }
}

// 性能检查
function checkPerformance() {
  log.info('性能检查...')

  try {
    // 运行构建分析
    execSync('npm run analyze', { stdio: 'pipe' })
    log.success('性能分析完成')

    // 检查分析报告
    const reportExists = existsSync('dist/build-analysis.json')
    if (reportExists) {
      const report = JSON.parse(readFileSync('dist/build-analysis.json', 'utf8'))
      const { totalSize, jsSize, cssSize } = report.summary

      log.info(`总大小: ${formatSize(totalSize)}`)
      log.info(`JS 大小: ${formatSize(jsSize)}`)
      log.info(`CSS 大小: ${formatSize(cssSize)}`)

      // 性能警告
      if (totalSize > 1024 * 1024) {
        log.warning('总包大小超过 1MB，建议优化')
      }

      if (jsSize > 512 * 1024) {
        log.warning('JS 文件超过 512KB，建议代码分割')
      }
    }

    return true
  } catch (error) {
    log.error('性能检查失败')
    return false
  }
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 主函数
async function main() {
  console.log('🔍 开始项目健康检查...\n')

  const checks = [
    { name: '项目配置', fn: checkProjectConfig },
    { name: '依赖版本', fn: checkDependencies },
    { name: '代码质量', fn: checkCodeQuality },
    { name: '测试', fn: checkTests },
    { name: '构建', fn: checkBuild },
    { name: '性能', fn: checkPerformance }
  ]

  let allPassed = true

  for (const check of checks) {
    console.log(`\n📋 ${check.name}检查:`)
    const passed = check.fn()
    if (!passed) {
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(50))

  if (allPassed) {
    log.success('🎉 所有检查通过！项目状态良好。')
  } else {
    log.error('❌ 部分检查失败，请修复后重试。')
    process.exit(1)
  }
}

// 运行检查
main().catch(error => {
  log.error('健康检查过程中出现错误:', error.message)
  process.exit(1)
})
