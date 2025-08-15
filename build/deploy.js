/**
 * 部署脚本
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

// 部署配置
const deployConfig = {
  // 构建目录
  buildDir: 'dist',

  // Git 部署配置
  git: {
    branch: 'gh-pages',
    remote: 'origin',
    message: 'Deploy to GitHub Pages'
  },

  // FTP 部署配置
  ftp: {
    host: process.env.FTP_HOST,
    username: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    remotePath: process.env.FTP_REMOTE_PATH || '/'
  },

  // 阿里云 OSS 配置
  oss: {
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
    prefix: process.env.OSS_PREFIX || ''
  }
}

// 检查构建目录
function checkBuildDir() {
  if (!existsSync(deployConfig.buildDir)) {
    console.error(`❌ 构建目录 ${deployConfig.buildDir} 不存在，请先执行构建`)
    process.exit(1)
  }
  console.log('✅ 构建目录检查通过')
}

// Git 部署
function deployToGit() {
  try {
    console.log('🚀 开始 Git 部署...')

    // 进入构建目录
    process.chdir(deployConfig.buildDir)

    // 初始化 Git 仓库
    execSync('git init', { stdio: 'inherit' })
    execSync('git add -A', { stdio: 'inherit' })
    execSync(`git commit -m "${deployConfig.git.message}"`, { stdio: 'inherit' })

    // 推送到远程分支
    execSync(`git push -f ${deployConfig.git.remote} main:${deployConfig.git.branch}`, { stdio: 'inherit' })

    console.log('✅ Git 部署完成')
  } catch (error) {
    console.error('❌ Git 部署失败:', error.message)
    process.exit(1)
  }
}

// FTP 部署
function deployToFTP() {
  try {
    console.log('🚀 开始 FTP 部署...')

    const { host, username, password, remotePath } = deployConfig.ftp

    if (!host || !username || !password) {
      console.error('❌ FTP 配置不完整，请检查环境变量')
      process.exit(1)
    }

    // 这里可以使用 ftp 或 sftp 库进行部署
    console.log('📁 FTP 部署功能需要根据具体需求实现')

  } catch (error) {
    console.error('❌ FTP 部署失败:', error.message)
    process.exit(1)
  }
}

// 阿里云 OSS 部署
function deployToOSS() {
  try {
    console.log('🚀 开始 OSS 部署...')

    const { region, accessKeyId, accessKeySecret, bucket } = deployConfig.oss

    if (!region || !accessKeyId || !accessKeySecret || !bucket) {
      console.error('❌ OSS 配置不完整，请检查环境变量')
      process.exit(1)
    }

    // 这里可以使用 ali-oss 库进行部署
    console.log('☁️ OSS 部署功能需要根据具体需求实现')

  } catch (error) {
    console.error('❌ OSS 部署失败:', error.message)
    process.exit(1)
  }
}

// 主函数
function main() {
  const deployType = process.argv[2] || 'git'

  console.log(`📦 开始部署到 ${deployType.toUpperCase()}...`)

  // 检查构建目录
  checkBuildDir()

  // 根据类型执行部署
  switch (deployType) {
    case 'git':
      deployToGit()
      break
    case 'ftp':
      deployToFTP()
      break
    case 'oss':
      deployToOSS()
      break
    default:
      console.error(`❌ 不支持的部署类型: ${deployType}`)
      console.log('支持的部署类型: git, ftp, oss')
      process.exit(1)
  }

  console.log('🎉 部署完成!')
}

// 执行部署
main()
