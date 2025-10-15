<script lang="ts" setup>
const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
  partFilter: Where<OrderPart>
  storeid: string
}>()
const partslist = ref<ProductAccessories[]>([])
const { getAccessorieList } = useAccessorie()
// 搜索配件 - 支持分页加载
const currentPage = ref(1)
const isLoading = ref(false)
const noMoreData = ref(false)

const searchParts = async (loadMore = false) => {
  // 如果正在加载中或没有更多数据，则不再请求
  if (isLoading.value || (loadMore && noMoreData.value)) {
    return []
  }

  isLoading.value = true
  try {
    const res = await getAccessorieList({
      page: loadMore ? currentPage.value : 1,
      limit: 20,
    })

    if (res?.data?.list) {
      // 如果是加载更多，则追加数据；否则替换数据
      if (loadMore) {
        partslist.value = [...partslist.value, ...res.data.list]
      }
      else {
        partslist.value = res.data.list || []
      }

      // 判断是否还有更多数据
      if (res.data.list.length < 20) {
        noMoreData.value = true
      }
      else {
        currentPage.value++
      }

      return res.data.list
    }
    return []
  }
  finally {
    // 无论成功失败，都需要将加载状态设置为false
    isLoading.value = false
  }
}

// 处理滚动事件，实现触底加载
const handleScroll = (e: Event) => {
  const el = e.target as HTMLElement
  const { scrollHeight, scrollTop, clientHeight } = el
  // 当滚动到底部50px以内，且不在加载中，且有更多数据时，加载下一页
  if (scrollHeight - (scrollTop + clientHeight) < 50 && !isLoading.value && !noMoreData.value) {
    searchParts(true)
  }
}
const showModal = defineModel('show', { default: false })

// 预设选中状态的配置列表
const prePartsList = ref<ProductAccessories[]>([])
const orderObject = defineModel<Orders>('list', { default: {} as Orders })
// 设置选中状态
const { $toast } = useNuxtApp()
const selectPart = (part: ProductAccessories) => {
  if (part.stock <= 0) {
    $toast.error('库存不足')
    return
  }
  // 如果已经选中，则取消选中
  if (prePartsList.value.includes(part)) {
    prePartsList.value = prePartsList.value.filter(item => item !== part)
  }
  else {
    prePartsList.value.push(part)
  }
}

const searchPartsList = async () => {
  // 重置分页状态
  currentPage.value = 1
  noMoreData.value = false
  isLoading.value = false

  const data = await searchParts()
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
}

watch(showModal, (newVal) => {
  if (newVal) {
    searchPartsList()
  }
})
</script>

<template>
  <div>
    <common-model
      v-model="showModal" title="选择配件" :show-ok="true" :show-cancel="true" @confirm="confirmParts" @cancel=" () => {
        partslist = []
      }">
      <div class="category-list max-h-[300px]" @scroll="handleScroll">
        <table class="w-full">
          <thead class="bg-[#F1F5FE] sticky top-0">
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
                class="px-2 py-2 h-[36px] rounded-[12px]"
                :style="{
                  'background-color': prePartsList.includes(item) ? 'white' : '',
                  'color': prePartsList.includes(item) ? '#328AF1' : (item.stock ? '#000' : '#999'),
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

        <!-- 加载中状态 -->
        <template v-if="isLoading && partslist.length > 0">
          <div class="py-[12px] text-center text-gray-500">
            加载中...
          </div>
        </template>

        <!-- 无更多数据状态 -->
        <template v-if="noMoreData && partslist.length > 0">
          <div class="py-[12px] text-center text-gray-500">
            没有更多数据了
          </div>
        </template>

        <!-- 空数据状态 -->
        <template v-if="partslist.length === 0 && !isLoading">
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
  overflow-y: auto;
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
