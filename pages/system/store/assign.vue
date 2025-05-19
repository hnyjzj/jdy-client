<script lang="ts" setup>
import type { FormRules, SelectOption } from 'naive-ui'

useHead({
  title: '分配员工',
})
const { $toast } = useNuxtApp()

const { assignStaff, staffGetStoreList } = useStores()
const { getOptionsStafflist } = useStaff()
const formRef = ref()
const model = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})
const rules = ref<FormRules>({
  id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择门店',
  },
  staff_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择员工',
    type: 'array',
  },
})
// 门店列表
const storeList = ref<SelectOption[]>([])
// 员工列表
const staffList = ref<SelectOption[]>([])

const loading = ref(false)
const loadingStaff = ref(false)
// 获取门店列表
const getStore = useDebounceFn(async (query) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  loading.value = false
  if (res.length) {
    storeList.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStore = (query: string) => {
  loading.value = true
  getStore(query)
}
const getStaff = useDebounceFn(async (query) => {
  const res = await getOptionsStafflist({ page: 1, limit: 10, where: { nickname: query } })
  loadingStaff.value = false
  if (res.length) {
    staffList.value = res.map(item => ({
      label: item.nickname,
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
      const res = await assignStaff(model.value)
      if (res) {
        $toast.success('分配成功')
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
      <common-fold title="分配员工" from-color="#9EBAF9" to-color="#fff" :is-collapse="false">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            size="large"
            label-placement="top"
          >
            <n-form-item label="门店" path="id">
              <n-select
                v-model:value="model.id"
                filterable
                placeholder="搜索选择门店"
                :options="storeList"
                :loading="loading"
                clearable
                remote
                @search="searchStore"
                @focus="focus"
              />
            </n-form-item>
            <n-form-item label="分配员工" path="staff_id">
              <n-select
                v-model:value="model.staff_id"
                filterable
                multiple
                placeholder="搜索选择要分配员工"
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
