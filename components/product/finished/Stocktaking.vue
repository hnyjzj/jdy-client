<script setup lang="ts">
// 盘点单详情
const props = defineProps<{
  sheet: InventorySheet
}>()

// 盘点单状态
const statusDesc = {
  1: '已完成',
  2: '已撤销',
  3: '草稿',
  4: '盘点中',
}

// 计算实盘数量
const realCount = computed(() => {
  // 暂时用：实盘=应盘-盘亏+盘盈（确认后删除该条注释）
  const result = props.sheet.shouldCount - props.sheet.lossCount + props.sheet.profitCount
  return result
})

// 盘点单tab切换选项
const inventoryOptions = computed(() => [
  {
    label: '应盘',
    count: props.sheet.shouldCount,
    value: 1,
  },
  {
    label: '实盘',
    count: realCount.value,
    value: 2,
  },
  {
    label: '盘亏',
    count: props.sheet.lossCount,
    value: 3,
  },
  {
    label: '盘盈',
    count: props.sheet.profitCount,
    value: 4,
  },
])

// 当前选择的盘点类型
const currentSelected = ref(1)

// tab切换时，更新数据总量显示
const getCount = () => {
  switch (currentSelected.value) {
    case 1:
      return props.sheet.shouldCount || 0
    case 2:
      return realCount.value || 0
    case 3:
      return props.sheet.lossCount || 0
    case 4:
      return props.sheet.profitCount || 0
    default:
      return 0
  }
}

// 步骤条描述文本定义
const step = [
  {
    title: '盘点中',
    subs: 1,
  },
  {
    title: '盘点结束',
    subs: 2,
  },
  {
    title: '导出盘点差异',
    subs: 3,
  },
  {
    title: '已完成',
    subs: 4,
  },
]

// 盘点单详情状态--待处理、来源暂时不太确定，暂用：testInventory.InventoryStatus === 2 来代替（确认后删除该条注释）
const active = computed(() => {
  let progress = 1
  if (props.sheet.inventoryStatus === 1) {
    progress = 4
  }
  else if (props.sheet.inventoryStatus === 2) {
    progress = 3
  }
  return progress
})
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="rounded-6 bg-white w-auto top">
        <common-gradient title="基础信息">
          <template #body>
            <div class="flex flex-col gap-4">
              <div class="operation-information flex flex-col gap-1">
                <div class="part">
                  <div class="left">
                    盘点人
                  </div>
                  <div class="right">
                    {{ props.sheet.operator }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    监盘人
                  </div>
                  <div class="right">
                    {{ props.sheet.supervisor }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    盘点单号
                  </div>
                  <div class="right">
                    {{ props.sheet.num }}
                  </div>
                </div>
              </div>
              <div class="line-space" />
              <div class="other-information flex flex-col gap-1">
                <div class="part">
                  <div class="left">
                    盘点品牌
                  </div>
                  <div class="right">
                    {{ props.sheet.brand }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    盘点仓库
                  </div>
                  <div class="right">
                    {{ props.sheet.wareHouse }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    备注
                  </div>
                  <div class="right">
                    {{ props.sheet.remark || '无' }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    状态
                  </div>
                  <div class="right">
                    <common-tags type="lake" :text="statusDesc[props.sheet.inventoryStatus]" />
                  </div>
                </div>
              </div>
              <div class="line-space" />
              <div class="product-information flex flex-col gap-1">
                <div class="part">
                  <div class="left">
                    盘点范围
                  </div>
                  <div class="right">
                    {{ props.sheet.scope }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    大类
                  </div>
                  <div class="right">
                    {{ props.sheet.category }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    品类
                  </div>
                  <div class="right">
                    {{ props.sheet.refinement }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    工艺
                  </div>
                  <div class="right">
                    {{ props.sheet.technique || '' }}
                  </div>
                </div>
              </div>
              <div class="line-space" />
              <div class="product-information flex flex-col gap-1">
                <div class="part">
                  <div class="left">
                    总件数
                  </div>
                  <div class="right">
                    {{ props.sheet.totalCount }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    总金重
                  </div>
                  <div class="right">
                    {{ props.sheet.totalWeight }}
                  </div>
                </div>
                <div class="part">
                  <div class="left">
                    总标价
                  </div>
                  <div class="right">
                    {{ props.sheet.totalPrice }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
      <div class="info flex flex-col gap-4 rounded-6 bg-[#fff] w-auto px-4 py-4">
        <div class="flex flex-col gap-3">
          <common-tab-secondary v-model:current-selected="currentSelected" :options="inventoryOptions" />
          <common-step :description="step" :active-index="active" />
        </div>
        <div class="color-[#333333] dark:color-[#FFFFFF] font-normal text-[14px]">
          共{{ getCount() }}条数据
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.part {
  --uno: 'flex-start gap-3 text-sm font-normal';

  .left {
    --uno: 'color-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'color-[#333333] dark:color-[#FFFFFF]';
  }
}
</style>
