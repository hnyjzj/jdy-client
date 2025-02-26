<script setup lang="ts">
const props = defineProps<{
  productInfo: Product
  filterList: Where<Product>
  filterListToArray: FilterWhere<Product>[]
}>()

const goodsStatus = {
  0: '全部',
  1: '正常',
  2: '报损',
  3: '调拨',
  4: '已售',
  5: '退货',
  6: '盘点中',
}
</script>

<template>
  <common-gradient theme="theme" :title="props.productInfo.name ?? ''">
    <template #right>
      <common-tags type="orange" :text="goodsStatus[props.productInfo.status] ?? ''" />
    </template>
    <template #body>
      <div class="flex flex-col gap-3 px-4 py-3">
        <template v-for="(item, index) in props.filterListToArray" :key="index">
          <template v-if="item.label">
            <div class="flex-center-between text-sm font-normal">
              <div class="text-color-light">
                {{ item?.label }}
              </div>
              <div class="text-color">
                <template v-if="item.input === 'select'">
                  <span>
                    {{ filterList[item.name]?.preset[props.productInfo[item.name]] ?? '' }}
                  </span>
                </template>
                <template v-else-if="item.input === 'text'">
                  <span>
                    {{ props.productInfo[item.name] ?? '' }}
                  </span>
                </template>
                <template v-else-if="item.input === 'number'">
                  <span>
                    {{ props.productInfo[item.name] ?? '' }}
                  </span>
                </template>
                <template v-else-if="item.input === 'switch'">
                  <span>
                    {{ props.productInfo[item.name] ? '是' : '否' }}
                  </span>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </common-gradient>
</template>
