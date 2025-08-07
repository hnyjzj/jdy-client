<script lang="ts" setup>
import { calc } from 'a-calc'

const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
  partFilter: Where<ProductAccessories>
  searchParts: (val: string,) => Promise<ProductAccessories[]>
  checkAccessoriesScore: (params: { classes: ProductAccessories['type'][] }) => any
}>()
const showModal = defineModel('show', { default: false })
const searchPartsVal = ref('')

const countIntegral = (amount: number, rate: number | string) => {
  return calc('(a / b)| =0 ~5, !n', {
    a: amount,
    b: rate,
  })
}
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
  const data = await Props.searchParts(searchPartsVal.value)
  partslist.value = data
  document.body.style.overflow = 'hidden'
}
// 计算积分 如果积分比例存在 并且 应付金额大于0 才能计算
const calculateIntegral = (amount: number, rate?: number) => {
  return rate && amount > 0 ? countIntegral(amount, rate) : 0
}

// 确认配件 ，将选中的配件添加到 展示列表中, 调用接口获取积分比例
const confirmParts = async () => {
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

    if (existingItem?.quantity) { // 如果当前存在了此配件 数量加1，应付金额累加
      existingItem.quantity += 1
      existingItem.amount = Number(existingItem?.price || 0) * existingItem.quantity
    }
    else {
      // 添加配件到展示列表中
      const newItem = { ...item, quantity: 1, amount: Number(item?.price || 0) }
      existingCache[item.id] = newItem
      showPartsList.value.push(newItem)
    }
  })
  // 筛选大类
  const arr = ref<ProductAccessories['type'][]>([])
  arr.value = showPartsList.value.map(item => item?.type as number)
  // 获取大类的比例
  const classArray = await Props.checkAccessoriesScore({ classes: arr.value })
  if (!classArray?.length) {
    arr.value.forEach(() => {
      classArray.push(0)
    })
  }

  // 创建分类快速查询索引
  const classRateMap = new Map(classArray.map((c: { class: number, rate: string }) => [c.class, c.rate]))
  // 遍历 列表
  showPartsList.value.forEach((item) => {
    //  匹配配件大类
    if (classRateMap.has(item?.type)) {
      // 设置当前配件的积分比例
      item.rate = Number(classRateMap.get(item?.type))
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
  searchPartsVal.value = ''
}
</script>

<template>
  <div>
    <common-model
      v-model="showModal" title="选择配件" :show-ok="true" :show-cancel="true" @confirm="confirmParts" @cancel=" () => {
        searchPartsVal = ''
        partslist = []
      }">
      <div class="flex items-center pb-[16px]">
        <div class="flex-1">
          <n-input v-model:value="searchPartsVal" type="text" clearable placeholder="搜索配件名称" size="large" @keydown.enter="searchPartsList" @focus="focus" />
        </div>
        <div class="pl-[16px] flex">
          <n-button type="info" round @click="searchPartsList">
            搜索
          </n-button>
        </div>
      </div>
      <div class="category-list max-h-[300px]">
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-2 py-1 min-w-[80px]">
                名称
              </th>
              <th class="px-2 py-1 min-w-[60px]">
                库存
              </th>
              <th class="px-2 py-1 min-w-[60px]">
                单价
              </th>
              <th class="px-2 py-1 min-w-[60px]">
                类型
              </th>
              <th class="px-2 py-1 min-w-[90px]">
                销售方式
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in partslist" :key="index">
              <tr
                class="px-2 py-2 h-[36px] rounded-[12px]" :style="{
                  'background-color': prePartsList.includes(item) ? 'white' : '',
                  'color': prePartsList.includes(item) ? '#328AF1' : '#000',
                }" @click="selectPart(item)">
                <td
                  class=" classRows max-w-[120px] ">
                  {{ item?.name }}
                </td>
                <td class=" classRows max-w-[120px] ">
                  {{ item.stock }}
                </td>
                <td class=" classRows max-w-[120px] ">
                  {{ item?.price }}
                </td>
                <td class=" classRows max-w-[120px] ">
                  {{ Props.partFilter.type?.preset[item?.type] }}
                </td>
                <td class=" classRows max-w-[120px] ">
                  {{ Props.partFilter.retail_type?.preset[item.retail_type] }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <template v-if="partslist.length === 0">
          <div class="py-[12px]">
            <common-emptys />
          </div>
        </template>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.category-list {
  overflow: auto;
}
.category-list table {
  border-collapse: collapse;
}
.category-list th,
.category-list td {
  text-align: center; /* 水平居中 */
  vertical-align: middle; /* 垂直居中（可选） */
}
.classRows {
  --uno: 'whitespace-nowrap overflow-hidden text-center px-2 text-ellipsis';
}
</style>
