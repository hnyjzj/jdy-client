<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  productInfo: Product
  filterList: ProductWhere
  filterListToArray: FilterWhere[]
}>()

const goodsStatus = {
  1: '在库',
  2: '报损',
  3: '维修中',
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
            <div class="flex-center-between text-sm font-normal even:bg-[rgba(215,215,215,0.2)]">
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
