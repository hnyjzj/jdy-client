<script setup lang="ts">
const props = defineProps<{
  showName: { province_name: string }
}>()
const emits = defineEmits<{
  selectCity: []
  selectStore: []
  cleanParentId: []
  cleanProvince: []
  updateParent: [val: string]
  submit: []
}>()
const { formList, searchKey, realSearchKey } = storeToRefs(useStores())
const form = defineModel<Where>({ default: {
} })
form.value = formList.value
const rules = {}
// form 表单尺寸
const size = ref<'small' | 'medium' | 'large'>('large')
// 转换名称
const toLabel = (key: string): string => {
  const labelMap: { [key: string]: string } = {
    address: '地址',
    parent_id: '上级id',
    name: '门店名称',
    province: '省',
    city: '市',
    district: '区',
    contact: '联系方式',
    wxwork_id: '企业微信id',
  }

  return labelMap[key] || ''
}
const options = ref<{ label: string, key: string }[]>([])

// 显示上级门店列表
const pop = ref(false)
const popList = ref<storesList[]>([])
const showPopup = (res: any) => {
  popList.value = res
  options.value = []
  res.forEach((item: storesList) => {
    options.value.push({
      label: item.name,
      key: item.id,
    })
  })
  pop.value = true
}
const onSearch = useDebounceFn(() => {
  if (searchKey.value)
    emits('updateParent', searchKey.value)
  else
    form.value.parent_id = undefined
}, 1000)
// 清空按钮
const clearFn = () => {
  searchKey.value = ''
  form.value.parent_id = ''
}
// 失去焦点清空 输入框
const blurClean = () => {
  const resetSearch = () => {
    searchKey.value = ''
    realSearchKey.value = ''
  }
  // 如果 searchKey 或 parent_id 为空，重置所有相关状态
  if (searchKey.value === '' || !form.value.parent_id) {
    form.value.parent_id = ''
    resetSearch()
    return
  }
  // 如果 parent_id 存在，设置 searchKey 为 realSearchKey
  searchKey.value = realSearchKey.value
  // 延迟关闭弹出层
  setTimeout(() => {
    pop.value = false
  }, 100)
}
// 选择上级门店
const seletParent = (key: string | number, options: any) => {
  form.value.parent_id = options.key as string
  searchKey.value = options.label as string
  realSearchKey.value = options.label as string
  pop.value = false
}
defineExpose({
  showPopup,
})
</script>

<template>
  <div>
    <n-form
      :model="form"
      :rules="rules"
      :size="size"
      label-placement="top"
    >
      <n-form-item :span="12" label="上级门店" path="address">
        <n-dropdown :options="options" :show="pop" placement="bottom-start" @select="seletParent">
          <n-input
            v-model:value="searchKey"
            round placeholder="请输入上级门店" clearable @input="() => onSearch()" @clear="clearFn" @blur="blurClean" />
        </n-dropdown>
      </n-form-item>
      <div class="pb-[16px]">
        <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
          省市区
        </div>
        <div class="bg-[#fff] border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center">
          <template v-if="form.province || form.city || form.district">
            <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="emits('selectCity')">
              {{ props.showName.province_name }}
            </div>
          </template>
          <template v-else>
            <div class="text-[14px] color-[#C9C9C9] py-[9.5px] flex-1" @click="emits('selectCity')">
              请选择省市区
            </div>
          </template>
          <van-icon
            name="close" @click="() => {
              form.province = ''
              form.city = ''
              form.district = ''
              emits('cleanProvince')
            }" />
        </div>
      </div>
      <template v-for="(value, key, index) in form" :key="index">
        <template v-if="key !== 'parent_id' && key !== 'province' && key !== 'city' && key !== 'district'">
          <n-form-item :span="12" :label="toLabel(key)" path="address">
            <n-input v-model:value="form[key]" round :placeholder="`请输入${toLabel(key)}`" clearable />
          </n-form-item>
        </template>
      </template>
      <div
        class="text-size-[16px] font-semibold" @click="emits('submit')">
        <div class="ok">
          确定
        </div>
      </div>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
:deep(.van-popover__wrapper) {
  width: 100%;
}
:deep(.n-input:hover) {
  box-shadow: none !important;
  border-color: var(--n-border-color) !important; // 或者设置为你想要的颜色
}
</style>
