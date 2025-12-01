<script setup lang="ts" generic="T extends Record<string, any>">
const props = defineProps<{
  list: T[]
}>()
</script>

<template>
  <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
    <template v-for="(item, index) in props.list" :key="index">
      <common-card-list>
        <template #top>
          <div class="flex items-center gap-2">
            <div v-if="item?.images?.length" class="pr-2">
              <common-avatar :size="24" :img="item?.images[0]" />
            </div>
            <div class="font-semibold line-height-[20px] text-size-[14px]">
              {{ item?.name }}
            </div>
          </div>
        </template>
        <template #status>
          <template v-if="item?.status">
            <div class="px-2 rounded-[8px] text-[#FFF]" :style="getStatusStyle(item.status, GoodsStatusColorMap)">
              <slot name="status" :info="item.status">
                {{ GoodsStatusMap[item.status as GoodsStatus] }}
              </slot>
            </div>
          </template>
        </template>
        <template #info>
          <slot name="info" :info="item" />
        </template>
        <template #footer>
          <slot name="bottom" :info="item" />
        </template>
      </common-card-list>
    </template>
  </div>
</template>
