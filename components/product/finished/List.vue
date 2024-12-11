<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  productList: Product
  filterList: ProductWhere
}>()

const goodsStatus = {
  1: '调拨在途',
  2: '在库',
  3: '维修中',
}
</script>

<template>
  <div class="grid-12 px-[16px]">
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden" uno-lg="col-8 offset-2" uno-md="col-12">
      <div class="rounded-[24px]">
        <common-header-theme :title="props.productList.name">
          <common-tags type="orange" :text="goodsStatus[props.productList.status]" />
        </common-header-theme>
        <div class="flex flex-col gap-3 px-4 py-3">
          <template v-for="(value, key, index) in props.productList" :key="index">
            <template v-if="filterList[key]?.label">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  {{ filterList[key]?.label }}
                </div>
                <div class="color-[#333333]">
                  {{ value }}
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="grid-12">
          <div class="flex-center-row gap-4 px-4 py-2 col-12" uno-lg="col-8 offset-2" uno-md="col-12 flex-shrink-1">
            <common-button-rounded content="操作记录" color="#fff" />
            <common-button-rounded content="编辑" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
