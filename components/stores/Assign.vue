<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const props = defineProps<{
  staffList: SelectOption[]
}>()
const emit = defineEmits<{
  assign: []
  searchStaffOptions: [val: string]
}>()

const assignModel = defineModel('assign-model', { default: {
  id: undefined,
  staff_id: [],
} })
// 显示弹窗
const assignShow = defineModel('assignShow', { default: false })
// 员工列表
const loadingStaff = ref(false)
const getStaff = useDebounceFn(async (query) => {
  emit('searchStaffOptions', query)
  loadingStaff.value = false
}, 500)
// 搜索员工
const searchStaff = (query: string) => {
  loadingStaff.value = true
  getStaff(query)
}
// 确定按钮
const onPositiveClick = async () => {
  emit('assign')
  assignShow.value = false
}
const onNegativeClick = () => {

}
</script>

<template>
  <div>
    <n-modal
      v-model:show="assignShow"
      :mask-closable="false"
      preset="dialog"
      title="分配员工"
    >
      <div>
        <n-select
          v-model:value="assignModel.staff_id"
          size="large"
          filterable
          multiple
          placeholder="搜索选择要分配员工"
          :options="props.staffList"
          :loading="loadingStaff"
          clearable
          remote
          @search="searchStaff"
          @focus="focus"

        />
      </div>
      <template #action>
        <div class="py-[10px] px-[20px]  border-solid border-[#EFF0F6] border color-[#333] rounded-[24px]" @click="onNegativeClick">
          取消
        </div>
        <div class="py-[10px] px-[20px]  bg-[#2080F0] color-[#fff] rounded-[24px]" @click="onPositiveClick">
          确定
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>

</style>
