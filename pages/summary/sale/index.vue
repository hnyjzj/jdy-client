<script lang="ts" setup>
const { getSalesData, getSalesWhere } = useStock()
const { salesData, salesWhere } = storeToRefs(useStock())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

useSeoMeta({ title: '销售统计' })

const customDate = ref<number | null>(null)
const startTime = ref()
const endTime = ref()
/** 选择范围 */
const duration = ref(1)

const isLoading = ref(false)

/** 获取库存数据 */
const fetchData = useDebounceFn(async () => {
  isLoading.value = true
  try {
    const params: statisticSale = { duration: duration.value, store_id: myStore.value?.id }
    if (salesWhere.value.duration?.preset[duration.value] === '自定义') {
      params.startTime = startTime.value
      params.endTime = endTime.value
    }
    await getSalesData(params)
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
watch([duration, customDate], (newValues) => {
  const [newDuration] = newValues
  // 只有当不是自定义时间范围时才调用 fetchData
  if (salesWhere.value?.duration?.preset[newDuration] !== '自定义') {
    fetchData()
  }
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
      <div class="grid-12 mb-[12px] gap-[6px]">
        <div class="col-4" uno-sm="col-4">
          <n-select
            v-model:value="duration"
            placeholder="请选择时间范围"
            clearable
            remote
            :options="optonsToSelect(salesWhere.duration?.preset ?? [])"
          />
        </div>
        <div class="col-12" uno-sm="col-8">
          <template v-if="salesWhere.duration?.preset[duration] === '自定义'">
            <div class="grid-12 gap-[6px]">
              <div class="col-10 flex gap-[12px]">
                <n-date-picker
                  v-model:formatted-value="startTime"
                  input-readonly
                  default-time="00:00:00"
                  :is-date-disabled="dateDisabled"
                  value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择开始时间" round clearable />
                <n-date-picker
                  v-model:formatted-value="endTime"
                  input-readonly
                  default-time="23:59:59"
                  :is-date-disabled="dateDisabled"
                  value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择结束时间" round clearable />
              </div>
              <div class="px-[8px] py-[6px] bg-[#fff] rounded-[20px] color-[#0068FF] col-2  text-center" @click="fetchData">
                搜索
              </div>
            </div>
          </template>
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
