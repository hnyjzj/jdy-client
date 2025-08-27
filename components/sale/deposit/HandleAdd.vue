<script lang="ts" setup>
const props = defineProps<{

  filterList: Where<ProductFinisheds>
}>()
const emit = defineEmits<{
  addProduct: [data: DepositOrderProduct]

}>()
// 订金单手动添加产品组件
const { $toast } = useNuxtApp()
const handleAddProductPopup = ref(false)
const handleFormRef = ref()
const handleFormData = ref<DepositOrderProduct>({
  name: '',
  label_price: 0,
  weight_metal: 0,
  labor_fee: 0,
  retail_type: 1,
  weight_gem: 0,
  color_gem: undefined,
  clarity_gem: undefined,
})
const handleFormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: `请输入货品名称`,
  },
}

const submitForm = () => {
  handleFormRef.value.validate((error: boolean) => {
    if (error) {
      $toast.error('请填写货品名称')
    }
    else {
      // TODO: 提交表单
      handleAddProductPopup.value = false
      emit('addProduct', handleFormData.value)
    }
  })
}
</script>

<template>
  <div class="btn-right  col-6 cursor-pointer" uno-sm="col-4 offset-6">
    <div
      @click="handleAddProductPopup = true">
      <div class="ml-2">
        手动添加
      </div>
    </div>

    <common-model v-model="handleAddProductPopup" title="手动添加" :show-ok="true" :show-cancel="true" @confirm="submitForm" @cancel="handleAddProductPopup = false">
      <div class="h-[300px] overflow-y-scroll">
        <n-form
          ref="handleFormRef"
          :model="handleFormData"
          :rules="handleFormRules"
          label-placement="top"
        >
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="12" label="货品名称" path="name">
              <n-input v-model:value="handleFormData.name" placeholder="货品名称" size="large" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="标签价">
              <n-input-number v-model:value="handleFormData.label_price" placeholder="标签价" size="large" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="工费">
              <n-input-number v-model:value="handleFormData.labor_fee" placeholder="工费" size="large" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="金重">
              <n-input-number v-model:value="handleFormData.weight_metal" placeholder="金重" size="large" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="主石重">
              <n-input-number v-model:value="handleFormData.weight_gem" placeholder="主石重" size="large" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="零售方式">
              <n-select
                v-model:value="handleFormData.retail_type"
                size="large"
                placeholder="零售方式"
                :options="optonsToSelect(props.filterList.retail_type?.preset)"
                @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="颜色">
              <n-select
                v-model:value="handleFormData.color_gem"
                placeholder="颜色"
                clearable
                size="large"
                :options="optonsToSelect(props.filterList.color_gem?.preset)"
                @focus="focus"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="净度">
              <n-select
                v-model:value="handleFormData.clarity_gem"
                placeholder="净度"
                clearable
                size="large"
                :options="optonsToSelect(props.filterList.clarity?.preset)"
                @focus="focus"
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
