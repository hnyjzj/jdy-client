<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: otherOrderInfo[]
  where: Where<otherOrderWhere>
}>()

const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/other/add?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-x-[16px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <common-card-list :title="`收支单号:${item.id}`">
        <template #info>
          <div class="info">
            <common-cell label="所属门店" :value="item.store?.name " />
            <common-cell label="收支类型" :value="props.where.type?.preset[item.type]" />
            <common-cell label="收支金额" :value="item.amount" />
            <common-cell label="收支来源" :value="props.where.source?.preset[item.source]" />
            <common-cell label="收支内容" :value="item.content" />
            <common-cell label="会员" :value="item.member?.name" />
            <common-cell label="主销" :value="item.clerk?.nickname " />
            <common-cell label="关联销售单" :value="item.order_id" />
          </div>
        </template>
        <template #footer>
          <div class="flex-end">
            <common-button-rounded padding="4px 36px" content="详情" @button-click="handleClick(item.id)" />
          </div>
        </template>
      </common-card-list>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px]';

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
