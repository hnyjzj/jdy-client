<script setup lang="ts">
const emits = defineEmits<{
  upload: [val: any, onFinish: () => void, id: string]
  submit: []
  editSubmit: []
}>()
const { $toast } = useNuxtApp()
const { addorUpdateForm } = storeToRefs(useRegion())

const formRef = ref()
// 表单验证
const rules = {
  name: {
    required: true,
    message: '请输入区域名称',
    trigger: ['input', 'blur'],
  },
  alias: {
    required: true,
    message: '请输入区域别名',
    trigger: ['input', 'blur'],
  },
}

// 表单校验
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      emits('submit')
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
</script>

<template>
  <div class="">
    <n-form
      ref="formRef"
      :model="addorUpdateForm"
      :rules="rules"
      size="large"
      label-placement="top">
      <div class=" flex-col justify-between">
        <div class="">
          <n-form-item label="区域名称" path="name">
            <n-input v-model:value="addorUpdateForm.name" placeholder="请输入区域名称" round clearable @focus="focus" />
          </n-form-item>
          <n-form-item label="区域别名" path="alias">
            <n-input v-model:value="addorUpdateForm.alias" placeholder="请输入区域别名" round clearable @focus="focus" />
          </n-form-item>
        </div>
        <div @click="handleValidateButtonClick">
          <common-button-rounded content="确定" />
        </div>
      </div>
    </n-form>
  </div>
</template>
