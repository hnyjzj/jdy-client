<script setup lang="ts">
const emits = defineEmits<{
  updateParent: [val: string]
  upload: [val: any, onFinish?: () => void, id?: string]
  submit: []
}>()
const form = defineModel<updateStoreReq>({ default: {
  id: '',
  address: '',
  name: '',
  logo: '',
  province: '',
  city: '',
  district: '',
  sort: '',
  contact: '',
} })
const message = useMessage()

// form 表单尺寸
const size = ref<'small' | 'medium' | 'large'>('large')
const rules = {
  address: {
    required: true,
    message: '请输入门店地址',
    trigger: ['input', 'blur'],
  },
  name: {
    required: true,
    message: '请输入门店名称',
    trigger: ['input', 'blur'],
  },
  contact: {
    required: true,
    message: '请输入联系方式',
    trigger: ['input', 'blur'],
  },
  district: {
    required: true,
    message: '请选择省市区',
    trigger: 'change',
  },
}

const formRef = ref()
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (form.value.district) {
        emits('submit')
      }
      else {
        message.error('请选择省市区')
      }
    }
    else {
      message.error(errors[0][0].message)
    }
  })
}

// 省市区文本显示
const areaText = ref('')
const areaRef = ref()

if (form.value.province && form.value.city && form.value.district) {
  areaText.value = toProvinces(form.value.province, form.value.city, form.value.district)
  areaRef?.value?.setDefault([form.value.province, form.value.city, form.value.district])
}
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
  form.value.province = ''
  form.value.city = ''
  form.value.district = ''
  areaText.value = ''
}
const openArea = () => {
  areaShow.value = true
  if (form.value.province && form.value.city && form.value.district) {
    areaRef?.value?.setDefault([form.value.province, form.value.city, form.value.district])
  }
}
</script>

<template>
  <div>
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :size="size"
      label-placement="top"
    >
      <div class="pb-[16px] relative">
        <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
          省市区<span class="color-[#D23B5A]">*</span>
        </div>
        <div class="bg-[#fff] border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center">
          <template v-if="form.province || form.city || form.district">
            <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="openArea()">
              {{ areaText }}
            </div>
          </template>
          <template v-else>
            <div class="text-[14px] color-[#C9C9C9] py-[9.5px] flex-1" @click="openArea()">
              请输入省市区
            </div>
          </template>
          <van-icon
            name="close" @click="clearnArea()" />
        </div>
        <template v-if="!areaText">
          <div class="error">
            请填写省市区
          </div>
        </template>
        <div class="absolute w-full">
          <common-area ref="areaRef" v-model:show="areaShow" @on-finish="finishedArea" />
        </div>
      </div>

      <n-form-item label="地址" path="address">
        <n-input v-model:value="form.address" placeholder="请输入门店地址" round clearable />
      </n-form-item>
      <n-form-item label="门店名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入门店名称" round clearable />
      </n-form-item>
      <n-form-item label="联系方式" path="contact">
        <n-input v-model:value="form.contact" placeholder="请输入门店联系方式" round clearable />
      </n-form-item>
      <div
        class="text-size-[16px] font-semibold" @click="handleValidateButtonClick">
        <div class="ok">
          确定
        </div>
      </div>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[#D23B5A] text-size-[14px] line-height-[20px] mt-10px';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}

:deep(.van-popover__wrapper) {
  width: 100%;
}
</style>
