<script lang="ts" setup>
import type { FormRules, SelectOption } from 'naive-ui'

const props = defineProps<{
  nowidStaff: string
  nowidtype: 'superior' | 'staff'
}>()
const emits = defineEmits<{
  close: []
}>()
useHead({
  title: '分配',
})
const { $toast } = useNuxtApp()
const { assignStaff, assignSuperiors } = useRegion()
const { getOptionsStafflist } = useStaff()
const formRef = ref()
const model = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})
const rules = ref<FormRules>({
  staff_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择员工',
    type: 'array',
  },
})
// 员工列表
const staffList = ref<SelectOption[]>([])
const loadingStaff = ref(false)
const getStaff = useDebounceFn(async (query) => {
  const res = await getOptionsStafflist({ page: 1, limit: 10, where: { nickname: query } })
  loadingStaff.value = false
  if (res.length) {
    staffList.value = res.map(item => ({
      label: item.nickname,
      value: item.id,
    }))
  }
  else {
    staffList.value = []
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
      if (!props.nowidStaff)
        return $toast.error('缺少参数')
      model.value.id = props.nowidStaff as string

      if (props.nowidtype === 'staff') {
        const res = await assignStaff(model.value)
        if (res) {
          $toast.success('分配成功')
          emits('close')
        }
        else {
          $toast.error('分配失败')
        }
      }
      if (props.nowidtype === 'superior') {
        const params = ref<RegionAssignsuperior>({
          id: '',
          superior_id: [],
        })
        const { id, staff_id } = model.value
        params.value.id = id
        params.value.superior_id = staff_id
        const res = await assignSuperiors(params.value)
        if (res) {
          $toast.success('分配成功')
          emits('close')
        }
        else {
          $toast.error('分配失败')
        }
      }
    }
    else {
      $toast.error('验证失败')
    }
  })
}
const title = computed(() => {
  return props.nowidtype === 'staff' ? '分配员工' : '分配负责人'
})
const content = computed(() => {
  return props.nowidtype === 'staff' ? '搜索选择要分配的员工' : '搜索选择要分配的负责人'
})
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
      <n-form-item :label="title" path="staff_id">
        <n-select
          v-model:value="model.staff_id"
          filterable
          multiple
          :placeholder="content"
          :options="staffList"
          :loading="loadingStaff"
          clearable
          remote
          @search="searchStaff"
          @focus="() => {
            searchStaff('')
          }"
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
