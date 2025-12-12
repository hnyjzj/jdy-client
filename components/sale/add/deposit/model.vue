<script lang="ts" setup>
const props = defineProps<{
  storeid: string
}>()
const emit = defineEmits<{
  updateProduct: []
}>()
const { OrdersList } = storeToRefs(useDepositOrder())
const { getDepositList } = useDepositOrder()
// 获取订金单列表
const searchDepositOrders = async (val?: string) => {
  await getDepositList({ page: 1, limit: 5, where: { id: val, status: DepositOrderStatus.Booking, store_id: props.storeid } })
  return OrdersList.value || []
}
const searchShow = defineModel('show', { default: false })
const showDepositList = defineModel<DepositOrderInfo[]>('list', { default: [] })
const Preselection = ref<DepositOrderInfo[]>([])
const resultList = ref<DepositOrderInfo[]>([])
const searchVal = ref('')
// 搜索列表
const searchList = async () => {
  const data = await searchDepositOrders(searchVal.value)
  resultList.value = data
}
// 设置预选
const setPre = (item: DepositOrderInfo) => {
  // 如果已经选中，则取消选中
  if (Preselection.value.includes(item)) {
    Preselection.value = Preselection.value.filter(ele => ele !== item)
  }
  else {
    Preselection.value.push(item)
  }
}
// 添加到定金单列表中去
const confirmFn = () => {
  showDepositList.value.push(...Preselection.value)
  // 去重
  const map = new Map()
  showDepositList.value.forEach(item => map.set(item.id, item)) // 假设以id为唯一标识
  showDepositList.value = Array.from(map.values())
  emit('updateProduct')
  searchShow.value = false
  Preselection.value = []
  resultList.value = []
}
</script>

<template>
  <div>
    <common-model v-model="searchShow" title="搜多订金单" :show-ok="true" :show-cancel="true" @confirm="confirmFn" @cancel="resultList = []">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex-start py-[12px]">
              <div class="flex-center-col">
                <div
                  class="text-[16px] pb-[2px] font-semibold line-height-[24px]">
                  订金单号搜索
                </div>
                <div
                  class="w-[32px] h-[4px] rounded color-[#2080F0]" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input v-model:value="searchVal" type="text" clearable placeholder="输入订金单号" @focus="focus" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="searchList">
                搜索
              </n-button>
            </div>
          </div>
          <div class="overflow-x-auto max-w-[400px]">
            <div class=" color-[#333] font-semibold !text-[16px] flex">
              <div class="w-[180px] pl-[8px] flex-shrink-0">
                订金单号
              </div>
              <div class="w-[100px] flex-shrink-0">
                订金金额
              </div>
              <div class="w-[100px] flex-shrink-0">
                名称
              </div>
            </div>
            <div class="h-[300px] py-[16px]">
              <template v-for="(item, index) in resultList" :key="index">
                <div
                  class="py-[12px]  rounded-2xl mb-[8px] flex w-[fit-content]" :style="{
                    'background-color': Preselection.includes(item) ? 'white' : '',
                    'color': Preselection.includes(item) ? '#328AF1' : '#000',
                  }" @click="setPre(item)">
                  <div class="w-[180px] pl-[8px] flex-shrink-0">
                    {{ item.id }}
                  </div>
                  <div class="w-[100px] flex-shrink-0">
                    {{ item.price_pay }}
                  </div>
                  <div class="w-[100px] flex-shrink-0">
                    <template v-for="(ele, i) in item.products" :key="i">
                      <div>
                        {{ ele.product_finished.name }},
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <template v-if="resultList.length === 0">
                <common-empty text="暂无数据" />
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
