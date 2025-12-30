<script lang="ts" setup>
import type { Rules } from 'common-form'

useSeoMeta({
  title: '设备管理',
})
const isModel = ref(false)
const params = ref<AddCamera>({
  name: '',
  serial: '',
  code: '',
})
const rules = ref<Rules<AddCamera>>({
  name: [{ message: '设备名称不能为空', validator: 'required' }],
  serial: [{ message: '序列号不能为空', validator: 'required' }],
  code: [{ message: '验证码不能为空', validator: 'required' }],
})
const addCameraform = templateRef('addCameraform')

function submit(val: AddCamera) {
  console.log(val)
}
</script>

<template>
  <div>
    <div class="blur-bgc">
      <common-layout-center>
        <div class="w-fit">
          <product-manage-company />
        </div>
      </common-layout-center>
    </div>
    <template v-if="0">
      <div class="pt-[140px]">
        <common-empty text="暂无绑定设备">
          <template #icon>
            <icon
              name="i-svg:empty-webcam"
              size="128"
            />
          </template>
        </common-empty>
      </div>
    </template>
    <template v-else>
      <common-layout-center>
        <div class="p-4">
          <common-card-info title="设备管理">
            <template #titleSuffix>
              <div class="ml-2 text-[12px] text-[#333333] py-[2px] px-2 bg-[#CED4DB] rounded-4 ">
                共4台设备
              </div>
            </template>
            <template #info>
              <div class="px-3 py-2 bg-[#F4F9FD] rounded-2">
                <div class="flex items-center">
                  <div class="bg-[#4B576D] h-[40px] w-[40px] rounded-full flex justify-center items-center">
                    <icon
                      name="i-svg:webcam"
                      size="24"
                    />
                  </div>
                  <div class="flex-1 ml-2">
                    <div class="flex justify-between items-center">
                      <div class="font-semibold">
                        XXX设备号
                      </div>
                      <div class="flex items-center">
                        <div class="w-[6px] h-[6px] bg-[#41CF84] rounded-full" />
                        <div class="ml-1 text-[#8C97A7] text-[12px]">
                          设备在线
                        </div>
                      </div>
                    </div>
                    <div class="mt-1 flex justify-between items-center text-[12px]">
                      <div class="text-[#808089]">
                        设备名称
                      </div>
                      <div class="ml-1 text-[#212121] text-[12px]">
                        郑州老庙大卫城店
                      </div>
                    </div>
                    <div class="mt-1 flex justify-between items-center text-[12px]">
                      <div class="text-[#808089]">
                        序列号
                      </div>
                      <div class="ml-1 text-[#212121] text-[12px]">
                        A02A02A02A02A02A02
                      </div>
                    </div>
                  </div>
                </div>
                <div class="h-[1px] bg-[#E6E6E8] my-2" />
                <div class="flex items-center justify-between">
                  <div class="text-[#FF2F2F] flex">
                    <icon
                      name="i-svg:unbundle"
                      size="14"
                    />
                    <span class="pl-1">
                      解绑
                    </span>
                  </div>
                  <div class="text-[#1A6DD8] flex" @click="jump('/system/camera/info')">
                    <icon
                      name="i-svg:details"
                      size="14"
                    />
                    <span class="pl-1">详情</span>
                  </div>
                </div>
              </div>
            </template>
          </common-card-info>
        </div>
      </common-layout-center>
      <common-model v-model:model-value="isModel" title="新增设备" :show-ok="true" @confirm="() => addCameraform?.submit()">
        <div class="py-[16px] text-color min-h-[240px]">
          <common-form ref="addCameraform" v-model="params" :rules="rules" @submit="(val: AddCamera) => submit(val)">
            <template #name="{ error }">
              <div class="pb-[16px]">
                <div class="add-row-noline">
                  <div class="pb-2 flex items-center">
                    <span>设备名称</span>
                    <span class="text-[#FF2F2F] ml-1">*</span>
                  </div>
                  <n-input v-model:value="params.name" type="text" round placeholder="输入设备名称" />
                  <div class="text-[#FF2F2F] text-[12px] pt-2">
                    {{ error }}
                  </div>
                </div>
              </div>
            </template>
            <template #serial="{ error }">
              <div class="pb-[16px]">
                <div class="add-row-noline">
                  <div class="pb-2 flex items-center">
                    <span>序列号</span>
                    <span class="text-[#FF2F2F] ml-1">*</span>
                  </div>
                  <n-input
                    v-model:value="params.serial"
                    type="text"
                    round
                    placeholder="输入设备序列号"
                  />
                  <div class="text-[#FF2F2F] text-[12px] pt-2">
                    {{ error }}
                  </div>
                </div>
              </div>
            </template>
            <template #code="{ error }">
              <div class="pb-[16px]">
                <div class="add-row">
                  <div class="pb-2 flex items-center">
                    <span>验证码</span>
                    <span class="text-[#FF2F2F] ml-1">*</span>
                  </div>
                  <n-input v-model:value="params.code" type="text" round placeholder="输入验证码" />
                  <div class="text-[#FF2F2F] text-[12px] pt-2">
                    {{ error }}
                  </div>
                </div>
              </div>
            </template>
          </common-form>
        </div>
      </common-model>
      <common-button-bottom :cancle-show="false" confirm-text="添加设备" @confirm="isModel = true" />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
