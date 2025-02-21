<script setup lang="ts">
import type { FormRules, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const emits = defineEmits<{
  submit: []
  upload: [val: any, onFinish: () => void]
}>()

const { $toast } = useNuxtApp()
const formlist = defineModel({ default: {
  account: {
    phone: '',
    nickname: '',
    password: '',
    avatar: '',
    email: '',
    gender: 0,
  },
} })
const genderList = [{ text: '未知', value: 0 }, { text: '男', value: 1 }, { text: '女', value: 2 }]
const rules = {
  phone: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入手机号',
  },
  nickname: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入姓名',
  },
  email: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入邮箱',
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码',
  },
  gender: {
    required: true,
    type: 'number',
    trigger: 'change',
    message: '请选择性别',
  },

} as FormRules
const formRef = ref()
function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      emits('submit')
    }
    else {
      $toast.error('验证失败')
    }
  })
}
// 展示预览图
const showModalRef = ref(false)
const previewFileList = ref<UploadFileInfo[]>([])
// 上传
const customRequest = ({ file, onFinish }: UploadCustomRequestOptions) => {
  // 上传接口
  emits('upload', file.file, onFinish)
}
// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}
const keyUpload = ref()
const onChangeKey = () => {
  keyUpload.value = Date.now()
}
const clearAvatar = () => {
  previewFileList.value = []
  onChangeKey()
}

defineExpose({
  clearAvatar,
})
</script>

<template>
  <div>
    <div class="">
      <common-fold title="新增员工" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="formlist.account"
            :rules="rules"
            label-placement="top"
            size="large"
          >
            <n-form-item
              label="头像">
              <n-upload
                :key="keyUpload"
                :style="{ '--n-dragger-border-hover': '#0068ff' }"
                action="#"
                :custom-request="customRequest"
                :default-file-list="previewFileList"
                list-type="image-card"
                :max="1"

                @before-upload="beforeUpload"
                @preview="showModalRef = true"
              />
            </n-form-item>
            <n-grid :cols="24" :x-gap="8">
              <n-form-item-gi :span="12" label="手机号" path="phone">
                <n-input
                  v-model:value="formlist.account.phone"
                  placeholder="请输入手机号"
                  round
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="姓名" path="nickname">
                <n-input
                  v-model:value="formlist.account.nickname"
                  placeholder="请输入姓名"
                  round
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="密码" path="password">
                <n-input
                  v-model:value="formlist.account.password"
                  placeholder="请输入密码"
                  round
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="email" path="email">
                <n-input
                  v-model:value="formlist.account.email"
                  placeholder="请输入email"
                  round
                />
              </n-form-item-gi>
            </n-grid>

            <n-form-item :span="12" label="性别" path="gender">
              <n-radio-group v-model:value="formlist.account.gender">
                <n-space>
                  <template v-for="(item, index) in genderList" :key="index">
                    <n-radio
                      :value="item.value" :style="{
                        '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                        '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                        '--n-dot-color-active': '#0068ff',
                        '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                      {{ item.text }}
                    </n-radio>
                  </template>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <div class="grid-12 px-[26px]">
              <div
                class="font-semibold pb-[26px] cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                <div @click="handleValidateButtonClick">
                  <common-button-rounded content="确定" />
                </div>
              </div>
            </div>
          </n-form>
          <n-modal
            v-model:show="showModalRef"
            preset="card"
            style="width: 600px"
          >
            <img :src="ImageUrl(formlist.account.avatar as string)" style="width: 100%;">
          </n-modal>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}

.n-radio .n-radio__dot.n-radio__dot--checked {
  box-shadow: inset 0 0 0 1px #0068ff;
}
</style>
