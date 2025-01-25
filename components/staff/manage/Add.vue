<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const emits = defineEmits<{
  submit: []
  upload: [val: any, onFinish: () => void]
}>()

const message = useMessage()
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
    trigger: 'change',
    message: '请选择性别',
  },

}
const formRef = ref()
function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
    //   message.success('验证成功')
      emits('submit')
    }
    else {
      message.error('验证失败')
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
    message.error('只能上传png,jpeg格式的图片文件,请重新上传')
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
    <div class="pb-[16px]">
      <common-fold title="新增员工" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="formlist.account"
            :rules="rules"
            label-placement="top"
          >
            <n-form-item :span="12" label="手机号" path="phone">
              <n-input
                v-model:value="formlist.account.phone"
                placeholder="请输入手机号"
                round
              />
            </n-form-item>
            <n-form-item :span="12" label="姓名" path="nickname">
              <n-input
                v-model:value="formlist.account.nickname"
                placeholder="请输入姓名"
                round
              />
            </n-form-item>
            <n-form-item :span="12" label="密码" path="password">
              <n-input
                v-model:value="formlist.account.password"
                placeholder="请输入密码"
                round
              />
            </n-form-item>
            <n-form-item :span="12" label="email" path="email">
              <n-input
                v-model:value="formlist.account.email"
                placeholder="请输入email"
                round
              />
            </n-form-item>
            <n-form-item :span="12" label="性别" path="gender">
              <n-radio-group v-model:value="formlist.account.gender">
                <n-space>
                  <n-radio value="0">
                    未知
                  </n-radio>
                  <n-radio value="1">
                    男
                  </n-radio>
                  <n-radio value="2">
                    女
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              label="头像">
              <n-upload
                :key="keyUpload"
                action="#"
                :custom-request="customRequest"
                :default-file-list="previewFileList"
                list-type="image-card"
                :max="1"
                @before-upload="beforeUpload"
                @preview="showModalRef = true"
              />
            </n-form-item>
            <div @click="clearAvatar()">
              12313
            </div>
            <div
              class="text-size-[16px] font-semibold py-[16px] cursor-pointer" @click="handleValidateButtonClick">
              <div class="ok">
                登录
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
    .ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}
</style>
