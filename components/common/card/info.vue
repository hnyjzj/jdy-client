<!-- 列表里的卡片组件 -->
<script setup lang="ts">
const props = defineProps<{
  bg?: string
  title?: string | number
  tagText?: string | number
  status?: number
  statusMap?: { [key: number]: string }
  paddingBottom?: string
}>()
</script>

<template>
  <div
    class="p-3 pb-2 mb-4 md:p-[24px] rounded-2 blur-bgc"
    :style="{
      paddingBottom: props.paddingBottom || '',
    }"
  >
    <div
      class="flex justify-between items-center pb-2"
    >
      <div>
        <slot name="avatar" />
        <template v-if="props.title">
          <div class="flex items-center">
            <div class="w-1 h-4 bg-[#1A6DD8] rounded-[4px] mr-2" />
            <div class="text-[16px] font-bold text-[#1A6DD8]">
              {{ props.title }}
            </div>
          </div>
        </template>
        <slot name="top" />
      </div>
      <div>
        <template v-if="props.tagText">
          <common-tags :text="props.tagText" :status="props.status" :status-map="props.statusMap" :type="props.bg" />
        </template>
        <slot name="status" />
      </div>
    </div>

    <div class="pt-2" :style="{ paddingBottom: $slots.footer ? '8px' : '0' }">
      <slot name="info" />
    </div>

    <template v-if="$slots.footer">
      <div
        class="pt-2 line-color-t"
      >
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>
