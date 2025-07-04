<script setup lang="ts">
const emits = defineEmits<{
  editPawd: []
}>()
const { $toast } = useNuxtApp()

const passwordForm = defineModel('password', {
  default: {
    id: '',
    password: '',
  },
})

// 修改密码
const editPassword = () => {
  if (!passwordForm.value.password) {
    $toast.error('请输入密码')
    return false
  }
  else {
    emits('editPawd')
  }
}
</script>

<template>
  <div>
    <div class="pt-[12px]">
      <common-fold title="修改密码" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            :model="passwordForm"
            label-placement="left"
            size="medium"
          >
            <n-grid :cols="24" gap="8">
              <n-form-item-gi :span="24" label="密码">
                <n-input
                  v-model:value="passwordForm.password"
                  placeholder="请输入要修改的密码"
                  round
                  @focus="focus"
                />
              </n-form-item-gi>
            </n-grid>
            <div class="grid-12 px-[26px]">
              <div
                class="font-semibold  cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                <div @click="editPassword">
                  <common-button-rounded content="修改密码" />
                </div>
              </div>
            </div>
          </n-form>
          <n-grid :cols="24" :x-gap="8" />
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}

.n-radio .n-radio__dot.n-radio__dot--checked {
  box-shadow: inset 0 0 0 1px #0068ff;
}
</style>
