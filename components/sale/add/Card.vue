<script lang="ts" setup>
const props = withDefaults(defineProps<{
  list: any[]
}>(), {
  list: () => [],
})
</script>

<template>
  <common-fold title="标题/名称/单号/条码示例">
    <div class="grid-12 gap-[12px] pt-[12px] pb-[16px]">
      <template v-for="(item, index) in props.list" :key="index">
        <div class="col-12 rounded-1" uno-lg="col-12">
          <div class="flex-between text-[14px] px-[16px]">
            <div class="text-[#666666] dark:text-[rgb(203,205,209)]">
              {{ item.name }}
            </div>
            <div class="text-[#333333] dark:text-[#FFFFFF]">
              {{ item.value }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <slot name="footer" />
  </common-fold>
</template>
