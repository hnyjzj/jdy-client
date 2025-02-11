<script setup lang="ts">
import type { FormItemRule, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const emits = defineEmits<{
  upload: [val: any, onFinish: () => void]
  submit: []
  editSubmit: []
}>()
const { $toast } = useNuxtApp()
const { addorUpdateForm } = storeToRefs(useStores())
// 展示预览图
const showModalRef = ref(false)
// form 表单尺寸
const size = ref<'small' | 'medium' | 'large'>('large')
// 文件列表
const previewFileList = ref<UploadFileInfo[]>([])
if (addorUpdateForm.value.logo && addorUpdateForm.value.id) {
  previewFileList.value.push({
    id: addorUpdateForm.value.id,
    name: 'Logo',
    status: 'finished',
    url: ImageUrl(addorUpdateForm.value.logo),
  })
}
const formRef = ref()
// 表单验证
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
    message: '请输入正确的联系方式',
    trigger: ['blur', 'input'],
    validator: (rule: FormItemRule, value: string) => {
      return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)
    },
  },
  district: {
    required: true,
    message: '请选择省市区',
    trigger: 'change',
  },
}
// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}

const areaError = ref(false)
// 表单校验
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (addorUpdateForm.value.district) {
        if (addorUpdateForm.value.id) {
          emits('editSubmit')
        }
        else {
          emits('submit')
        }
      }
      else {
        areaError.value = true
        $toast.error('请选择省市区')
      }
    }
    else {
      $toast.error(errors[0][0].message)
      if (!addorUpdateForm.value.district) {
        areaError.value = true
      }
    }
  })
}

// 上传
const customRequest = ({ file, onFinish }: UploadCustomRequestOptions) => {
  // 上传接口
  emits('upload', file.file, onFinish)
}
const areaRef = ref()
const { province, city, district } = addorUpdateForm.value
if (province && city && district) {
  setTimeout(() => {
    areaRef?.value?.setD([province, city, district])
  }, 10)
}
// 清空预览图
onUnmounted(() => {
  previewFileList.value = []
})
</script>

<template>
  <div class="">
    <n-form
      ref="formRef"
      :model="addorUpdateForm"
      :rules="rules"
      :size="size"
      label-placement="top">
      <div class=" flex-col justify-between">
        <div class="pb-[40px]">
          <n-form-item label="门店名称" path="name">
            <n-input v-model:value="addorUpdateForm.name" placeholder="请输入门店名称" round clearable />
          </n-form-item>
          <common-area-select ref="areaRef" :border="areaError" :form="addorUpdateForm" @update-error="(val: boolean) => { areaError = val }" />
          <n-form-item label="地址" path="address">
            <n-input v-model:value="addorUpdateForm.address" placeholder="请输入门店地址" round clearable />
          </n-form-item>
          <n-form-item label="联系方式" path="contact">
            <n-input v-model:value="addorUpdateForm.contact" maxlength="11" placeholder="请输入门店联系方式" round clearable />
          </n-form-item>
          <n-form-item
            label="logo">
            <n-upload
              action="#"
              :custom-request="customRequest"
              :default-file-list="previewFileList"
              list-type="image-card"
              :max="1"
              @before-upload="beforeUpload"
              @preview="showModalRef = true"
            />
          </n-form-item>
        </div>

        <div @click="handleValidateButtonClick">
          <common-button-rounded content="确定" />
        </div>
      </div>
    </n-form>
    <n-modal
      v-model:show="showModalRef"
      preset="card"
      style="width: 600px"
    >
      <img :src="ImageUrl(addorUpdateForm.logo as string)" style="width: 100%;">
    </n-modal>
  </div>
</template>
