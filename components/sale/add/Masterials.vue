<script setup lang="ts">
const props = defineProps<{
  price: GoldPrices[]
  oldFilterList: Where<OrderMaterial>
  oldFilterListToArray: FilterWhere<OrderMaterial>[]
  billingSet: BillingSet
  storeid: string
}>()
const { getOldClass, getOldScoreProportion } = useOld()
// 获取旧料大类，并获取旧料积分比例
const CheckOldClass = async (params: Partial<OrderMaterial>) => {
  const res = await getOldClass(params)
  if (res?.value) {
    const data = await getOldScoreProportion({ class: res?.value })
    return { rate: data, res }
  }
}
const showModal = ref(false)
// 展示列表
const orderObject = defineModel<Orders>({ default: {} as Orders })
// 当前搜索的旧料的form
const nowOldMaster = defineModel('nowOldMaster', { default: {} as OrderMaterial })
// 显示搜索的弹窗
const searchShow = ref(false)
// 当前编辑状态
const nowEditState = ref<number | undefined>(undefined)

// 打开搜索
const searchQl = () => {
  nowEditState.value = undefined
  searchShow.value = true
  nowOldMaster.value = {} as OrderMaterial
}

// 手动添加
const handleAdd = () => {
  showModal.value = true
  nowEditState.value = undefined
  nowOldMaster.value = {} as OrderMaterial
}

// 设置编辑时禁用选择回收方式
const setDisabled = ref(false)
// 编辑旧料
const editOld = (item: OrderMaterial, index: number) => {
  // 当前编辑的是哪个旧料
  nowEditState.value = index
  //   如果是自有商品
  if (item.is_our) {
    nowOldMaster.value = item
    setDisabled.value = true
    searchShow.value = true
  }
  else {
    // 如果不是自有商品
    nowOldMaster.value = item
    showModal.value = true
  }
}
</script>

<template>
  <div class="pb-[16px]">
    <common-card-info title="旧料">
      <template #info>
        <sale-add-masterials-button
          @handle-add="handleAdd"
          @search-ql="searchQl" />
        <sale-add-masterials-list
          v-model="orderObject"
          :old-filter-list-to-array="oldFilterListToArray"
          @edit="editOld" />
        <sale-add-masterials-search
          v-model="orderObject"
          v-model:show="searchShow"
          v-model:now-old-master="nowOldMaster"
          :old-filter-list="props.oldFilterList"
          :price="props.price"
          :check-old-class="CheckOldClass"
          :now-edit-state="nowEditState"
          :billing-set="props.billingSet"
          :storeid="props.storeid"
        />
        <sale-add-masterials-handle
          v-model="orderObject"
          v-model:now-old-master="nowOldMaster"
          v-model:show="showModal"
          :old-filter-list-to-array="props.oldFilterListToArray"
          :check-old-class="CheckOldClass"
          :now-edit-state="nowEditState"
          :billing-set="props.billingSet"
        />
      </template>
    </common-card-info>
  </div>
</template>
