<script setup lang="ts">
// 搜索门店
import type { FormRules, SelectOption, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { pinyin } from 'pinyin-pro'

const props = defineProps<{
  getStoreList: (val: string) => Promise<Stores[]>
  getRegionList: (val: string) => Promise<Region[]>
}>()
const emits = defineEmits<{
  submit: []
  editPawd: []
  upload: [val: any, onFinish: () => void]
}>()

const { $toast } = useNuxtApp()
const formlist = defineModel({ default: {
  id: '',
  phone: '',
  nickname: '',
  username: '',
  avatar: '',
  email: '',
  gender: 0,
  is_disabled: false,
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
} as updateStaffForm })

const toPinyin = () => {
  const pinyinName = pinyin(formlist.value.nickname!, { toneType: 'none', type: 'array' })
  const capitalizedStrings = pinyinName.map(str =>
    str.charAt(0).toUpperCase() + str.substring(1),
  )
  formlist.value.username = capitalizedStrings.join('')
}

const genderList = [{ text: '未知', value: 0 }, { text: '男', value: 1 }, { text: '女', value: 2 }]
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: `请输入用户名`,
  },
  nickname: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: `请输入姓名`,
  },
  phone: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: `请输入手机号`,
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
if (formlist.value.avatar) {
  previewFileList.value.push({
    id: useId(),
    name: formlist.value.username!,
    status: 'finished',
    url: formlist.value.avatar,
    type: 'image/png',
  })
}
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
const defaultform = defineModel<{ [key: string]: { label: string, value: string }[] }>('default-form', { default:
     { stores: [], stores_superior: [], regions: [], regions_superior: [] } })
const Stores = ref<SelectOption[]>([])
if (formlist.value.store_ids?.length) {
  Stores.value = defaultform.value.stores
}
if (formlist.value.store_superior_ids?.length) {
  Stores.value = defaultform.value.stores_superior
}
const loadingStores = ref(false)
const getStores = useDebounceFn(async (query) => {
  const res = await props.getStoreList(query)
  loadingStores.value = false
  if (res.length) {
    Stores.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStores = (query: string) => {
  loadingStores.value = true
  getStores(query)
}
const Regions = ref<SelectOption[]>([])
if (formlist.value.region_ids?.length) {
  Regions.value = defaultform.value.regions
}
if (formlist.value.region_superior_ids?.length) {
  Regions.value = defaultform.value.regions_superior
}
const loadingRegions = ref(false)
const getRegions = useDebounceFn(async (query) => {
  const res = await props.getRegionList(query)
  loadingRegions.value = false
  if (res.length) {
    Regions.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchRegions = (query: string) => {
  loadingRegions.value = true
  getRegions(query)
}

const parsswordForm = defineModel('password', {
  default: {
    id: '',
    password: '',
  },
})

// 修改密码
const editPassword = () => {
  if (!parsswordForm.value.password) {
    $toast.error('请输入密码')
    return false
  }
  else {
    emits('editPawd')
  }
}
defineExpose({
  clearAvatar,
})
</script>

<template>
  <div>
    <div class="">
      <common-fold title="编辑员工" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="formlist"
            :rules="rules"
            label-placement="top"
            size="medium"
          >
            <n-grid :cols="24" :x-gap="8">
              <n-form-item-gi
                :span="12"
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
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="手机号" path="phone">
                <n-input
                  v-model:value="formlist.phone"
                  placeholder="请输入手机号"
                  round
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="用户名" path="nickname">
                <n-input
                  v-model:value="formlist.username"
                  placeholder="请输入用户名"
                  round
                  @focus="focus"

                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="姓名" path="nickname">
                <n-input
                  v-model:value="formlist.nickname"
                  placeholder="请输入姓名"
                  round
                  @focus="focus"
                  @blur="toPinyin"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="email" path="email">
                <n-input
                  v-model:value="formlist.email"
                  placeholder="请输入email"
                  round
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="性别" path="gender">
                <n-radio-group v-model:value="formlist.gender">
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
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="所属门店" path="store_ids">
                <n-select
                  v-model:value="formlist.store_ids"
                  multiple
                  filterable
                  placeholder="搜索门店选择"
                  :options="Stores"
                  :loading="loadingStores"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchStores"
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责门店" path="store_superior_ids">
                <n-select
                  v-model:value="formlist.store_superior_ids"
                  multiple
                  filterable
                  placeholder="搜索门店选择"
                  :options="Stores"
                  :loading="loadingStores"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchStores"
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="所属区域" path="region_ids">
                <n-select
                  v-model:value="formlist.region_ids"
                  multiple
                  filterable
                  placeholder="搜索区域选择"
                  :options="Regions"
                  :loading="loadingRegions"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchRegions"
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责区域" path="region_superior_ids">
                <n-select
                  v-model:value="formlist.region_superior_ids"
                  multiple
                  filterable
                  placeholder="搜索区域选择"
                  :options="Regions"
                  :loading="loadingRegions"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchRegions"
                  @focus="focus"
                />
              </n-form-item-gi>
            </n-grid>

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
            <img :src="ImageUrl(formlist.avatar as string)" style="width: 100%;">
          </n-modal>
        </div>
      </common-fold>
      <div class="pt-[12px]">
        <common-fold title="修改密码" from-color="#9EBAF9" to-color="#fff">
          <div class="p-[16px]">
            <n-form
              ref="formRef"
              :model="parsswordForm"
              label-placement="left"
              size="medium"
            >
              <n-grid :cols="24" gap="8">
                <n-form-item-gi :span="24" label="密码">
                  <n-input
                    v-model:value="parsswordForm.password"
                    placeholder="请输入要修改的密码"
                    round
                    @focus="focus"
                  />
                </n-form-item-gi>
              </n-grid>
              <div class="grid-12 px-[26px]">
                <div
                  class="font-semibold  cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                  <div @click="editPassword">
                    <common-button-rounded content="修改密码" />
                  </div>
                </div>
              </div>
            </n-form>
            <n-grid :cols="24" :x-gap="8" />
          </div>
        </common-fold>
      </div>
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
