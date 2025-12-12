<script setup lang="ts">
// 打印模板页
const props = defineProps<{
  list: PrintTemplate[]
}>()

const emits = defineEmits<{
  delete: [id: string]
  copy: [id: string | undefined, store_id: string | undefined, index: number]
  edit: [id: string, type: number, store_id: string]
}>()

const sysPrintType = [
  { label: '销售单', value: PrintType.SALE_ORDER },
  { label: '退货单', value: PrintType.RETURN_ORDER },
  { label: '订金单', value: PrintType.DEPOSIT_ORDER_SUB },
  { label: '维修单', value: PrintType.DEPOSIT_ORDER },
]

const showToUser = (type: number) => {
  const target = sysPrintType.find(item => item.value === type)
  return target?.label || ''
}
</script>

<template>
  <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
    <template v-for="(item, index) in props.list" :key="index">
      <template v-if="item.id && item.store_id">
        <common-card-list :title="item.name">
          <template #info>
            <div class="min-h-[50px]">
              <div class="font-[14px] text-color">
                {{ showToUser(Number(item.type)) }}
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between gap-[20px]">
              <div class="cursor-pointer flex items-center gap-[6px]" @click="emits('delete', item.id)">
                <icon name="i-svg:delete" :size="16" />
                <span class="color-[#F82F2F]">删除</span>
              </div>
              <div class="flex gap-[12px]">
                <common-button-rounded content="编辑" @button-click="emits('edit', item.id, Number(item.type), item.store_id)" />
                <common-button-rounded
                  color="#1B6BEB" bgc="#fff"
                  border="1px solid #1B6BEB" padding="7px 12px" content="复制" @button-click="emits('copy', item.id, item.store_id, index)" />
              </div>
            </div>
          </template>
        </common-card-list>
      </template>
      <template v-else-if="item.is_default === true">
        <common-card-list :title="item.name">
          <template #info>
            <div class="min-h-[50px]">
              <div class="font-[14px] text-color">
                复制至本门店
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex flex-end">
              <div />
              <div class="w-fit">
                <common-button-rounded
                  color="#1B6BEB" bgc="#fff"
                  border="1px solid #1B6BEB" padding="7px 12px" content="复制" @button-click="emits('copy', item.id, item.store_id, index)" />
              </div>
            </div>
          </template>
        </common-card-list>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.bg {
  --uno: 'bg-[#fff] border-solid border-[1px] border-[#EFF0F6] rounded-[24px] overflow-hidden';
}

.ope-but {
  --uno: 'font-[14px] font-semibold cursor-pointer text-nowrap';
}
</style>
