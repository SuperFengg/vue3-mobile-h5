<template>
  <van-form @submit="handleSubmit" @failed="handleFailed">
    <van-cell-group v-for="group in formGroups" :key="group.title" :title="group.title">
      <template v-for="field in group.fields" :key="field.name">
        <!-- 输入框 -->
        <van-field
          v-if="field.type === 'input'"
          v-model="formData[field.name]"
          :name="field.name"
          :label="field.label"
          :placeholder="field.placeholder"
          :type="field.inputType || 'text'"
          :rules="field.rules"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :maxlength="field.maxlength"
          :show-word-limit="field.showWordLimit"
          :clearable="field.clearable !== false"
          :left-icon="field.leftIcon"
          :right-icon="field.rightIcon"
          @click-left-icon="handleFieldEvent('click-left-icon', field, $event)"
          @click-right-icon="handleFieldEvent('click-right-icon', field, $event)"
        />

        <!-- 文本域 -->
        <van-field
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.name]"
          :name="field.name"
          :label="field.label"
          :placeholder="field.placeholder"
          :rules="field.rules"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :maxlength="field.maxlength"
          :show-word-limit="field.showWordLimit"
          :rows="field.rows || 3"
          :autosize="field.autosize"
          type="textarea"
        />

        <!-- 选择器 -->
        <van-field
          v-else-if="field.type === 'picker'"
          v-model="formData[field.name]"
          :name="field.name"
          :label="field.label"
          :placeholder="field.placeholder"
          :rules="field.rules"
          :disabled="field.disabled"
          readonly
          is-link
          @click="handlePickerClick(field)"
        />

        <!-- 日期选择器 -->
        <van-field
          v-else-if="field.type === 'datetime'"
          v-model="formData[field.name]"
          :name="field.name"
          :label="field.label"
          :placeholder="field.placeholder"
          :rules="field.rules"
          :disabled="field.disabled"
          readonly
          is-link
          @click="handleDatetimeClick(field)"
        />

        <!-- 开关 -->
        <van-field
          v-else-if="field.type === 'switch'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-switch
              v-model="formData[field.name]"
              :disabled="field.disabled"
              :size="field.size"
            />
          </template>
        </van-field>

        <!-- 单选框组 -->
        <van-field
          v-else-if="field.type === 'radio'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-radio-group v-model="formData[field.name]" :direction="field.direction || 'horizontal'">
              <van-radio
                v-for="option in field.options"
                :key="option.value"
                :name="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 复选框组 -->
        <van-field
          v-else-if="field.type === 'checkbox'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-checkbox-group v-model="formData[field.name]" :direction="field.direction || 'horizontal'">
              <van-checkbox
                v-for="option in field.options"
                :key="option.value"
                :name="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>

        <!-- 步进器 -->
        <van-field
          v-else-if="field.type === 'stepper'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-stepper
              v-model="formData[field.name]"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="field.disabled"
            />
          </template>
        </van-field>

        <!-- 评分 -->
        <van-field
          v-else-if="field.type === 'rate'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-rate
              v-model="formData[field.name]"
              :count="field.count || 5"
              :size="field.size"
              :disabled="field.disabled"
              :allow-half="field.allowHalf"
            />
          </template>
        </van-field>

        <!-- 滑块 -->
        <van-field
          v-else-if="field.type === 'slider'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-slider
              v-model="formData[field.name]"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="field.disabled"
            />
          </template>
        </van-field>

        <!-- 上传 -->
        <van-field
          v-else-if="field.type === 'uploader'"
          :name="field.name"
          :label="field.label"
          :rules="field.rules"
        >
          <template #input>
            <van-uploader
              v-model="formData[field.name]"
              :multiple="field.multiple"
              :max-count="field.maxCount"
              :max-size="field.maxSize"
              :accept="field.accept"
              :disabled="field.disabled"
              @oversize="handleFieldEvent('oversize', field, $event)"
              @delete="handleFieldEvent('delete', field, $event)"
            />
          </template>
        </van-field>
      </template>
    </van-cell-group>

    <!-- 提交按钮 -->
    <div v-if="showSubmitButton" class="form-submit">
      <van-button
        type="primary"
        size="large"
        :loading="submitting"
        :disabled="submitDisabled"
        native-type="submit"
        round
      >
        {{ submitText }}
      </van-button>
    </div>

    <!-- 选择器弹出层 -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="currentPickerColumns"
        @confirm="handlePickerConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <!-- 日期选择器弹出层 -->
    <van-popup v-model:show="showDatetimePicker" position="bottom">
      <van-date-picker
        v-model="currentDatetimeValue"
        @confirm="handleDatetimeConfirm"
        @cancel="showDatetimePicker = false"
      />
    </van-popup>
  </van-form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  // 表单配置
  formConfig: {
    type: Array,
    required: true
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 提交按钮
  showSubmitButton: {
    type: Boolean,
    default: true
  },
  submitText: {
    type: String,
    default: '提交'
  },
  submitting: {
    type: Boolean,
    default: false
  },
  submitDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'field-event'])

// 表单数据
const formData = reactive({ ...props.modelValue })

// 选择器相关
const showPicker = ref(false)
const currentPickerField = ref(null)
const currentPickerColumns = ref([])

// 日期选择器相关
const showDatetimePicker = ref(false)
const currentDatetimeField = ref(null)
const currentDatetimeValue = ref(new Date())
const currentDatetimeType = ref('date')

// 处理表单配置
const formGroups = computed(() => {
  return props.formConfig.map(group => ({
    title: group.title,
    fields: group.fields || []
  }))
})

// 监听表单数据变化
watch(formData, (newData) => {
  emit('update:modelValue', newData)
}, { deep: true })

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  Object.assign(formData, newValue)
}, { deep: true })

// 处理表单提交
const handleSubmit = (values) => {
  emit('submit', values)
}

// 处理表单验证失败
const handleFailed = (errorInfo) => {
  console.log('表单验证失败:', errorInfo)
}

// 处理字段事件
const handleFieldEvent = (eventName, field, event) => {
  emit('field-event', {
    eventName,
    field,
    event,
    value: formData[field.name]
  })
}

// 处理选择器点击
const handlePickerClick = (field) => {
  currentPickerField.value = field
  currentPickerColumns.value = field.options || []
  showPicker.value = true
}

// 处理选择器确认
const handlePickerConfirm = ({ selectedValues, selectedOptions }) => {
  if (currentPickerField.value) {
    formData[currentPickerField.value.name] = selectedValues[0]
  }
  showPicker.value = false
}

// 处理日期选择器点击
const handleDatetimeClick = (field) => {
  currentDatetimeField.value = field
  currentDatetimeType.value = field.dateType || 'date'
  currentDatetimeValue.value = formData[field.name] ? new Date(formData[field.name]) : new Date()
  showDatetimePicker.value = true
}

// 处理日期选择器确认
const handleDatetimeConfirm = (value) => {
  if (currentDatetimeField.value) {
    formData[currentDatetimeField.value.name] = value
  }
  showDatetimePicker.value = false
}

// 重置表单
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })
  Object.assign(formData, props.modelValue)
}

// 验证表单
const validateForm = () => {
  // 这里可以添加自定义验证逻辑
  return true
}

// 暴露方法
defineExpose({
  resetForm,
  validateForm,
  formData
})
</script>

<style lang="scss" scoped>
.form-submit {
  padding: 24px 16px;
  background-color: $white;

  .van-button {
    width: 100%;
  }
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  color: $text-color;
  font-size: $font-size-md;
  font-weight: 600;
}
</style>
