<script lang="ts" setup>
const { getStockData } = useStock()

const { stockDate } = storeToRefs(useStock())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

useSeoMeta({ title: '库存统计' })

// 日期
const formattedDate = ref('')
const dateMode = ref<'today' | 'custom'>('today')
const customDate = ref<number | null>(null)

const isLoading = ref(false)
/** 获取今日日期 */
function getToday() {
  const enterDate = new Date()
  formattedDate.value = `${enterDate.getFullYear()}-${String(enterDate.getMonth() + 1).padStart(2, '0')}-${String(enterDate.getDate()).padStart(2, '0')}`
}

/** 获取库存数据 */
const fetchData = useDebounceFn(async () => {
  let date = ''
  if (dateMode.value === 'today') {
    getToday()
    date = formattedDate.value
  }
  else if (customDate.value) {
    const d = new Date(customDate.value)
    date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    formattedDate.value = date
  }
  if (!date)
    return
  isLoading.value = true
  await getStockData({ day: date, store_id: myStore.value.id })
  isLoading.value = false
}, 300)

onMounted(async () => {
  await nextTick()
  await getMyStore()
  await fetchData()
})

// 监听日期变化自动刷新数据
watch([dateMode, customDate], fetchData)

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
      <!-- 日期选择 -->
      <div class="flex justify-center mb-4 items-center gap-2">
        <div
          class="px-4 py-1 text-sm rounded-full cursor-pointer"
          :class="dateMode === 'today' ? 'bg-blue-500 text-white' : 'text-white'"
          @click="dateMode = 'today'"
        >
          今日
        </div>
        <div
          class="px-4 py-1 text-sm rounded-full cursor-pointer"
          :class="dateMode === 'custom' ? 'bg-blue-500 text-white' : 'text-white'"
          @click="dateMode = 'custom'"
        >
          自定义
        </div>
      </div>

      <!-- 自定义日期选择器 -->
      <div class="flex justify-center mb-4">
        <div v-if="dateMode === 'custom'" class="w-[40%]">
          <n-date-picker v-model:value="customDate" type="date" clearable />
        </div>
      </div>

      <!-- 数据汇总 -->
      <summary-total :data="stockDate.overview" title="数据汇总" />
      <!-- 封装后的饼图/表格组件 -->
      <summary-stock-chartnested
        title="成品大类"
        :stock-category-date="stockDate.finished_category"
        :loading="isLoading"
      />
      <summary-stock-chart
        title="成品品类"
        :stock-category-date="stockDate.finished_class"
        :loading="isLoading"
      />
      <summary-stock-chartnested
        title="成品库龄"
        :stock-category-date="stockDate.finished_age"
        :loading="isLoading"
      />
      <summary-stock-chart
        title="旧料大类"
        :stock-category-date="stockDate.old_class"
        :loading="isLoading"
      />
    </div>
  </common-layout-center>
</template>
