<script setup lang="ts">
// 测试数据。待删除
interface ProductInfo {
  name: string
  desc: string
}
const productInfo: ProductInfo[] = [
  {
    name: '条码',
    desc: 's123901287',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
]
const showPop = ref(false)

// 盘点单tab切换选项
const options = computed(() => [
  {
    // TODO: 文本信息过长，需要优化
    label: '成品业绩',
    value: 1,
  },
  {
    label: '旧料剩余抵值',
    value: 2,
  },
])

const currentSelected = ref(1)

const hasCheck = ref(false)

// const handleClick = () => {
//   showPop.value = true
// }
</script>

<template>
  <div>
    <common-popup v-model="showPop" />
    <div>
      <common-fold title="业绩汇总" :is-collapse="false">
        <div class="flex flex-col gap-[16px] px-[16px] py-[16px]">
          <div>
            <common-tab-secondary :options="options" :current-selected="currentSelected" />
          </div>
          <div>
            <sale-order-nesting v-model="hasCheck" title="成品业绩及对应旧料抵扣" :info="productInfo" />
          </div>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
