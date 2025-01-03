<script setup lang="ts">
const props = withDefaults(defineProps<{
  border?: boolean // 校验显示隐藏错误提示边框
  showtitle?: boolean // 是否显示标题
  isRequired?: boolean // 是否必填 ，必填则会多出一个错误提示的位置 校验的时候显示
}>(), {
  border: false,
  showtitle: true,
  isRequired: true,
})
const emits = defineEmits<{
  update: [val: Stores['region']]
  updateError: [val: boolean]
}>()
// 显示选择器
const areaShow = ref(false)
const areaText = ref('')
const form = defineModel<provinceForm>('form')
const AreaRef = ref()
// 完场筛选
const finishedArea = (val: ProvinceTab[]) => {
  if (!form.value) {
    // 如果没有表单数据，则手动更新 emit
    const region = {} as Stores['region']
    region.province = val[0].value
    region.city = val[1].value
    region.district = val[2].value
    areaText.value = `${val[0].text} ${val[1].text} ${val[2].text}`
    emits('update', region)
  }
  else {
    // 如果有表单数据，则自动更新表单数据
    form.value.province = val[0].value
    form.value.city = val[1].value
    form.value.district = val[2].value
    areaText.value = `${val[0].text} ${val[1].text} ${val[2].text}`
  }
}
// 清理省市区
const clearnArea = () => {
  emits('updateError', true)
  areaText.value = ''
  if (!form.value)
    return
  form.value.province = undefined
  form.value.city = undefined
  form.value.district = undefined
}

// 设置默认值
const setD = (val: string[]) => {
  AreaRef.value.setDefault(val)
}
onMounted(() => {
  // 判断首次加载是否有数据 ，有数据的话  ，则设置默认值
  if (form.value) {
    const { province, city, district } = form.value
    if (province && city && district) {
      nextTick(() => {
        setD([province, city, district])
      })
    }
  }
})

defineExpose({
  setD,
})
</script>

<template>
  <div class="relative">
    <template v-if="props.showtitle">
      <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
        省市区<span class="color-[#D23B5A]">*</span>
      </div>
    </template>
    <div
      class="bg-[#fff]  border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center"
      :style="{ border: props.border && areaText === '' ? '1px solid #d03050' : '1px solid #E2E2E8' }">
      <template v-if="form?.province || form?.city || form?.district">
        <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="areaShow = true">
          {{ areaText }}
        </div>
      </template>
      <template v-else>
        <div class="text-[14px] color-[#C9C9C9] py-[8.5px] flex-1" @click="areaShow = true">
          请选择省市区
        </div>
      </template>
      <div class="wh-[30px] flex-center-row" @click="clearnArea">
        <van-icon
          name="close" size="20" />
      </div>
    </div>

    <div :style="{ height: props.isRequired ? '26px' : '0' }">
      <template v-if="props.border && areaText === ''">
        <div class="error">
          请填写省市区
        </div>
      </template>
    </div>

    <div class="absolute w-full">
      <common-area ref="AreaRef" v-model:show="areaShow" @on-finish="finishedArea" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] pt-[4px] color-#D23B5A';
}
</style>
