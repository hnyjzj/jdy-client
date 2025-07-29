<script setup lang="ts">
// 维修单列表
const props = defineProps<{
  list: ServiceOrderInfo[]
  where: Where<service>
  getList: () => Promise<void>
  cancelOrder: (id: string) => Promise<boolean>
  payOrder: (id: string) => Promise<boolean>
}>()

// 查看详情
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/service/info?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.list" :key="index">
      <sale-cards :title="`单号:${item.id}`" :tag-text="props.where.status?.preset[item.status]">
        <template #info>
          <div class="info">
            <common-cell label="门店" :value="item.store?.name" />
            <common-cell :label="item.member?.nickname! || '会员'" :value="item.member?.phone" />
            <common-cell label="维修项目" :value="item.name" />
            <template v-if="item.products?.length">
              <common-cell label="货品名称" :value="item?.products[0]?.name || '--'" />
            </template>
            <common-cell label="维修费" :value="item.expense" />
            <common-cell label="取货方式" :value="item.delivery_method === 1 ? '自提' : '邮寄'" />
            <common-cell label="创建时间" :value="formatISODate(item.created_at as string)" />
            <common-cell label="更新时间" :value="formatISODate(item.updated_at as string)" />
          </div>
        </template>
        <template #footer>
          <div class="flex-between bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <div class="" />
            <common-button-irregular text="查看详情" @click="handleClick(item.id)" />
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px] px-[16px]';

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
