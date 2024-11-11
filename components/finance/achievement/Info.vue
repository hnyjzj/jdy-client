<script setup lang="ts">
const props = defineProps<{
  data: Rule
}>()
</script>

<template>
  <div>
    <sale-order-nesting :title="props.data.name">
      <template #info>
        <div class="flex flex-col px-[16px] pb-[16px] gap-[12px]">
          <template v-for="(options, index) in props.data.category " :key="index">
            <div class="flex-center-between">
              <div class="left flex flex-row items-center gap-[8px]">
                <common-check rounded="4px" />
                <div class="font-size-[14px] color-[#333]">
                  {{ options.name }}
                </div>
              </div>
              <div class="right">
                <common-frame :is-icon="true" :is-disabled="true" />
              </div>
            </div>
          </template>
        </div>
      </template>
    </sale-order-nesting>
  </div>
</template>

<style scoped lang="scss">
</style>
