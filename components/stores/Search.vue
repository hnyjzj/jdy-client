<script setup lang="ts">
import type { Rules } from 'common-form'

const props = defineProps<{
  showName: { parent_name: string, province_name: string }
}>()
const emits = defineEmits<{
  selectCity: []
  selectStore: []
  cleanParentId: []
  cleanProvince: []
  submit: [val: filterForm]
}>()
const form = defineModel<filterForm>({ default: {
  parent_id: undefined,
  address: undefined,
  name: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  contact: undefined,
  wxwork_id: undefined,
} })
const rules = ref<Rules<filterForm>>({
  parent_id: [],
  address: [],
  name: [],
  province: [],
  city: [],
  contact: [],
  district: [],
  wxwork_id: [],
})
</script>

<template>
  <div>
    <common-form v-model="form" :rules="rules" @submit="(val) => emits('submit', val)">
      <template
        #parent_id="{
          error,
        }">
        <div class="pb-[16px]">
          <div class="text-[14px] color-[#333] line-height-[20px] pb-[8px]">
            上级门店
          </div>
          <div class="bg-[#fff] rounded-full px-[12px] flex items-center">
            <template v-if="form.parent_id">
              <div class="text-[14px] color-[#333] py-[10px] flex-1" @click="emits('selectStore')">
                {{ props.showName.parent_name }}
              </div>
            </template>
            <template v-else>
              <div class="text-[14px] color-[#666] py-[10px] flex-1" @click="emits('selectStore')">
                请选择上级门店
              </div>
            </template>
            <van-icon
              name="close" @click="emits('cleanParentId')" />
          </div>
          <template v-if="error">
            <div class="error">
              {{ error }}
            </div>
          </template>
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
              v-model="form.address" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入地址" :maxlength="11" @change="validate()">
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
              v-model="form.name" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入地址" :maxlength="11" @change="validate()">
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
              name="close" @click="emits('cleanProvince')" />
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
              v-model="form.contact" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入地址" :maxlength="11" @change="validate()">
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
              v-model="form.wxwork_id" class="py-[10px] border-0 text-[14px] flex-1 color-[#333] " type="text" placeholder="请输入地址" :maxlength="11" @change="validate()">
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
</style>
