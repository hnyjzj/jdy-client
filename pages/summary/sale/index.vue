<script lang="ts" setup>
const { getSalesData, getSalesWhere } = useStock()
const { salesData, salesWhere } = storeToRefs(useStock())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

useSeoMeta({ title: '销售统计' })
const params = ref({} as BossWhere)

const isLoading = ref(false)

/** 获取库存数据 */
const fetchData = useDebounceFn(async () => {
  isLoading.value = true
  try {
    const saleParams = { ...params.value, store_id: myStore.value?.id }
    await getSalesData(saleParams as statisticSale)
  }
  finally {
    isLoading.value = false
  }
}, 300)

onMounted(async () => {
  await nextTick()
  if (!params.value.duration) {
    params.value.duration = 1
  }
  else {
    params.value.duration = 1
  }
  await getSalesWhere()
  await getMyStore()
  await fetchData()
})

/** 切换门店 */
async function changeStores() {
  await fetchData()
}
</script>

<template>
  <common-layout-center>
    <div class="px-[16px] pb-4">
      <div class="flex justify-between items-center py-[12px] text-[#FFF]">
        <product-manage-company @change="changeStores" />
      </div>

      <summary-boss-select-time v-model="params" :time-where="salesWhere" @update-time="fetchData" />

      <!-- 数据汇总 -->
      <summary-total :data="salesData.overview" title="数据汇总" />
      <summary-stock-line-chart
        title="销售趋势"
        :date="salesData.trend"
        :loading="isLoading"
      />
      <!-- 封装后的饼图/表格组件 -->
      <summary-stock-chart
        title="成品大类"
        :stock-category-date="salesData.finished_class"
        :loading="isLoading"
      />
      <summary-stock-chartnested
        title="成品品类"
        :stock-category-date="salesData.finished_category"
        :loading="isLoading"
      />
      <summary-stock-chart
        title="旧料大类"
        :stock-category-date="salesData.old_class"
        :loading="isLoading"
      />
      <summary-stock-chart
        title="配件统计"
        :stock-category-date="salesData.accessorie"
        :loading="isLoading"
      />
      <summary-stock-table
        title="个人统计"
        :date="salesData.list"
        :loading="isLoading"
        classify="姓名"
      />
    </div>
  </common-layout-center>
</template>
