<script lang="ts" setup>
const props = defineProps<{
  detail: ServiceOrderInfo
  returnMoney: (req: { id: string, remark: string }) => Promise<boolean>
  getDetail: () => void
}>()

const showModel = defineModel('show', { default: false })
const formRef = ref()

const model = ref<{ id: string, remark: string }>({
  id: '',
  remark: '',
})
if (props.detail.id) {
  model.value.id = props.detail.id
}
const { $toast } = useNuxtApp()

const submit = async () => {
  formRef.value.validate(async (errors: any) => {
    if (errors) {
      $toast.error(errors[0][0].message)
    }
    else {
      const res = await props.returnMoney(model.value)
      if (res) {
        showModel.value = false
        $toast.success('退款成功')
        await props.getDetail()
      }
      else {
        $toast.error('退款失败')
      }
    }
  })
}
</script>

<template>
  <div>
    <common-model
      v-model="showModel" title="退款" :show-ok="true" :show-cancel="true" @confirm="submit" @cancel="showModel = false">
      <div>
        <n-form
          ref="formRef"
          :model="model"
          label-placement="top"
        >
          <n-grid :cols="12" :x-gap="24">
            <n-form-item-gi :span="6" label="订单:" path="id">
              {{ model.id }}
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="备注" path="remark">
              <n-input v-model:value="model.remark" type="textarea" rows="2" placeholder="请输入退款说明" />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
