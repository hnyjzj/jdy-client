<script lang="ts" setup>
const { getSalesData, getSalesWhere } = useStock()
const { salesData, salesWhere } = storeToRefs(useStock())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

useSeoMeta({ title: '销售统计' })

const customDate = ref<number | null>(null)
/** 选择范围 */
const duration = ref(1)

const isLoading = ref(false)

/** 获取库存数据 */
const fetchData = useDebounceFn(async () => {
  isLoading.value = true
  try {
    await getSalesData({ duration: duration.value, store_id: myStore.value?.id })
  }
  finally {
    isLoading.value = false
  }
}, 300)

onMounted(async () => {
  await nextTick()
  await getSalesWhere()
  await getMyStore()
  await fetchData()
})

// 监听日期变化自动刷新数据
watch([duration, customDate], fetchData)

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
      <div class="flex justify-center items-center gap-2 w-[120px]">
        <n-select
          v-model:value="duration"
          :options="optonsToSelect(salesWhere.duration?.preset ?? [])"
        />
      </div>
      <!-- 自定义日期选择器 -->
      <div class="flex justify-center mb-4">
        <div v-if="salesWhere.duration?.preset[duration] === '自定义'" class="w-[40%]">
          <n-date-picker v-model:value="customDate" type="date" clearable />
        </div>
      </div>

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
