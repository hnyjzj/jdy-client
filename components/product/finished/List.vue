<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  productList: FinishedProduct
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
        <common-gradient :title="props.productList.name" theme="theme" text-color="#1B2129">
          <template #right>
            <common-tags type="orange" :text="goodsStatus[props.productList.status]" />
          </template>

          <template #body>
            <div class="flex flex-col gap-3">
              <template v-if="props.productList.info.length">
                <template v-for="(item, index) in props.productList.info" :key="index">
                  <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                    <div class="color-[#666666]">
                      {{ item.name }}
                    </div>
                    <div class="color-[#333333]">
                      {{ item.description }}
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <common-empty />
              </template>
            </div>
          </template>

          <template #footer>
            <div class="grid-12">
              <div class="flex-center-row gap-4 px-4 py-2 col-12" uno-lg="col-8 offset-2" uno-md="col-12 flex-shrink-1">
                <common-button-rounded content="操作记录" color="#fff" />
                <common-button-rounded content="编辑" />
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </div>
</template>
