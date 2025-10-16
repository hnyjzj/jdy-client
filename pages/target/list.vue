<script lang="ts" setup>
const { getTargetWhere, getTargetList } = useTarget()
const { targetFilterListToArray } = storeToRefs(useTarget())
useSeoMeta({
  title: '销售目标管理',
})
const filterData = ref({} as Partial<ExpandPage<any>>)
const filterRef = ref()
// 筛选框显示隐藏
const isFilter = ref(false)
const limits = ref(50)
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
}
/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<Allocate>>) => {
  filterData.value = {
    ...f,
    searchPage: 1,
    limits: limits.value,
  }
}
/** 切换门店 */
function changeMyStore() {

}
onMounted(() => {
  getTargetWhere()
  getTargetList({ page: 1, limit: 10 })
})
</script>

<template>
  <div>
    <product-filter
      :is-export="true"
      @filter="openFilter"
    >
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <common-create @create="jump('/target/add')" />
    <common-filter-where
      ref="filterRef"
      v-model:show="isFilter"
      :data="filterData"
      :filter="targetFilterListToArray"
      @submit="submitWhere"
      @reset="resetWhere"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
