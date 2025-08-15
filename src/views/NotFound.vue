<template>
  <div class="not-found">
    <div class="not-found-content">
      <van-empty
        image="error"
        description="页面不存在"
      >
        <template #image>
          <van-icon name="warning-o" size="80" color="#969799" />
        </template>
      </van-empty>

      <div class="actions">
        <van-button
          type="primary"
          size="large"
          round
          @click="goHome"
        >
          返回首页
        </van-button>

        <van-button
          size="large"
          round
          @click="goBack"
          style="margin-top: 16px;"
        >
          返回上页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  background-color: $background-color;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  padding: 40px 20px;
}

.actions {
  margin-top: 40px;

  .van-button {
    width: 200px;
  }
}

:deep(.van-empty__description) {
  font-size: $font-size-lg;
  color: $text-color-2;
  margin-top: 16px;
}
</style>
