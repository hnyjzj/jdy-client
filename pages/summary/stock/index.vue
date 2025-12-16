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
  try {
    await getStockData({ day: date, store_id: myStore.value.id })
  }
  finally {
    isLoading.value = false
  }
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
  <div>
    <div class="blur-bga">
      <common-layout-center>
        <div class="w-fit">
          <product-manage-company @change="changeStores" />
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="px-[16px] pb-4">
        <div class="" />
        <!-- 日期选择 -->
        <div class="flex justify-center my-4 items-center gap-2">
          <div
            class="px-4 py-1 text-sm rounded-full cursor-pointer"
            :class="dateMode === 'today' ? 'bg-blue-500 color-[#fff]' : 'color-[#3971F3]'"
            @click="dateMode = 'today'"
          >
            今日
          </div>
          <div
            class="px-4 py-1 text-sm rounded-full cursor-pointer"
            :class="dateMode === 'custom' ? 'bg-blue-500 color-[#fff]' : 'color-[#3971F3]'"
            @click="dateMode = 'custom'"
          >
            自定义
          </div>
        </div>

        <!-- 自定义日期选择器 -->
        <div class="flex justify-center mb-4">
          <div v-if="dateMode === 'custom'" class="w-[80%] md:w-[40%]">
            <n-date-picker v-model:value="customDate" type="date" clearable />
          </div>
        </div>

        <!-- 数据汇总 -->
        <summary-card-payment title="数据汇总" :payments="stockDate.overview" />
        <!-- 封装后的饼图/表格组件 -->
        <summary-stock-chart
          title="成品大类"
          :stock-category-date="stockDate.finished_class"
          :loading="isLoading"
        />
        <summary-stock-chartnested
          title="成品品类"
          :stock-category-date="stockDate.finished_category"
          :loading="isLoading"
        />
        <summary-stock-chartnested
          title="成品工艺"
          :stock-category-date="stockDate.finished_craft"
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
  </div>
</template>
