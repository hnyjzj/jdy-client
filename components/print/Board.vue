<script setup lang="ts">
const props = defineProps<{
  details: any
}>()

// TODO: 这里只是占位用的渲染条件，后续修改
const phoneShow = true
</script>

<template>
  <div class="font-[20px]">
    {{ props.details }}
    <div class="base">
      <div class="default-presence">
        <div class="basics">
          门店名称
        </div>

        <div class="basics">
          销售时间
        </div>

        <div class="basics">
          销售单号
        </div>
      </div>

      <template v-if="phoneShow">
        <!-- 确认包含【门店电话】字段 -->
        <div class="basics">
          门店电话:
        </div>
      </template>
    </div>

    <div class="form">
      表格项占位
    </div>

    <div class="remark-part">
      <div class="basics">
        备注：
      </div>

      <div class="basics">
        优惠券：
      </div>
    </div>

    <div class="bill-part">
      <div>
        账单合计
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basics {
  --uno: 'font-size-[14px] color-[#000]';
}
</style>
