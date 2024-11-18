<script setup lang="ts">
import { finishedColumns, finishedData, oldColumns, oldData } from '~/types/test'

// 测试table数据。待替换
const finishedMock = finishedColumns
const oldMock = oldColumns
// 测试data数据。待替换
const finished = ref(finishedData)
const old = ref(oldData)

// 盘点单tab切换选项
const options = computed(() => [
  {
    label: '成品业绩',
    value: 1,
  },
  {
    label: '旧料剩余抵值',
    value: 2,
  },
])

const currentSelected = ref(1)

const updateKey = ref(0)

// 监听 currentSelected 的变化
watch(currentSelected, () => {
  // 触发更新
  updateKey.value++
})

const renderData = computed(() => {
  return currentSelected.value === 1 ? finished.value : old.value
})

const renderTitle = computed(() => {
  return currentSelected.value === 1 ? '成品业绩及对应旧料抵扣' : '旧料剩余抵值'
})

const renderOptions = computed(() => {
  return currentSelected.value === 1 ? finishedMock : oldMock
})
</script>

<template>
  <div>
    <div>
      <div class="flex flex-col gap-[16px] px-[16px] py-[16px]">
        <div>
          <common-tab-secondary
            v-model:current-selected="currentSelected" :options="options" />
        </div>
        <div>
          <common-fold :title="renderTitle">
            <div class="flex flex-col pt-[16px]">
              <common-table :key="updateKey" :columns="renderOptions" :data="renderData" />
            </div>
          </common-fold>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
