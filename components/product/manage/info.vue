<script setup lang="ts">
const props = defineProps<{
  productInfo: ProductFinisheds
  filterList: Where<ProductFinisheds>
  filterListToArray: FilterWhere<ProductFinisheds>[]
}>()
</script>

<template>
  <common-gradient theme="theme" :title="props.productInfo.name ?? ''">
    <template #right>
      <common-tags type="orange" :text="filterList.type?.preset[props.productInfo.type] ?? ''" />
    </template>
    <template #body>
      <div class="flex gap-4">
        <template v-for="(img, index) in productInfo.images" :key="index">
          <img class="" :src="ImageUrl(img)" width="100" height="100">
        </template>
      </div>
      <div class="flex flex-col gap-3 px-4 py-3" uno-sm="grid grid-cols-[1fr_1fr] gap-x-8">
        <template v-for="(item, index) in props.filterListToArray" :key="index">
          <template v-if="item.label">
            <div class="flex justify-between text-sm font-normal">
              <div class="text-color-light">
                {{ item?.label }}
              </div>
              <div class="info-val">
                <template v-if="item.input === 'select'">
                  <span>
                    {{ filterList[item.name]?.preset[props.productInfo[item.name]] ?? '' }}
                  </span>
                </template>
                <template v-else-if="item.input === 'text'">
                  <template v-if="item.label === '门店'">
                    <span>
                      {{ props.productInfo.store.name ?? '' }}
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      {{ props.productInfo[item.name] ?? '' }}
                    </span>
                  </template>
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
                <template v-else-if="item.input === 'list'">
                  {{ props.productInfo[item.name]?.length ? props.productInfo[item.name].join(',') : '' }}
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </common-gradient>
</template>

<style scoped>
.info-val {
  --uno: 'text-color w-[200px] text-right';
  word-break: normal;
  word-break: break-all;
}
</style>
