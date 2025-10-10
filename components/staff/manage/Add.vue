<script setup lang="ts">
import type { FormRules, SelectOption, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { pinyin } from 'pinyin-pro'

const props = withDefaults(defineProps<{
  filed: FilterWhere<Staff>[]
  showBotton?: boolean
}>(), {
  showBotton: true,
})
const emits = defineEmits<{
  submit: []
  upload: [val: any, onFinish: () => void]
}>()

const { $toast } = useNuxtApp()
const formlist = defineModel({ default: {
  phone: '',
  nickname: '',
  username: '',
  password: '',
  avatar: '',
  email: '',
  leader_name: '',
  gender: 0,
  is_disabled: false,
} as addStaffForm })

const toPinyin = () => {
  if (!formlist.value.nickname?.trim()) {
    formlist.value.username = ''
    return
  }
  const pinyinName = pinyin(formlist.value.nickname, { toneType: 'none', type: 'array' })
  const capitalizedStrings = pinyinName.map(str =>
    str.charAt(0).toUpperCase() + str.substring(1),
  )
  formlist.value.username = capitalizedStrings.join('')
}

const genderList = [{ text: '未知', value: 0 }, { text: '男', value: 1 }, { text: '女', value: 2 }]
const rules = {} as FormRules

const forRules = () => {
  props.filed.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'password') {
        rules[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'number') {
        rules[item.name] = {
          type: 'number',
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'select') {
        rules[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'string',
        }
      }
      if (item.input === 'upload') {
        rules[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'number',
        }
      }
      if (item.input === 'switch') {
        rules[item.name] = {
          required: true,
          trigger: ['blur'],
          message: `请选择${item.label}`,
          type: 'boolean',
        }
      }
    }
  })
}
forRules()

const formRef = defineModel<any>('form')
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

const options = ref<SelectOption[]>([])
// 扫码
const { useWxWork } = useWxworkStore()
const selectPer = async () => {
  const wx = await useWxWork()
  wx?.selectDepartment().then((res) => {
    if (res.userList.length) {
      formlist.value.leader_name = res.userList[0].id
      options.value = res.userList.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
    else {
      options.value = []
      formlist.value.leader_name = ''
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
const changeNickname = () => {
  formlist.value.nickname = formlist.value.nickname.replace(/[^\u4E00-\u9FA5]/g, '')
  toPinyin()
}
defineExpose({
  clearAvatar,
})
</script>

<template>
  <div>
    <div class="pb-[12px]">
      <common-fold title="新增员工" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="formlist"
            :rules="rules"
            label-placement="top"
            size="medium"
          >
            <n-grid :cols="24" :x-gap="8">
              <template v-for="(item, index) in props.filed" :key="index">
                <template v-if="item.create">
                  <n-form-item-gi
                    :span="12"
                    :path="item.name"
                    :label="item.label">
                    <template v-if="item.input === 'text' && item.name !== 'nickname'">
                      <n-input
                        v-model:value="(formlist[item.name] as string)"
                        :placeholder="`请输入${item.label}`"
                        round
                        @focus="focus"
                      />
                    </template>
                    <template v-if="item.name === 'nickname'">
                      <n-input
                        v-model:value="(formlist[item.name] as string)"
                        :placeholder="`请输入${item.label}`"
                        round
                        @focus="focus"
                        @blur="changeNickname()"
                      />
                    </template>
                    <template v-if="item.input === 'password'">
                      <n-input
                        v-model:value="(formlist[item.name] as string)"
                        :placeholder="`请输入${item.label}`"
                        round
                        @focus="focus"
                      />
                    </template>
                    <template v-if="item.input === 'upload'">
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
                    </template>
                    <template v-if="item.input === 'radio'">
                      <n-radio-group v-model:value="(formlist[item.name] as number)">
                        <n-space>
                          <template v-for="(obj, i) in genderList" :key="i">
                            <n-radio
                              :value="obj.value" :style="{
                                '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                                '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                                '--n-dot-color-active': '#0068ff',
                                '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                              {{ obj.text }}
                            </n-radio>
                          </template>
                        </n-space>
                      </n-radio-group>
                    </template>
                    <template v-if="item.input === 'select' && item.name === 'leader_name'">
                      <n-select v-model:value="formlist[item.name]" clearable :options="options" placeholder="请选择上级" @click="selectPer" />
                    </template>
                    <template v-if="item.input === 'switch'">
                      <n-switch v-model:value="(formlist[item.name] as boolean)" size="medium" :style="{ 'border-radius': '20px' }" round />
                    </template>
                  </n-form-item-gi>
                </template>
              </template>
            </n-grid>
            <template v-if="props.showBotton">
              <div class="grid-12 px-[26px]">
                <div
                  class="font-semibold pb-[26px] cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                  <div @click="handleValidateButtonClick">
                    <common-button-rounded content="确定" />
                  </div>
                </div>
              </div>
            </template>
          </n-form>
          <n-modal
            v-model:show="showModalRef"
            preset="card"
            style="width: 600px"
          >
            <img :src="ImageUrl(formlist.avatar as string)" style="width: 100%;">
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
