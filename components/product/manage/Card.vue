<script setup lang="ts" generic="T extends Record<string, any>">
const props = defineProps<{
  list: T[]
}>()
const goodsStatus = ref({
  1: '草稿',
  2: '正常',
  3: '已报损',
  4: '已调拨',
  5: '已出售',
  6: '已定出',
  7: '盘点中',
  8: '无库存',
} as Record<string, string>)
</script>

<template>
  <common-layout-center>
    <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
      <template v-for="(item, index) in props.list" :key="index">
        <div
          class="mb-4 rounded-[24px] blur-bgc p-[1px]">
          <div
            class="py-[8px] px-[16px] bg-gradient-linear-[90deg,#E9F1FE,#95D5FB] dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8] rounded-t-[24px] flex-start text-black dark:text-[#FFF]">
            <slot name="top" :info="item">
              <div class="flex items-center gap-2">
                <div v-if="item?.images?.length" class="pr-2">
                  <common-avatar :size="24" :img="item?.images[0]" />
                </div>
                <template v-if="item?.status">
                  <div class="enter-title" :class="item.status === 1 ? 'draft' : item.status === 2 ? 'wancheng' : 'chexiao'">
                    {{ goodsStatus[item.status] }}
                  </div>
                </template>
                <div class="font-semibold line-height-[20px] text-size-[14px]">
                  {{ item?.name }}
                </div>
              </div>
            </slot>
          </div>
          <slot name="info" :info="item" />
          <div class="bg-[#F3F5FE] dark:bg-[#F3F5FE1A] rounded-b-[24px] ">
            <slot name="bottom" :info="item" />
          </div>
        </div>
      </template>
    </div>
  </common-layout-center>
</template>

<style lang="scss" scoped>
.enter-title {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.caogao {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.wancheng {
  --uno: 'bg-#1b6ceb';
}
.chexiao {
  --uno: 'bg-[#999]';
}
</style>
