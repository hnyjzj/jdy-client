<script setup lang="ts">
const props = defineProps<{
  showName: { province_name: string }
}>()
const emits = defineEmits<{
  selectCity: []
  cleanProvince: []
  updateParent: [val: string]
  upload: [val: any, onFinish?: () => void, id?: string]
  submit: []
}>()
const form = defineModel<editStoreReq>({ default: {
  id: '',
  parent_id: undefined,
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
// 上级门店搜索框
const searchKey = ref<string>('')
const realSearchKey = ref<string>('')
// 搜索关键字 去父组件请求查询列表
const onSearch = useDebounceFn(() => {
  emits('updateParent', searchKey.value)
}, 500)

// 失去焦点 判断是否为空上级门店
const blurClean = () => {
  // 如果关键字为空，则清空 id
  if (searchKey.value === '') {
    form.value.parent_id = ''
  }
  //   如果id为空，则清空关键字
  if (form.value.parent_id === '' || form.value.parent_id === undefined) {
    searchKey.value = ''
  }
  else {
    searchKey.value = realSearchKey.value
  }
}
// 显示上级门店列表
const pop = ref(false)
const popList = ref<storesList[]>([])

// const fileList = ref<fileListArr[]>([])
// 设置logo
// const setLogo = (val: any) => {
//   fileList.value = [{ url: ImageUrl(val), isImage: true }]
// }
// 设置搜索关键字
const setKeySearch = (val?: string) => {
  if (val) {
    searchKey.value = val
    realSearchKey.value = val
  }
  else {
    searchKey.value = ''
    form.value.parent_id = ''
  }
}
// // 上传前
// const beforeRead = (file: any) => {
//   // 验证文件类型
//   if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
//     showToast('请上传 jpg 格式图片')
//     return false
//   }

//   return true
// }
// // 上传文件后
// const afterRead = async (file: any) => {
//   emits('upload', file.file, form.value.id)
// }

const options = ref<{ label: string, key: string }[]>([])
// 选择上级门店 弹出列表
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
// 选择上级门店
const seletParent = (key: string | number, options: any) => {
  form.value.parent_id = options.key as string
  searchKey.value = options.label as string
  realSearchKey.value = options.label as string
  pop.value = false
}

// 清空按钮
const clearFn = () => {
  searchKey.value = ''
  form.value.parent_id = ''
}
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

defineExpose({
  showPopup,
  // setLogo,
  setKeySearch,
})
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
      <n-form-item label="上级门店" path="parent_id">
        <n-dropdown :options="options" :show="pop" label placement="bottom-start" @select="seletParent">
          <n-input
            v-model:value="searchKey"
            round placeholder="请输入上级门店" clearable @input="() => onSearch()" @clear="clearFn" @blur="blurClean" />
        </n-dropdown>
      </n-form-item>
      <!-- <n-form-item label="上级门店" path="partent_id">
        <stores-dropdown :options="options" :show="pop">
          <n-input
            v-model:value="searchKey"
            round placeholder="请输入上级门店" clearable @input="() => onSearch()" @clear="clearFn" @blur="blurClean" />
        </stores-dropdown>
      </n-form-item> -->

      <div class="pb-[16px]">
        <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
          省市区<span class="color-[#D23B5A]">*</span>
        </div>
        <div class="bg-[#fff] border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center">
          <template v-if="form.province || form.city || form.district">
            <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="emits('selectCity')">
              {{ props.showName.province_name }}
            </div>
          </template>
          <template v-else>
            <div class="text-[14px] color-[#C9C9C9] py-[9.5px] flex-1" @click="emits('selectCity')">
              请输入省市区
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
        <template v-if="!props.showName.province_name">
          <div class="error">
            请填写省市区
          </div>
        </template>
      </div>

      <n-form-item label="地址" path="address">
        <n-input v-model:value="form.address" placeholder="请输入门店地址" round />
      </n-form-item>
      <n-form-item label="门店名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入门店名称" round />
      </n-form-item>
      <n-form-item label="联系方式" path="contact">
        <n-input v-model:value="form.contact" placeholder="请输入门店联系方式" round />
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
