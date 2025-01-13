<script lang="ts" setup>
const props = defineProps<{
  data: any[]
}>()
const showPopover = ref(false)
const actions = [
  { text: '今日' },
  { text: '本月' },
]
</script>

<template>
  <div class="sumup">
    <div class="flex items-center justify-between">
      <div>
        <div class="name">
          于依依
        </div>
        <div class="shop">
          许昌周大生七一路店
        </div>
      </div>
      <div>
        <van-popover
          v-model:show="showPopover"
          :actions="actions"
        >
          <template #reference>
            <div class="popover-btn">
              <div class="mr-1">
                今日
              </div>
              <icon name="jdy:down" :size="10" color="#666" />
            </div>
          </template>
        </van-popover>
      </div>
    </div>
    <!-- <customer-data-tabel :data="props.data" /> -->
    <customer-data-chart :data="props.data" />
  </div>
</template>

<style>
:root {
  /* 气泡弹出层 */
  --van-popover-action-width: 80px;
  --van-popover-light-background: #c7daff;
  --van-popover-light-text-color: #4b576d;
}
</style>

<style lang="scss" scoped>
.sumup {
  --uno: 'blur-bgc px-24px py-16px rounded-16px';
  .name {
    --uno: 'text-16px font-600 text-color';
  }
  .shop {
    --uno: 'text-12px font-600 mt-2 text-color';
  }
  .popover-btn {
    --uno: 'flex items-center py-[6px] px-[10px] bg-[#C7DAFF] text-[#4B576D] rounded-full text-[12px]';
    box-shadow: 0 2px 12px rgba(50, 50, 51, 0.12);
  }
  .popover {
    --uno: 'text-[12px]';
    &-item {
      -uno: 'w-[58px] py-6px px-10px rounded-8px';
    }
  }
}
</style>
