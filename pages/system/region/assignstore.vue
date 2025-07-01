<script lang="ts" setup>
import type { FormRules, SelectOption } from 'naive-ui'

useHead({
  title: '分配',
})
const { $toast } = useNuxtApp()
const { assignStores } = useRegion()
const { staffGetStoreList } = useStores()
const route = useRoute()
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
// 员工列表
const staffList = ref<SelectOption[]>([])
const loadingStaff = ref(false)
const getStaff = useDebounceFn(async (query) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  loadingStaff.value = false
  if (res.length) {
    staffList.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStaff = (query: string) => {
  loadingStaff.value = true
  getStaff(query)
}

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (!route.query.id)
        return $toast.error('缺少参数')
      model.value.id = route.query.id as string

      const res = await assignStores(model.value)
      if (res) {
        $toast.success('分配成功')
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
  <div class="grid-12">
    <div class="p-[16px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <common-fold title="分配门店" from-color="#9EBAF9" to-color="#fff" :is-collapse="false">
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
                :options="staffList"
                :loading="loadingStaff"
                clearable
                remote
                @search="searchStaff"
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
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
