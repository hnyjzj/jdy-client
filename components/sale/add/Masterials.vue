<script setup lang="ts">
import type { FormRules } from 'naive-ui'

const emits = defineEmits<{
  search: [val: string]
  openProductList: []
}>()
const { oldFilterListToArray } = storeToRefs(useOld())
const showModal = ref(false)
const { useWxWork } = useWxworkStore()

const MformRef = ref()
const params = ref({} as ProductOlds)
const rules = ref<FormRules>({})
const oldRules = ref<FormRules>({
  weight_metal: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入金重',
  },
  quality_actual: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入实际成色',
  },
  recycle_method: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择回收方式',
  },
  recycle_price_labor_method: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择回收工费方式',
  },
  recycle_type: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择回收方式',
  },
})
const forRules = () => {
  oldFilterListToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'number') {
        rules.value[item.name] = {
          type: 'number',
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'select') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'number',
        }
      }
    }
  })
}
// 循环校验规则
forRules()

// 转换下拉参数
const presetToSelect = (filter: FilterWhere<ProductOlds>): { label: string, value: any }[] => {
  if (!filter.preset) {
    return []
  }
  return Object.keys(filter.preset).map((key) => {
    switch (filter.type) {
      case 'number':
        return {
          label: filter.preset[key],
          value: Number(key),
        }
      default:
        return {
          label: filter.preset[key],
          value: key,
        }
    }
  })
}
// 当前旧料的form
const nowOldMaster = defineModel('nowOldMaster', { default: {} as ProductOlds })
const hasCheck = ref(false)
// 禁用选择表单的是否自产
const Manual = ref(false)
// 搜索旧料code
const searchOld = ref('')

// 显示搜索的弹窗
const searchShow = ref(false)
const nowEditState = ref<number | undefined>(undefined)
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    searchShow.value = true
    searchOld.value = code
    nowOldMaster.value = {} as ProductOlds
    emits('search', searchOld.value)
  }
}
// 打开搜索
const searchQl = () => {
  nowEditState.value = undefined
  searchShow.value = true
  searchOld.value = ''
  nowOldMaster.value = {} as ProductOlds
}
// 手动添加
const handleAdd = () => {
  showModal.value = true
  Manual.value = true
  params.value = {} as ProductOlds
  nowEditState.value = undefined
}
// 添加商品
const showMasterialsList = defineModel<ProductOlds[]>('list', { default: [] })
const submitMasterialsForm = () => {
  MformRef.value?.validate((errors: any) => {
    if (!errors) {
      if (nowEditState.value !== undefined) {
        showMasterialsList.value.splice(nowEditState.value, 1, params.value)
      }
      else {
        showMasterialsList.value.push(params.value)
      }
      showModal.value = false
    }
  })
}
// 旧料表单 Ref

const { $toast } = useNuxtApp()
const oldMasterRef = ref()
const searchConfirm = async () => {
  oldMasterRef.value?.validate((errors: any) => {
    if (!errors) {
      const isDuplicate = showMasterialsList.value.find(item => item.code === nowOldMaster.value.code)
      if (isDuplicate && nowEditState.value === undefined) {
        $toast.error('不能添加相同商品')
        return
      }
      else {
        if (nowEditState.value !== undefined) {
          showMasterialsList.value.splice(nowEditState.value, 1, nowOldMaster.value)
        }
        else {
          showMasterialsList.value.push(nowOldMaster.value)
        }
      }
      searchShow.value = false
    }
  })
}

const editOld = (item: ProductOlds, index: number) => {
  nowEditState.value = index
  if (item.is_our) {
    nowOldMaster.value = item
    searchShow.value = true
  }
  else {
    params.value = item
    showModal.value = true
  }
}
const confirmShow = ref(false)
const delId = ref()
const deleteOld = (index: number) => {
  confirmShow.value = true
  delId.value = index
}
const deleteConfirm = () => {
  showMasterialsList.value.splice(delId.value, 1)
}
</script>

<template>
  <common-fold title="旧货" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12 gap-[20px]">
        <div
          class="btn-left col-span-4 offset-2 cursor-pointer" @click="handleAdd">
          <div class="ml-2">
            手动添加
          </div>
        </div>
        <div
          class="btn-right col-span-4 cursor-pointer" @click="searchQl()"
        >
          <!-- <icon name="i-icon:scanit" color="#1a6beb" :size="12" /> -->
          <icon name="i-icon:search" color="#1a6beb" :size="12" />
          <div class="ml-2">
            搜索
          </div>
        </div>
      </div>
    </div>
    <div class="px-[16px] py-[8px]">
      <template v-for="(obj, ix) in showMasterialsList" :key="ix">
        <div class="pb-[12px]">
          <sale-order-nesting v-model="hasCheck" :title="obj?.name || ''">
            <template #left>
              <common-tags type="pink" text="成品" :is-oval="true" />
            </template>
            <template #info>
              <div class="flex flex-col gap-[12px] px-[16px]">
                <n-grid :x-gap="12" :y-gap="8" :cols="4">
                  <template v-for="(item, index) in oldFilterListToArray" :key="index">
                    <template v-if="item.name === 'is_our'">
                      <n-grid-item :span="2">
                        {{ item.label }}: {{ obj[item.name] ? '是' : '否' }}
                      </n-grid-item>
                    </template>
                    <template v-else>
                      <n-grid-item :span="2">
                        {{ item.label }}: {{ item.input === 'select' ? item.preset[obj[item.name] as string] : obj[item.name] }}
                      </n-grid-item>
                    </template>
                  </template>
                </n-grid>

                <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                <div class="pb-[16px]">
                  <div class="flex justify-between items-center">
                    <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteOld(ix)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                    <div class="color-[#fff] bg-[#3971F3] py-[6px] px-[12px] rounded-[30px] cursor-pointer" @click="editOld(obj, ix)">
                      编辑
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </sale-order-nesting>
        </div>
      </template>
    </div>

    <common-model v-model="searchShow" title="搜索" :show-ok="true" :show-cancel="true" @confirm="searchConfirm" @cancel="searchShow = false">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex  py-[12px]">
              <div
                class="flex-center-col">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: '#333' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: '#2080F0' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                v-model:value="searchOld"
                type="text"
                clearable
                placeholder="请输入商品条码" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="emits('search', searchOld)">
                搜索
              </n-button>
              <div class="pl-[8px]">
                <n-button type="info" round @click="scanCode()">
                  扫码
                </n-button>
              </div>
            </div>
          </div>
          <div class="h-[300px] overflow-y-auto py-[16px]">
            <div>
              <template v-if="Object.keys(nowOldMaster).length !== 0">
                <n-form ref="oldMasterRef" :model="nowOldMaster" :rules="oldRules">
                  <n-grid :cols="24" :x-gap="8">
                    <n-form-item-gi
                      :span="12" label="条码">
                      {{ nowOldMaster.code }}
                    </n-form-item-gi>
                    <n-form-item-gi
                      :span="12" label="名称">
                      {{ nowOldMaster.name }}
                    </n-form-item-gi>
                    <n-form-item-gi
                      :span="12" label="回收工费方式" path="recycle_price_labor_method">
                      <n-select
                        v-model:value="nowOldMaster.recycle_price_labor_method"
                        menu-size="large"
                        placeholder="选择回收工费方式"
                        :options="[{
                          value: 1,
                          label: '按克',
                        }, {
                          value: 2,
                          label: '按件',
                        }]"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收方式" path="recycle_method">
                      <n-select
                        v-model:value="nowOldMaster.recycle_method"
                        menu-size="large"
                        placeholder="选择回收方式"
                        :options="[{
                          value: 1,
                          label: '按克',
                        }, {
                          value: 2,
                          label: '按件',
                        }]"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收工费">
                      <n-input-number
                        v-model:value="nowOldMaster.recycle_price_labor"
                        :show-button="false"
                        placeholder="请输入回收工费"
                        round
                        :precision="3"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi
                      :span="12" label="回收类型" path="recycle_type">
                      <n-select
                        v-model:value="nowOldMaster.recycle_type"
                        menu-size="large"
                        placeholder="选择回收类型"
                        :options="[{
                          value: 1,
                          label: '无',
                        }, {
                          value: 2,
                          label: '回收',
                        }, {
                          value: 3,
                          label: '兑换',
                        }]"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="金重" path="weight_metal">
                      <lazy-n-input
                        v-model:value="nowOldMaster.weight_metal"
                        :show-button="false"
                        placeholder="请输入金重"
                        round
                        min="0"
                        :precision="3"
                      />
                    </n-form-item-gi>

                    <n-form-item-gi :span="12" label="实际成色" path="quality_actual">
                      <n-input
                        v-model:value="nowOldMaster.quality_actual"
                        :show-button="false"
                        placeholder="请输入实际成色"
                        round
                        min="0"
                        :precision="3"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收金价">
                      <n-input-number
                        v-model:value="nowOldMaster.recycle_price_gold"
                        :show-button="false"
                        placeholder="请输入回收金价"
                        round
                        min="0"
                        :precision="3"
                      >
                        <template #suffix>
                          元/克
                        </template>
                      </n-input-number>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收金额">
                      <n-input-number
                        v-model:value="nowOldMaster.recycle_price"
                        :show-button="false"
                        placeholder="请输入回收金额"
                        round
                        min="0"
                        :precision="3"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="备注">
                      <n-input
                        v-model:value="nowOldMaster.remark"
                        :show-button="false"
                        placeholder=" 请输入备注"
                        round
                        min="0"
                        :precision="3"
                      />
                    </n-form-item-gi>
                  </n-grid>
                </n-form>
              </template>
            </div>
            <template v-if="!nowOldMaster.code">
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
    <common-model v-model="showModal" title="选择旧料" :show-ok="true" :show-cancel="true" @confirm="submitMasterialsForm">
      <div class="grid-12 h-[500px] overflow-y-auto">
        <div class="col-12 px-[12px]">
          <n-form ref="MformRef" :model="params" :rules="rules">
            <n-grid :cols="24" :x-gap="8">
              <template v-for="(item, index) in oldFilterListToArray" :key="index">
                <template v-if="item.input !== 'list'">
                  <n-form-item-gi :span="12" :label="item.label" :path="item.name" :required="item.required">
                    <template v-if="item.input === 'select'">
                      <n-select
                        v-model:value="(params[item.name] as number)"
                        menu-size="large"
                        :placeholder="`选择${item.label}`"
                        :options="presetToSelect(item)"
                        clearable
                      />
                    </template>
                    <template v-if="item.input === 'text'">
                      <n-input
                        v-model:value="(params[item.name] as string)" round :placeholder="`输入${item.label}`"
                      />
                    </template>
                    <template v-if="item.input === 'number'">
                      <n-input-number v-model:value="(params[item.name] as number)" round :placeholder="`输入${item.label}`" :show-button="false" />
                    </template>
                    <template v-if="item.input === 'switch'">
                      <n-switch v-model:value="(params[item.name] as boolean)" :disabled="Manual" />
                    </template>
                    <template v-if="item.input === 'textarea'">
                      <n-input v-model:value="(params[item.name] as string)" rows="1" type="textarea" />
                    </template>
                  </n-form-item-gi>
                </template>
              </template>
            </n-grid>
          </n-form>
        </div>
      </div>
    </common-model>

    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除当前旧料?"
      icon="success"
      cancel-text="否"
      confirm-text="是"
      @submit="deleteConfirm"
      @cancel="confirmShow = false"
    />
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}

.activeBtn {
  --uno: 'bg-[#2080F0] color-[#fff]';
}
.defaultBtn {
  --uno: 'bg-[#F3F3F3] color-[#000]';
}
.n-input-number {
  width: 100%;
}
</style>
