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
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden">
      <div class="rounded-[24px]">
        <common-gradient title="基本信息">
          <template #right>
            <div class="cursor-pointer" @click="delStore()">
              <icon name="i-svg:delete" :size="16" />
            </div>
          </template>
          <template #body>
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

              <div style="display: flex; justify-content: flex-end">
                <n-button round type="info" @click="handleValidateButtonClick">
                  保存
                </n-button>
              </div>
            </n-form>
          </template>
        </common-gradient>
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
