<script setup lang="ts">
const emits = defineEmits<{
  submit: []
}>()
const { $toast } = useNuxtApp()
const { addorUpdateForm } = storeToRefs(useStores())
const formRef = ref()
// 表单验证
const rules = {
  name: {
    required: true,
    message: '请输入门店名称',
    trigger: ['input', 'blur'],
  },
  alias: {
    required: true,
    message: '请输入别名',
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
        <div class="pb-[40px]">
          <n-form-item label="门店名称" path="name">
            <n-input v-model:value="addorUpdateForm.name" placeholder="请输入门店名称" round clearable @focus="focus" />
          </n-form-item>
          <n-form-item label="别名" path="alias">
            <n-input v-model:value="addorUpdateForm.alias" placeholder="请输入别名" round clearable @focus="focus" />
          </n-form-item>
        </div>

        <div @click="handleValidateButtonClick">
          <common-button-rounded content="确定" />
        </div>
      </div>
    </n-form>
  </div>
</template>
