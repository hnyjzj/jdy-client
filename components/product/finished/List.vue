<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  productInfo: Product
  filterList: ProductWhere
  filterListToArray: FilterWhere[]
}>()

const emits = defineEmits(['goLoss'])

const goodsStatus = {
  1: '在库',
  2: '报损',
  3: '维修中',
}

function goLoss() {
  emits('goLoss')
}
</script>

<template>
  <div class="grid-12 px-[16px] mb-12">
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden" uno-lg="col-8 offset-2" uno-md="col-12">
      <div class="rounded-[24px]">
        <common-header-theme :title="props.productInfo.name">
          <common-tags type="orange" :text="goodsStatus[props.productInfo.status]" />
        </common-header-theme>
        <div class="flex flex-col gap-3 px-4 py-3">
          <template v-for="(item, index) in props.filterListToArray" :key="index">
            <template v-if="item.label">
              <div class="flex-center-between text-sm font-normal even:bg-[rgba(215,215,215,0.2)]">
                <div class="text-color-light">
                  {{ item?.label }}
                </div>
                <div class="text-color">
                  {{ productInfo[item.name] }}
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="">
      <div class="flex-center-row grid-12 gap-4 px-4 py-2 col-12" uno-lg="col-8 offset-2" uno-md="col-12 flex-shrink-1">
        <div class="flex-1">
          <common-button-rounded content="操作记录" color="#fff" bgc="#FFF" />
        </div>
        <div class="flex-1">
          <common-button-rounded content="报损" color="#fff" bgc="#FFF" @button-click="goLoss" />
        </div>
        <div class="flex-1">
          <common-button-rounded content="编辑" @button-click="jump('/product/manage/edit', { code: props.productInfo.code })" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bottom {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc';
}
</style>
