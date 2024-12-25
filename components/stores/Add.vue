<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const emits = defineEmits<{
  selectCity: []
  cleanProvince: []
  updateParent: [val: string]
  upload: [val: any, onFinish: () => void]
  submit: []
}>()
const message = useMessage()

const { addForm, addsearchKey, addrealSearchKey, showName } = storeToRefs(useStores())
// 展示预览图
const showModalRef = ref(false)
// 显示上级门店列表弹窗
const pop = ref(false)
// 上级门店列表
const popList = ref<storesList[]>([])
// 上级门店搜索框
// form 表单尺寸
const size = ref<'small' | 'medium' | 'large'>('large')
// 文件列表
const previewFileList = ref<UploadFileInfo[]>([])
const formRef = ref()
const options = ref<{ label: string, key: string }[]>([])

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
    message: '请输入联系方式',
    trigger: ['input', 'blur'],
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
// 搜索上级门店
const onSearch = useDebounceFn(() => {
  emits('updateParent', addsearchKey.value)
}, 500)
// 清空上级门店输入框
const clearFn = () => {
  addsearchKey.value = ''
  addForm.value.parent_id = ''
}
// 失去焦点 判断是否为空上级门店
const blurClean = () => {
  // 如果关键字为空，则清空 id
  if (addsearchKey.value === '') {
    addForm.value.parent_id = ''
  }
  //   如果id为空，则清空关键字
  if (addForm.value.parent_id === '' || addForm.value.parent_id === undefined) {
    addsearchKey.value = ''
  }
  else {
    // 如果 id不为空，则搜索关键字赋值为初始化关键字·
    addsearchKey.value = addrealSearchKey.value
  }
  setTimeout(() => {
    pop.value = false
  }, 100)
}
// 选择上级门店
const seletParent = (key: string | number, options: any) => {
  addForm.value.parent_id = options.key as string
  addsearchKey.value = options.label as string
  addrealSearchKey.value = options.label as string
  pop.value = false
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
      if (addForm.value.district) {
        emits('submit')
      }
      else {
        areaError.value = true
        message.error('请选择省市区')
      }
    }
    else {
      message.error(errors[0][0].message)
      if (!addForm.value.district) {
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

defineExpose({
  showPopup,
})
</script>

<template>
  <div class="pb-[40px]">
    <n-form
      ref="formRef"
      :model="addForm"
      :rules="rules"
      :size="size"
      label-placement="top">
      <n-form-item label="上级门店" path="parent_id">
        <n-dropdown :options="options" :show="pop" label placement="bottom-start" @select="seletParent">
          <n-input
            v-model:value="addsearchKey"
            round placeholder="请输入上级门店" clearable @input="() => onSearch()" @clear="clearFn" @blur="blurClean" />
        </n-dropdown>
      </n-form-item>
      <n-form-item label="门店名称" path="name">
        <n-input v-model:value="addForm.name" placeholder="请输入门店名称" round clearable />
      </n-form-item>
      <div class="pb-[16px]">
        <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
          省市区<span class="color-[#D23B5A]">*</span>
        </div>
        <div
          class="bg-[#fff]  border-[#E2E2E8] border-solid border rounded-full px-[12px] flex items-center"
          :style="{ border: areaError && showName.province_name === '' ? '1px solid #d03050' : ' 1px solid #E2E2E8' }">
          <template v-if="addForm.province || addForm.city || addForm.district">
            <div class="text-[14px] color-[#333] py-[9.5px] flex-1" @click="emits('selectCity')">
              {{ showName.province_name }}
            </div>
          </template>
          <template v-else>
            <div class="text-[14px] color-[#C9C9C9] py-[9.5px] flex-1" @click="emits('selectCity')">
              请选择省市区
            </div>
          </template>
          <van-icon
            name="close" @click="() => {
              addForm.province = ''
              addForm.city = ''
              addForm.district = ''
              emits('cleanProvince')
            }" />
        </div>
        <template v-if="areaError && showName.province_name === ''">
          <div class="error">
            请填写省市区
          </div>
        </template>
      </div>
      <n-form-item label="地址" path="address">
        <n-input v-model:value="addForm.address" placeholder="请输入门店地址" round clearable />
      </n-form-item>
      <n-form-item label="联系方式" path="contact">
        <n-input v-model:value="addForm.contact" placeholder="请输入门店联系方式" round clearable />
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

      <n-form-item label="排序" path="sort ">
        <n-input-number v-model:value="addForm.sort" clearable placeholder="请输入排序" round />
      </n-form-item>

      <div
        class="text-size-[16px] font-semibold" @click="handleValidateButtonClick">
        <div class="ok">
          确定
        </div>
      </div>
    </n-form>
    <n-modal
      v-model:show="showModalRef"
      preset="card"
      style="width: 600px"
    >
      <img :src="ImageUrl(addForm.logo as string)" style="width: 100%;">
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px color-#D23B5A';
}
.ok {
  --uno: 'w-full bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
:deep(.van-popover__wrapper) {
  width: 100%;
}
:deep(.n-input-number) {
  width: 100%;
}
</style>
