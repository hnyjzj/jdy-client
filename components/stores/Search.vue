<script setup lang="ts">
const { formList } = storeToRefs(useStores())
const form = defineModel<StoresWhere>({ default: {
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
const popList = ref<stores[]>([])
const showPopup = (res: any) => {
  popList.value = res
  options.value = []
  res.forEach((item: stores) => {
    options.value.push({
      label: item.name,
      key: item.id,
    })
  })
  pop.value = true
}

// 省市区文本显示
const areaText = ref('')
// 展示地址选择器
const areaShow = ref(false)
// 选择地址完成
const finishedArea = (val: ProvinceTab[]) => {
  form.value.province = val[0].value
  form.value.city = val[1].value
  form.value.district = val[2].value
  areaText.value = `${val[0].text} ${val[1].text} ${val[2].text}`
}
// 清理选择地址
const clearnArea = () => {
  form.value.province = undefined
  form.value.city = undefined
  form.value.district = undefined
  areaText.value = ''
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
      <div class="pb-[16px] relative">
        <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
          省市区
        </div>
        <div class="bg-[#fff] border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center">
          <template v-if="form.province || form.city || form.district">
            <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="areaShow = true">
              {{ areaText }}
            </div>
          </template>
          <template v-else>
            <div class="text-[14px] color-[#C9C9C9] py-[9.5px] flex-1" @click="areaShow = true">
              请选择省市区
            </div>
          </template>
          <van-icon
            name="close" @click="clearnArea()" />
        </div>
        <div class="absolute w-full">
          <common-area v-model:show="areaShow" @on-finish="finishedArea" />
        </div>
      </div>
      <template v-for="(value, key, index) in form" :key="index">
        <template v-if=" key !== 'province' && key !== 'city' && key !== 'district'">
          <n-form-item :span="12" :label="toLabel(key)" path="address">
            <n-input v-model:value="form[key]" round :placeholder="`请输入${toLabel(key)}`" clearable />
          </n-form-item>
        </template>
      </template>
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
