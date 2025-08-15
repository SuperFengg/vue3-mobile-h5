<template>
  <div class="demo">
    <van-nav-bar
      title="组件演示"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <div class="demo-content">
      <van-cell-group title="基础组件">
        <van-cell title="按钮" is-link @click="showButtonDemo" />
        <van-cell title="单元格" is-link @click="showCellDemo" />
        <van-cell title="图标" is-link @click="showIconDemo" />
        <van-cell title="图片" is-link @click="showImageDemo" />
      </van-cell-group>

      <van-cell-group title="表单组件">
        <van-cell title="输入框" is-link @click="showFieldDemo" />
        <van-cell title="单选框" is-link @click="showRadioDemo" />
        <van-cell title="复选框" is-link @click="showCheckboxDemo" />
        <van-cell title="开关" is-link @click="showSwitchDemo" />
      </van-cell-group>

      <van-cell-group title="反馈组件">
        <van-cell title="弹出层" is-link @click="showPopupDemo" />
        <van-cell title="提示" is-link @click="showToastDemo" />
        <van-cell title="对话框" is-link @click="showDialogDemo" />
        <van-cell title="通知" is-link @click="showNotifyDemo" />
      </van-cell-group>

      <van-cell-group title="展示组件">
        <van-cell title="列表" is-link @click="showListDemo" />
        <van-cell title="轮播" is-link @click="showSwipeDemo" />
        <van-cell title="标签" is-link @click="showTagDemo" />
        <van-cell title="进度条" is-link @click="showProgressDemo" />
      </van-cell-group>
    </div>

    <!-- 演示弹出层 -->
    <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '30%' }">
      <div class="popup-content">
        <h3>这是一个底部弹出层</h3>
        <p>可以放置任何内容</p>
        <van-button type="primary" @click="showPopup = false">关闭</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast, dialog, notify } from '@/config/vant'

const showPopup = ref(false)

// 按钮演示
const showButtonDemo = () => {
  toast.success('按钮组件演示')
}

// 单元格演示
const showCellDemo = () => {
  toast.success('单元格组件演示')
}

// 图标演示
const showIconDemo = () => {
  toast.success('图标组件演示')
}

// 图片演示
const showImageDemo = () => {
  toast.success('图片组件演示')
}

// 输入框演示
const showFieldDemo = () => {
  toast.success('输入框组件演示')
}

// 单选框演示
const showRadioDemo = () => {
  toast.success('单选框组件演示')
}

// 复选框演示
const showCheckboxDemo = () => {
  toast.success('复选框组件演示')
}

// 开关演示
const showSwitchDemo = () => {
  toast.success('开关组件演示')
}

// 弹出层演示
const showPopupDemo = () => {
  showPopup.value = true
}

// 提示演示
const showToastDemo = () => {
  toast.loading('加载中...')
  setTimeout(() => {
    toast.success('加载完成')
  }, 2000)
}

// 对话框演示
const showDialogDemo = () => {
  dialog.confirm({
    title: '提示',
    message: '这是一个确认对话框',
  }).then(() => {
    toast.success('点击了确认')
  }).catch(() => {
    toast.fail('点击了取消')
  })
}

// 通知演示
const showNotifyDemo = () => {
  notify.success('这是一个成功通知')
}

// 列表演示
const showListDemo = () => {
  toast.success('列表组件演示')
}

// 轮播演示
const showSwipeDemo = () => {
  toast.success('轮播组件演示')
}

// 标签演示
const showTagDemo = () => {
  toast.success('标签组件演示')
}

// 进度条演示
const showProgressDemo = () => {
  toast.success('进度条组件演示')
}
</script>

<style lang="scss" scoped>
.demo {
  min-height: 100vh;
  background-color: $background-color;
}

.demo-content {
  padding-top: 46px; // 为顶部导航栏留出空间
  padding: 46px 16px 16px;
}

.popup-content {
  padding: 30px;
  text-align: center;

  h3 {
    margin: 0 0 16px;
    color: $text-color;
  }

  p {
    margin: 0 0 24px;
    color: $text-color-2;
  }
}

:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  color: $text-color;
  font-size: $font-size-md;
  font-weight: 600;
}

:deep(.van-cell) {
  border-radius: $border-radius-md;
  margin-bottom: 1px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
