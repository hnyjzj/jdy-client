<!-- 列表里的卡片组件 -->
<script setup lang="ts">
const props = defineProps<{
  bg?: string
  title?: string | number
  tagText?: string | number
  status?: number
  statusMap?: { [key: number]: string }
}>()
</script>

<template>
  <div
    class="px-[16px] mb-4 rounded-2 blur-bgc">
    <div
      class="flex justify-between items-center py-[8px] text-color"
      style="border-bottom:1px solid #E6E6E8;"
    >
      <div>
        <slot name="avatar" />
        <template v-if="props.title">
          <div class="text-[14px] font-semibold color-[#1B2129] dark:color-[#fff]">
            {{ props.title }}
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
    <div class="py-2">
      <slot name="info" />
    </div>
    <div
      class="py-2"
      style="border-top:1px solid #E6E6E8;"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
