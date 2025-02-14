<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: Orders[]
}>()

const emits = defineEmits<{
  userClick: [id: string]
}>()
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  emits('userClick', id)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] py-[16px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="item.id" :tag-text="showOrderType(item.type || 0)">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <div class="part">
                <span class="part-left">所属门店</span>
                <span class="part-right">{{ item.store.name || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员</span>
                <span class="part-right">{{ item.member?.nickname || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员手机</span>
                <span class="part-right">{{ item.member?.phone || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">收银员</span>
                <span class="part-right">{{ item.cashier?.nickname || '--' }}</span>
              </div>
            </div>
          </div>
          <div class="flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <common-button-irregular text="查看详情" @click="handleClick(item.id)" />
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[12px] px-[16px]';

  .part {
    --uno: 'flex-center-between';
    &-left {
      --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
    }
    &-right {
      --uno: 'text-size-[14px] color-[#333] dark:color-[#fff]';
    }
  }
}
</style>
