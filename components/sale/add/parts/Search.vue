<script lang="ts" setup>
import { calc } from 'a-calc'

const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
  searchParts: (val: string, type: string) => Promise<ProductAccessories[]>
  checkAccessoriesScore: (params: { classes: AccessorieCategory['type_part'][] }) => any
}>()
const showModal = defineModel('show', { default: false })
const { $toast } = useNuxtApp()
// 搜索商品 名称name 和 条码code   编号number
const searchType = ref('number')
const searchPartsVal = ref('')
const changeType = (type: 'name' | 'code' | 'number') => {
  searchType.value = type
  searchPartsVal.value = ''
}
const placeholderText = computed(() => {
  switch (searchType.value) {
    case 'number':
      return '请输入配件编号'
    case 'code':
      return '请输入配件条码'
    default:
      return '请输入配件名称'
  }
})
const countIntegral = (amount: number, rate: number | string) => {
  return calc('(a / b)| =0 ~5, !n', {
    a: amount,
    b: rate,
  })
}
const hold = defineModel<number>('hold', { default: 0 })
// 预设选中状态的配置列表
const prePartsList = ref<ProductAccessories[]>([])
const showPartsList = defineModel<ProductAccessories[]>('list', { default: [] })
// 设置选中状态
const selectPart = (part: ProductAccessories) => {
  // 如果已经选中，则取消选中
  if (prePartsList.value.includes(part)) {
    prePartsList.value = prePartsList.value.filter(item => item !== part)
  }
  else {
    prePartsList.value.push(part)
  }
}
const partslist = ref<ProductAccessories[]>([])
const searchPartsList = async () => {
  const data = await Props.searchParts(searchPartsVal.value, searchType.value)
  partslist.value = data
}
// 计算积分 如果积分比例存在并且 应付金额大于0 才能计算
const calculateIntegral = (amount: number, rate?: number) =>
  rate && amount > 0 ? countIntegral(amount, rate) : 0
// 确认配件 ，将选中的配件添加到 展示列表中, 调用接口获取积分比例
const confirmParts = async () => {
  hold.value = holdFunction(Props.billingSet.decimal_point)
  // 判断 showPartsList 是否存在 prePartsList 中的元素 ，如果存在则不添加
  const existingCache = {} as { [key: string]: ProductAccessories }
  //  先缓存原始数据
  showPartsList.value.forEach((part) => {
    if (part.id !== undefined && part.id !== null) {
      existingCache[part.id] = part
    }
  })
  prePartsList.value.forEach((item) => {
    if (!item.id)
      return
    const existingItem = existingCache[item.id]
    if (existingItem) { // 如果当前存在了此配件 数量加1，应付金额累加
      existingItem.quantity += 1
      existingItem.amount = Number(existingItem.category?.label_price || 0) * existingItem.quantity
    }
    else {
      // 添加配件到展示列表中
      const newItem = { ...item, quantity: 1, amount: Number(item.category?.label_price || 0) }
      existingCache[item.id] = newItem
      showPartsList.value.push(newItem)
    }
  })
  // 筛选大类
  const arr = ref<AccessorieCategory['type_part'][]>([])
  arr.value = showPartsList.value.map(item => item.category?.type_part as number)
  // 获取大类的比例
  const classArray = await Props.checkAccessoriesScore({ classes: arr.value })
  if (!classArray?.length) {
    $toast.error('获取配件比例失败')
    return
  }

  // 创建分类快速查询索引
  const classRateMap = new Map(classArray.map((c: { class: number, rate: string }) => [c.class, c.rate]))
  // 遍历 列表
  showPartsList.value.forEach((item) => {
    //  匹配配件大类
    if (classRateMap.has(item?.category?.type_part)) {
      // 设置当前配件的积分比例
      item.rate = Number(classRateMap.get(item?.category?.type_part))
      // 设置当前配件的积分
      item.integral = Props.isIntegral ? calculateIntegral(Number(item?.amount || 0), item.rate) : 0
    }
    else {
      item.integral = 0
    }
  })
  prePartsList.value = []
  partslist.value = []
  showModal.value = false
}
</script>

<template>
  <div>
    <common-model v-model="showModal" title="选择配件" :show-ok="true" :show-cancel="true" @confirm="confirmParts" @cancel="partslist = []">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex justify-around py-[12px]">
              <div class="flex-center-col" @click="changeType('number')">
                <div
                  class="text-[16px] pb-[2px] font-semibold line-height-[24px]"
                  :style="{ color: searchType === 'number' ? '#333' : '#53565C' }">
                  编号搜索
                </div>
                <div
                  class="w-[32px] h-[4px] rounded "
                  :style="{ background: searchType === 'number' ? '#2080F0' : '' }" />
              </div>
              <div class="flex-center-col" @click="changeType('name')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'name' ? '#333' : '#53565C' }">
                  名称搜索
                </div>
                <div
                  class="w-[32px] h-[4px] rounded "
                  :style="{ background: searchType === 'name' ? '#2080F0' : '' }" />
              </div>
              <div class="flex-center-col" @click="changeType('code')">
                <div
                  class="text-[16px] pb-[2px] font-semibold line-height-[24px]"
                  :style="{ color: searchType === 'code' ? '#333' : '#53565C' }">
                  条码搜索
                </div>
                <div
                  class="w-[32px] h-[4px] rounded"
                  :style="{ background: searchType === 'code' ? '#2080F0' : '' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input v-model:value="searchPartsVal" type="text" clearable :placeholder="placeholderText" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="searchPartsList">
                搜索
              </n-button>
            </div>
          </div>
          <div class="overflow-x-auto max-w-[400px]">
            <div class=" color-[#333] font-semibold !text-[16px] flex">
              <div class="w-[180px] pl-[8px] flex-shrink-0">
                编号
              </div>
              <div class="w-[100px] flex-shrink-0">
                名称
              </div>
              <div class="w-[180px] flex-shrink-0">
                条码
              </div>
              <div class="w-[40px] flex-shrink-0">
                类型
              </div>
              <div class="w-[50px] flex-shrink-0">
                标价
              </div>
              <div class="w-[40px] flex-shrink-0">
                库存
              </div>
            </div>
            <div class="h-[300px] py-[16px]">
              <template v-for="(item, index) in partslist" :key="index">
                <div
                  class="py-[12px]  rounded-2xl mb-[8px] flex w-[fit-content]" :style="{
                    'background-color': prePartsList.includes(item) ? 'white' : '',
                    'color': prePartsList.includes(item) ? '#328AF1' : '#000',
                  }" @click="selectPart(item)">
                  <div class="w-[180px] pl-[8px] flex-shrink-0">
                    {{ item.id }}
                  </div>
                  <div class="w-[100px] flex-shrink-0">
                    {{ item.category?.name }}
                  </div>
                  <div class="w-[180px] flex-shrink-0">
                    {{ item.code }}
                  </div>
                  <div class="w-[40px] flex-shrink-0">
                    {{ item.category?.type_part }}
                  </div>
                  <div class="w-[50px] flex-shrink-0">
                    {{ item.category?.label_price }}
                  </div>
                  <div class="w-[40px] flex-shrink-0">
                    {{ item.category?.product.stock }}
                  </div>
                </div>
              </template>
              <template v-if="partslist.length === 0">
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
