<script setup lang="ts" generic="T extends {province?: string, city?: string, district?: string}">
const props = withDefaults(defineProps<{
  border?: boolean // 校验显示隐藏错误提示边框
  showtitle?: boolean // 是否显示标题
  isRequired?: boolean // 是否必填 ，必填则会多出一个错误提示的位置 校验的时候显示
  disabled?: boolean // 是否禁用
}>(), {
  border: false,
  showtitle: true,
  isRequired: true,
  disabled: false,
})
const emits = defineEmits<{
  update: [val: T]
  updateError: [val: boolean]
}>()
const { isDark } = storeToRefs(useThemeStore())
// 显示选择器
const areaShow = ref(false)
const areaText = ref('')
const form = defineModel<T>('form')
const AreaRef = ref()
// 完场筛选
const finishedArea = (val: ProvinceTab[]) => {
  if (!val?.length || val.length !== 3)
    return
  if (!form.value) {
    // 如果没有表单数据，则手动更新 emit
    const region = {
      province: val[0].value,
      city: val[1].value,
      district: val[2].value,
    } as T
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
  if (props.disabled)
    return

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

const bordercolor = computed(() => {
  // 默认边框颜色
  const color = '1px solid #E0E0E6'

  // 如果没有校验，则根据颜色模式设置透明或默认灰色边框
  if (!props.border) {
    return isDark.value
      ? '1px solid rgba(255, 255, 255, 0)'
      : color
  }

  // 如果有校验且文本区域为空，则根据颜色模式设置红色边框
  if (props.border && areaText.value === '') {
    return isDark.value
      ? '1px solid #E0E0E6'
      : '1px solid #d03050'
  }
  else if (props.border && areaText.value !== '') {
    return isDark.value
      ? '1px solid transparent'
      : '1px solid #E0E0E6'
  }

  return color
})
defineExpose({
  setD,
})
</script>

<template>
  <div class="relative w-full">
    <template v-if="props.showtitle">
      <div class="text-[14px] color-[#333] dark:color-[#fff] line-height-[20px] pb-[8px]">
        省市区<span class="color-[#D23B5A] dark:color-[#E88080]">*</span>
      </div>
    </template>
    <div
      class="bg-[#fff] dark:color-[#fff] dark:bg-[rgba(255,255,255,0.1)] rounded-full px-[12px] flex items-center"
      :style="{ border: bordercolor }">
      <template v-if="form?.province || form?.city || form?.district">
        <div
          class="text-[14px] dark:color-[#fff] color-[#333] py-[9.5px] flex-1" @click="() => {
            if (props.disabled) return
            areaShow = true
          }">
          {{ areaText }}
        </div>
      </template>
      <template v-else>
        <div
          class="text-[14px] color-[#C9C9C9] dark:color-[#7E878E] py-[8.5px] flex-1" @click="() => {
            if (props.disabled) return
            areaShow = true
          }">
          请选择省市区
        </div>
      </template>
      <div class="wh-[30px] flex-center-row" @click="clearnArea">
        <icon name="i-icon:error" />
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
  --uno: ' dark:color-[#E88080] text-size-[14px] line-height-[20px] pt-[4px] color-#D23B5A';
}
</style>
