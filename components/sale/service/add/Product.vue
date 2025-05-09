<script setup lang="ts">
const props = defineProps<{
  repairGoodsFilterList: FilterWhere<serviceGoods>[]
  searchServiceGoods: (val: string) => Promise<ProductFinisheds[]>
}>()

const showModal = ref(false)

// 手动添加货品表单
const params = ref({} as serviceGoods)

// 当前搜索的货品的form
const nowServiceGoods = ref<serviceGoods>({})

// 显示搜索的弹窗
const searchShow = ref(false)
// 当前编辑状态
const nowEditState = ref<number | undefined>(undefined)

// 打开搜索
const searchQl = () => {
  nowEditState.value = undefined
  searchShow.value = true
}

// 手动添加
const handleAdd = () => {
  showModal.value = true
  nowEditState.value = undefined
  params.value = {} as serviceGoods
}
// 展示列表
const showServiceGoods = defineModel<serviceGoods[]>('list', { default: [] })

// 设置编辑时禁用选择回收方式
const setDisabled = ref(false)
// 编辑货品
const editOld = (item: serviceGoods, index: number) => {
  // 当前编辑的是哪个货品
  nowEditState.value = index
  //   如果是自有商品
  if (item.is_our) {
    nowServiceGoods.value = item
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
  <common-fold title="添加维修货品" :is-collapse="false">
    <sale-service-add-select-button
      @handle-add="handleAdd"
      @search-ql="searchQl" />
    <sale-service-add-select-list
      v-model:list="showServiceGoods"
      :repair-goods-filter-list="props.repairGoodsFilterList"
      @edit="editOld" />
    <sale-service-add-select-search
      v-model:list="showServiceGoods"
      v-model:show="searchShow"
      v-model:now-service-goods="nowServiceGoods"
      :now-edit-state="nowEditState"
      :search-service-goods="props.searchServiceGoods"
    />
    <sale-service-add-select-handle
      v-model:params="params"
      v-model:show="showModal"
      v-model:list="showServiceGoods"
      :repair-goods-filter-list="props.repairGoodsFilterList"
      :now-edit-state="nowEditState"
    />
  </common-fold>
</template>
