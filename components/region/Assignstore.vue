<script lang="ts" setup>
import type { FormRules, SelectOption } from 'naive-ui'

const props = defineProps<{
  nowid: string
}>()
const emits = defineEmits<{
  close: []
}>()
useHead({
  title: '分配',
})

const { $toast } = useNuxtApp()
const { assignStores } = useRegion()
const { staffGetStoreList } = useStores()
const formRef = ref()
const model = ref<RegionassignStores>({
  id: undefined,
  store_id: [],
})

const rules = ref<FormRules>({
  stores_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择门店',
    type: 'array',
  },
})

const Stores = ref<SelectOption[]>([])
const loading = ref(false)
const getStores = useDebounceFn(async (query) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  loading.value = false
  if (res.length) {
    Stores.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStores = (query: string) => {
  loading.value = true
  getStores(query)
}

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (!props.nowid)
        return $toast.error('缺少参数')
      model.value.id = props.nowid as string

      const res = await assignStores(model.value)
      if (res) {
        $toast.success('分配成功')
        emits('close')
      }
      else {
        $toast.error('分配失败')
      }
    }
    else {
      $toast.error('验证失败')
    }
  })
}
</script>

<template>
  <div class="p-[16px]">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
      label-placement="top"
    >
      <n-form-item label="分配门店" path="store_id">
        <n-select
          v-model:value="model.store_id"
          filterable
          multiple
          placeholder="请选择门店"
          :options="Stores"
          :loading="loading"
          clearable
          remote
          @search="searchStores"
          @focus="focus"
        />
      </n-form-item>
      <div class="grid-12 px-[26px]">
        <div
          class="font-semibold pb-[26px] cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
          <div @click="handleValidateButtonClick">
            <common-button-rounded content="确定" />
          </div>
        </div>
      </div>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
