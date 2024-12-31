<script setup lang="ts">
import type { FormItemRule, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const emits = defineEmits<{
  upload: [val: any, onFinish: () => void]
  submit: []
  editSubmit: []

}>()
const message = useMessage()

const { addorUpdateForm } = storeToRefs(useStores())
// 展示预览图
const showModalRef = ref(false)

// form 表单尺寸
const size = ref<'small' | 'medium' | 'large'>('large')
// 文件列表
const previewFileList = ref<UploadFileInfo[]>([])
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
    trigger: ['blur'],
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
    message.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}

// 预览图片
function handlePreview() {
  showModalRef.value = true
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
        message.error('请选择省市区')
      }
    }
    else {
      message.error(errors[0][0].message)
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
// 省市区文本显示
const areaText = ref('')
// 展示地址选择器
const areaShow = ref(false)
// 选择地址完成
const finishedArea = (val: ProvinceTab[]) => {
  addorUpdateForm.value.province = val[0].value
  addorUpdateForm.value.city = val[1].value
  addorUpdateForm.value.district = val[2].value
  areaText.value = `${val[0].text} ${val[1].text} ${val[2].text}`
}
// 清理选择地址
const clearnArea = () => {
  addorUpdateForm.value.province = undefined
  addorUpdateForm.value.city = undefined
  addorUpdateForm.value.district = undefined
  areaText.value = ''
}
const areaRef = ref()
const { province, city, district } = addorUpdateForm.value
if (province && city && district) {
  areaText.value = toProvinces(province, city, district)
  areaRef?.value?.setDefault([province, city, district])
}
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
        <div>
          <n-form-item label="门店名称" path="name">
            <n-input v-model:value="addorUpdateForm.name" placeholder="请输入门店名称" round clearable />
          </n-form-item>
          <div class="pb-[16px] relative">
            <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
              省市区<span class="color-[#D23B5A]">*</span>
            </div>
            <div
              class="bg-[#fff]  border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center"
              :style="{ border: areaError && areaText === '' ? '1px solid #d03050' : ' 1px solid #E2E2E8' }">
              <template v-if="addorUpdateForm.province || addorUpdateForm.city || addorUpdateForm.district">
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
                name="close" @click="clearnArea" />
            </div>
            <template v-if="areaError && areaText === ''">
              <div class="error">
                请填写省市区
              </div>
            </template>
            <div class="absolute w-full">
              <common-area ref="areaRef" v-model:show="areaShow" @on-finish="finishedArea" />
            </div>
          </div>
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
              @preview="handlePreview"
            />
          </n-form-item>
        </div>

        <div
          class="text-size-[16px] font-semibold pt-[60px]" @click="handleValidateButtonClick">
          <div class="ok">
            确定
          </div>
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

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px color-#D23B5A';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
:deep(.van-popover__wrapper) {
  width: 100%;
}
:deep(.n-input-number) {
  width: 100%;
}
</style>
