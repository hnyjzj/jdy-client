<script setup lang="ts">
const props = defineProps<{
  title: string
  isIntegral: boolean
  price: GoldPrices[]
  oldFilterListToArray: FilterWhere<ProductOld>[]
  checkOldClass: (params: Partial<ProductOld>) => any
  searchOlds: (val: string) => Promise<ProductOld>
  billingSet: BillingSet
}>()

const showModal = ref(false)

// 手动添加旧料表单
const params = ref({} as ProductOld)

// 当前搜索的旧料的form
const nowOldMaster = defineModel('nowOldMaster', { default: {} as ProductOld })

// 显示搜索的弹窗
const searchShow = ref(false)
// 当前编辑状态
const nowEditState = ref<number | undefined>(undefined)

// 打开搜索
const searchQl = () => {
  nowEditState.value = undefined
  searchShow.value = true
  nowOldMaster.value = {} as ProductOld
}

// 手动添加
const handleAdd = () => {
  showModal.value = true
  nowEditState.value = undefined
  params.value = {} as ProductOld
}
// 展示列表
const showMasterialsList = defineModel<ProductOld[]>('list', { default: [] })

// 设置编辑时禁用选择回收方式
const setDisabled = ref(false)
// 编辑旧料
const editOld = (item: ProductOld, index: number) => {
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
    params.value = item
    showModal.value = true
  }
}
</script>

<template>
  <common-fold :title="props.title" :is-collapse="false">
    <sale-add-masterials-button
      @handle-add="handleAdd"
      @search-ql="searchQl" />
    <sale-add-masterials-list
      v-model:list="showMasterialsList"
      :old-filter-list-to-array="oldFilterListToArray"
      @edit="editOld" />
    <sale-add-masterials-search
      v-model:list="showMasterialsList"
      v-model:show="searchShow"
      v-model:now-old-master="nowOldMaster"
      :price="props.price"
      :search-olds="searchOlds"
      :is-integral="props.isIntegral"
      :check-old-class="props.checkOldClass"
      :now-edit-state="nowEditState"
    />
    <sale-add-masterials-handle
      v-model:params="params"
      v-model:show="showModal"
      v-model:list="showMasterialsList"
      :old-filter-list-to-array="props.oldFilterListToArray"
      :is-integral="props.isIntegral"
      :check-old-class="props.checkOldClass"
      :now-edit-state="nowEditState"
      :billing-set="props.billingSet"
    />
  </common-fold>
</template>
