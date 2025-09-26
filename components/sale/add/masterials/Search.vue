<script lang="ts" setup>
import type { FormRules } from 'naive-ui'
import { calc } from 'a-calc'

const props = defineProps<{
  checkOldClass: (params: Partial<OrderMaterial>) => any
  nowEditState?: number
  price: GoldPrices[]
  billingSet: BillingSet
  oldFilterList: Where<OrderMaterial>
  storeid: string
}>()
const { $toast } = useNuxtApp()
const { OldObj } = storeToRefs(useOrder())
const { getFinishedRetrieval } = useFinished()
// 搜索旧料
const searchOlds = async (val: string) => {
  if (val) {
    const data = await getFinishedRetrieval(val, props.storeid)
    if (data?.code === HttpCode.SUCCESS && data?.data?.status === GoodsStatus.ProductStatusSold) {
      const params = data.data
      OldObj.value = params
      OldObj.value.product_id = params.id
      OldObj.value.weight_metal = Number(params.weight_metal)
      OldObj.value.code_finished = params.code
    }
    else {
      $toast.error('没有找到旧料')
    }
  }
}
// 旧料表单 Ref
const oldMasterRef = ref()
const oldRules = ref<FormRules>({
  weight_metal: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入金重',
  },
  quality_actual: {
    type: 'number',
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
    message: '请选择回收类型',
  },
})
const searchShow = defineModel<boolean>('show', { default: false })
const orderObject = defineModel<Orders>({ default: {} as Orders })

const searchInput = ref()
const nowOldMaster = defineModel('nowOldMaster', { default: {} as OrderMaterial })

const ourChangePrice = () => {
  nowOldMaster.value.recycle_price_labor_method ??= 1
  const hold = holdFunction(props.billingSet.decimal_point)
  // 取整控制函数
  const rounding = roundFunction(props.billingSet.rounding)
  const countContetn = {
    a: nowOldMaster.value.weight_metal || 0,
    b: nowOldMaster.value.recycle_price_gold || 0,
    c: nowOldMaster.value.recycle_price_labor || 0,
    d: nowOldMaster.value.quality_actual || 1,
  }
  if (nowOldMaster.value.recycle_price_labor_method === 1) {
    // 如果回收工费方式按克 (回收金价-回收工费)*金重*实际成色
    nowOldMaster.value.recycle_price = calc(`((b - c) * a * d)| =${hold} ~${rounding},!n`, countContetn)
  }
  else if (nowOldMaster.value.recycle_price_labor_method === 2) {
    // 如果回收工费方式按件 (金重* 回收金价 * 实际成色) - 回收工费
    nowOldMaster.value.recycle_price = calc(`((a*b*d) - c)| =${hold} ~${rounding},!n`, countContetn)
  }
}

// 设置大类和 积分
const setNowOldMaster = (data: any) => {
  nowOldMaster.value.class = data?.res.value
  // 如果有回收金额则计算积分 并且 积分比例不能等于 0 否则会NaN
  if (nowOldMaster.value.recycle_price && data.rate && Number(data.rate) !== 0) {
    nowOldMaster.value.integral = orderObject.value.has_integral
      ? calc('(a / b)| =0 ~5, !n', {
          a: nowOldMaster.value.recycle_price,
          b: data.rate,
        })
      : 0
  }
}

// 搜索旧料后的 确认操作
const searchConfirm = async () => {
  oldMasterRef.value?.validate(async (errors: any) => {
    if (!errors) {
      orderObject.value.showMasterialsList ??= []
      // 去重
      const isDuplicate = orderObject.value.showMasterialsList.find(item => item.code === nowOldMaster.value.code)
      if (isDuplicate && props.nowEditState === undefined) {
        $toast.error('不能添加相同商品')
      }
      else {
        // 获取旧料的积分比例  大类要有 , 积分有回收金额则计算，且比例不能等于 0 否则会NaN
        const data = await props.checkOldClass({ material: nowOldMaster.value.material, quality: nowOldMaster.value.quality, gem: nowOldMaster.value.gem })
        if (!data.res.value) {
          // 如果没有大类则中断
          return
        }
        setNowOldMaster(data)
        if (props.nowEditState !== undefined) {
          // 这里是编辑状态 确认时，需要把当前编辑的值替换掉
          orderObject.value.showMasterialsList.splice(props.nowEditState, 1, nowOldMaster.value)
        }
        else {
          // 这里是新增时
          nowOldMaster.value.is_our = true
          orderObject.value.showMasterialsList.push(nowOldMaster.value)
        }
        searchShow.value = false
        searchInput.value = ''
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
// 调用旧料列表接口
const searchOldFn = async () => {
  await searchOlds(searchInput.value)
  if (nowOldMaster.value?.product_id) {
    // 匹配金价
    const exists = props.price.filter(item =>
      item.product_type === GoodsType.ProductOld
      && item.product_material === nowOldMaster.value.material
      && item.product_quality.includes(nowOldMaster.value.quality)
      && item.product_brand?.includes(nowOldMaster.value.brand),
    )
    if (exists && exists.length > 0) {
      nowOldMaster.value.recycle_price_gold = Number(exists[0]?.price)
    }
    else {
      nowOldMaster.value.recycle_price_gold = undefined
    }
  }
}
// 扫码
const { useWxWork } = useWxworkStore()
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    searchInput.value = code
    nowOldMaster.value = {} as OrderMaterial
    await searchOldFn()
  }
}
</script>

<template>
  <div>
    <common-model
      v-model="searchShow" title="搜索" :show-ok="true" :show-cancel="true"
      @confirm="searchConfirm()" @cancel="() => {
        searchShow = false
        searchInput = ''
      }">
      <div class="grid-12 h-[300px] overflow-y-scroll ">
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
                v-model:value="searchInput"
                size="large"
                type="text"
                clearable
                placeholder="请输入商品条码"
                @keydown.enter="searchOldFn()"
                @focus="focus" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="searchOldFn()">
                搜索
              </n-button>
              <div class="pl-[8px]">
                <n-button strong secondary type="info" round @click="scanCode()">
                  扫码
                </n-button>
              </div>
            </div>
          </div>
          <div class="py-[16px]">
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
                      :span="12" label="回收类型" path="recycle_type">
                      <n-select
                        v-model:value="nowOldMaster.recycle_type"
                        menu-size="large"
                        placeholder="选择回收类型"
                        :options="optonsToSelect(props.oldFilterList.recycle_type?.preset)"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收方式" path="recycle_method">
                      <n-select
                        v-model:value="nowOldMaster.recycle_method"
                        menu-size="large"
                        placeholder="选择回收方式"
                        :disabled="props.nowEditState !== undefined"
                        :options="optonsToSelect(props.oldFilterList.recycle_method?.preset)"
                        @focus="focus"
                      />
                    </n-form-item-gi>

                    <n-form-item-gi
                      :span="12" label="回收工费方式" path="recycle_price_labor_method">
                      <n-select
                        v-model:value="nowOldMaster.recycle_price_labor_method"
                        menu-size="large"
                        placeholder="选择回收工费方式"
                        :options="optonsToSelect(props.oldFilterList.recycle_price_labor_method?.preset)"
                        @focus="focus"
                        @update:value="ourChangePrice()"
                      />
                    </n-form-item-gi>

                    <n-form-item-gi :span="12" label="回收工费">
                      <n-input-number
                        v-model:value="nowOldMaster.recycle_price_labor"
                        :show-button="false"
                        placeholder="请输入回收工费"
                        round
                        :precision="3"
                        @focus="focus"
                        @blur="ourChangePrice()"
                      />
                    </n-form-item-gi>

                    <n-form-item-gi :span="12" label="金重" path="weight_metal">
                      <n-input-number
                        v-model:value="nowOldMaster.weight_metal"
                        :show-button="false"
                        placeholder="请输入金重"
                        round
                        min="0"
                        :precision="3"
                        @focus="focus"
                        @blur="ourChangePrice()"
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
                        @focus="focus"
                        @blur="ourChangePrice()"
                      >
                        <template #suffix>
                          元/克
                        </template>
                      </n-input-number>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="实际成色" path="quality_actual">
                      <n-input-number
                        v-model:value="nowOldMaster.quality_actual"
                        :show-button="false"
                        placeholder="请输入实际成色"
                        round
                        :max="1"
                        :min="0"
                        :precision="3"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="回收金额">
                      <n-input-number
                        v-model:value="nowOldMaster.recycle_price"
                        :show-button="false"
                        placeholder="请输入回收金额"
                        round
                        :min="0"
                        :precision="3"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                  </n-grid>
                </n-form>
              </template>
              <template v-else>
                <common-emptys text="暂无数据" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
