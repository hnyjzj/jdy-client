<script lang="ts" setup>
const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
  partFilter: Where<OrderPart>
  storeid: string
}>()
const { getAccessorieList } = useAccessorie()
// 搜索配件
const searchParts = async (val: string) => {
  const res = await getAccessorieList({ page: 1, limit: 10, where: { name: val, store_id: Props.storeid } })
  if (res?.data?.list) {
    return res.data.list || []
  }
  return []
}
const showModal = defineModel('show', { default: false })
const searchPartsVal = ref('')
// 预设选中状态的配置列表
const prePartsList = ref<ProductAccessories[]>([])
const orderObject = defineModel<Orders>('list', { default: {} as Orders })
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
  const data = await searchParts(searchPartsVal.value)
  partslist.value = data
  document.body.style.overflow = 'hidden'
}

// 确认配件 ，将选中的配件添加到 展示列表中, 调用接口获取积分比例
const confirmParts = async () => {
  orderObject.value.showPartsList ??= []
  //  然后添加新的数据
  prePartsList.value.forEach((item) => {
    const newItem = { ...item, quantity: 1, price: Number(item?.price || 0), one_price: Number(item?.price || 0), product_id: item.id }
    // 判断是否存在
    const existingItem = orderObject.value.showPartsList?.find(part => part.id === newItem.id)
    if (existingItem) {
      if (!existingItem.quantity)
        return
      existingItem.quantity += 1
    }
    else {
      orderObject.value.showPartsList?.push(newItem)
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
