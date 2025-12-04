<script setup lang="ts">
const { $toast } = useNuxtApp()
const { updateRegion } = useRegion()
const { regionDetails } = storeToRefs(useRegion())
const modelRef = ref<Partial<Region>>({
  id: regionDetails.value.id,
  name: regionDetails.value.name,
  alias: regionDetails.value.alias,
})
const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
  alias: [{ required: true, message: '请输入区域别名', trigger: 'blur' }],
}
const handleValidateButtonClick = async () => {
  await formRef.value.validate()
  const res = await updateRegion(modelRef.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
  }
  else {
    $toast.error(res?.message ?? '更新失败')
  }
}
</script>

<template>
  <div class="w-full">
    <div class="w-auto blur-bga rounded-[24px]  col-12 overflow-hidden">
      <div class="rounded-[24px]">
        <common-card-info title="基本信息">
          <template #info>
            <n-form ref="formRef" :model="modelRef" :rules="rules">
              <n-form-item path="name" label="区域名称">
                <n-input v-model:value="modelRef.name" @keydown.enter.prevent />
              </n-form-item>
              <n-form-item path="alias" label="别名">
                <n-input v-model:value="modelRef.alias" @keydown.enter.prevent />
              </n-form-item>
              <div style="display: flex; justify-content: flex-end">
                <div class="cursor-pointer flex gap-[6px] light:color-[#1A6DD8] dark:color-[#fff]" @click="handleValidateButtonClick">
                  <icon name="i-icon:save-btn" :size="18" class="light:color-[#1A6DD8] dark:color-[#fff]" />
                  保存
                </div>
              </div>
            </n-form>
          </template>
        </common-card-info>
      </div>
    </div>
  </div>
</template>
