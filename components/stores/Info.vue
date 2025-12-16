<script setup lang="ts">
const { $toast } = useNuxtApp()
const { updateStore, deleteStore } = useStores()
const { storeDetails } = storeToRefs(useStores())
const modelRef = ref<Partial<Stores>>({
  id: storeDetails.value.id,
  name: storeDetails.value.name,
  alias: storeDetails.value.alias,
  phone: storeDetails.value.phone,
})
const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  alias: [{ required: true, message: '请输入门店别名', trigger: 'blur' }],
}
const handleValidateButtonClick = async () => {
  await formRef.value.validate()
  const res = await updateStore(modelRef.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
  }
  else {
    $toast.error(res?.message ?? '更新失败')
  }
}
const confirmShow = ref(false)
const delStore = () => {
  confirmShow.value = true
}
const router = useRouter()
const deleteConfirm = async () => {
  confirmShow.value = false
  const res = await deleteStore(storeDetails.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
  router.back()
}
</script>

<template>
  <div class="w-full">
    <div class="w-auto rounded-[24px] col-12 overflow-hidden">
      <div class="rounded-[24px]">
        <common-card-info title="基本信息">
          <template #info>
            <n-form ref="formRef" :model="modelRef" :rules="rules">
              <n-form-item path="name" label="门店名称">
                <n-input v-model:value="modelRef.name" @keydown.enter.prevent />
              </n-form-item>
              <n-form-item path="alias" label="别名">
                <n-input v-model:value="modelRef.alias" @keydown.enter.prevent />
              </n-form-item>
              <n-form-item path="phone" label="联系电话">
                <n-input v-model:value="modelRef.phone" @keydown.enter.prevent />
              </n-form-item>
              <div class="flex items-center justify-between">
                <div class="cursor-pointer flex gap-[6px]" @click="delStore()">
                  <icon name="i-svg:delete" :size="16" />
                  <span class="color-[#F82F2F]">删除</span>
                </div>
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
    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除此门店?"
      icon="error"
      @submit="deleteConfirm"
    />
  </div>
</template>
