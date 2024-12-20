<script setup lang="ts">
import type { Rules } from 'common-form'

const props = defineProps<{
  showName: { province_name: string }
}>()
const emits = defineEmits<{
  selectCity: []
  selectStore: []
  cleanParentId: []
  cleanProvince: []
  updateParent: [val: string]
  upload: [val: any, id: string]
  selectAsync: []
  submit: [val: editStoreReq]
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
const rules = ref<Rules<editStoreReq>>({
  parent_id: [],
  address: [{
    message: '地址不能为空',
    validator: 'required',
  }],
  name: [
    {
      message: '店名不能为空',
      validator: 'required',
    },
  ],
  logo: [],
  province: [
    {
      message: '省市区不能为空',
      validator: 'required',
    },
  ],
  city: [],
  contact: [{
    message: '联系方式不能为空',
    validator: 'required',
  }],
  district: [],
})

// 上级门店搜索框
const searchKey = ref<string>('')

// 搜索关键字 去父组件请求查询列表
const onSearch = useDebounceFn(() => {
  emits('updateParent', searchKey.value)
}, 1000)

// 失去焦点 判断是否为空上级门店
const blurClean = () => {
  // 如果关键字为空，则清空 id
  if (searchKey.value === '') {
    form.value.parent_id = ''
  }
  //   如果id为空，则清空关键字
  if (form.value.parent_id === '') {
    searchKey.value = ''
  }
}
// 显示上级门店列表
const pop = ref(false)
const popList = ref<storesList[]>([])

// 显示气泡列表
const showPopup = (res: any) => {
  popList.value = res
  pop.value = true
}
const fileList = ref<fileListArr[]>([])
// 设置logo
const setLogo = (val: any) => {
  fileList.value = [{ url: ImageUrl(val), isImage: true }]
}
// 设置搜索关键字
const setKeySearch = (val?: string) => {
  if (val) {
    searchKey.value = val
  }
  else {
    searchKey.value = ''
    form.value.parent_id = ''
  }
}
// 上传前
const beforeRead = (file: any) => {
  // 验证文件类型
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showToast('请上传 jpg 格式图片')
    return false
  }

  return true
}
// 上传文件后
const afterRead = async (file: any) => {
  emits('upload', file.file, form.value.id)
}
defineExpose({
  showPopup,
  setLogo,
  setKeySearch,
})
</script>

<template>
  <div>
    <common-form v-model="form" :rules="rules" @submit="(val) => emits('submit', val)">
      <template
        #parent_id>
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            上级门店
          </div>
          <van-popover v-model:show="pop" trigger="manual" placement="bottom-start">
            <div class="px-[12px] w-[260px]">
              <template v-if="popList.length === 0">
                <div class="py-[12px] text-[14px] color-[#666]">
                  暂无相关门店,换个关键字试试吧
                </div>
              </template>

              <template v-for="(item, index) in popList" :key="index">
                <div
                  class="py-[12px] border-b-[#E6E6E8] border-b-solid border text-[14px] overflow-hidden text-ellipsis text-nowrap"
                  :style="{ borderBottom: index === popList.length - 1 ? 'none' : '1px solid #E6E6E8', color: item.id === form.parent_id ? '#578AFA' : '#000' }"
                  @click="() => {
                    searchKey = item.name
                    form.parent_id = item.id
                    pop = false
                  }">
                  {{ item.name }}
                </div>
              </template>
            </div>
            <template #reference>
              <van-search
                v-model="searchKey"
                autocomplete="off"
                shape="round"
                :style="{
                  '--van-search-padding': '0',
                  '--van-search-background': '#ffffff',
                  '--van-search-content-background': '#fff',
                }"
                background="#F1F5FE"
                placeholder="请输入搜索关键词"
                @update:model-value="onSearch"
                @search="onSearch"
                @clear="setKeySearch()"
                @blur="blurClean"

              />
            </template>
          </van-popover>
        </div>
      </template>
      <template
        #address="{
          error,
          validate,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            地址<span class="color-red-4">*</span>
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <input
              v-model="form.address" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入地址" @change="validate()">
            <van-icon name="arrow" />
          </div>
          <template v-if="error">
            <div class="error">
              {{ error }}
            </div>
          </template>
        </div>
      </template>
      <template
        #name="{
          error,
          validate,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            店名<span class="color-red-4">*</span>
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <input
              v-model="form.name" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入店名" @change="validate()">
            <van-icon name="arrow" />
          </div>
          <template v-if="error">
            <div class="error">
              {{ error }}
            </div>
          </template>
        </div>
      </template>
      <template
        #logo>
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            logo
          </div>
          <van-uploader
            v-model="fileList"
            :style="{
              '--van-uploader-upload-background': 'white',
            }"
            max-count="1"
            :after-read="afterRead"
            :preview-options="{ closeable: true }" multiple :before-read="beforeRead"
            @delete="() => {
              form.logo = ''
            }" />
        </div>
      </template>
      <template
        #province="{
          error,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            省市区<span class="color-red-4">*</span>
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <template v-if="form.province && form.city && form.district">
              <div class="text-[14px] color-[#333] py-[10px] flex-1" @click="emits('selectCity')">
                {{ props.showName.province_name }}
              </div>
            </template>
            <template v-else>
              <div class="text-[14px] color-[#666] py-[10px] flex-1" @click="emits('selectCity')">
                请选择省市区
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
          <template v-if="error">
            <div class="error">
              {{ error }}
            </div>
          </template>
        </div>
      </template>

      <template
        #contact="{
          error,
          validate,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            联系方式<span class="color-red-4">*</span>
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <input
              v-model="form.contact" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入联系方式" :maxlength="11" @change="validate()">
            <van-icon name="arrow" />
          </div>
          <template v-if="error">
            <div class="error">
              {{ error }}
            </div>
          </template>
        </div>
      </template>

      <template #actions="{ submit }">
        <div
          class="text-size-[16px] font-semibold" @click="submit">
          <div class="ok">
            确定
          </div>
        </div>
      </template>
    </common-form>
  </div>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}

:deep(.van-popover__wrapper) {
  width: 100%;
}
</style>
