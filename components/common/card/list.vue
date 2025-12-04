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
    class="px-[16px] mb-4 rounded-2 blur-bgc card-shaow">
    <div
      class="flex justify-between items-center py-[8px] text-color line-color-b"
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
    <template v-if="$slots.footer">
      <div
        class="py-2 line-color-t"
      >
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.card-shaow {
  box-shadow: 4px 4px 10px 4px #0000000f;
}
</style>
