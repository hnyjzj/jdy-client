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
  submit: [val: Where]
}>()
const { formList, searchKey } = storeToRefs(useStores())
const form = defineModel<Where>({ default: {
} })
form.value = formList.value

const rules = ref<Rules<Where>>({
  parent_id: [],
  address: [],
  name: [],
  province: [],
  city: [],
  contact: [],
  district: [],
  wxwork_id: [],
})

// const searchKey = ref<string>('')
const onSearch = useDebounceFn(() => {
  emits('updateParent', searchKey.value)
}, 1000)
const clearFn = () => {
  searchKey.value = ''
  form.value.parent_id = ''
}
const blurClean = () => {
  if (searchKey.value === '') {
    form.value.parent_id = ''
  }
  if (form.value.parent_id === '') {
    searchKey.value = ''
  }
}
// 显示上级门店列表
const pop = ref(false)
const popList = ref<storesList[]>([])
const showPopup = (res: any) => {
  popList.value = res
  pop.value = true
}
defineExpose({
  showPopup,
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
                @clear="clearFn"
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
            地址
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
            店名
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
        #province="{
          error,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            省市区
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <template v-if="form.province || form.city || form.district">
              <div class="text-[14px] color-[#333] py-[10px] flex-1" @click="emits('selectCity')">
                {{ props.showName.province_name }}
              </div>
            </template>
            <template v-else>
              <div class="text-[14px] color-[#666] py-[10px] flex-1" @click="emits('selectCity')">
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
            联系方式
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
      <template
        #wxwork_id="{
          error,
          validate,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            企业微信id
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <input
              v-model="form.wxwork_id" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入企业微信id" @change="validate()">
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
