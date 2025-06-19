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
  <div>
    <div class="grid grid-cols-3 gap-4">
      <template v-for="(item, index) in props.list" :key="index">
        <template v-if="item.id && item.store_id">
          <div class="bg-[#fff] border-solid border-[1px] border-[#EFF0F6] rounded-[24px] overflow-hidden">
            <div class="exhibition p-[16px]">
              <div class="font-[14px] font-semibold color-[#000] mb-[8px]">
                {{ item.name }}
              </div>
              <div class="font-[14px] color-[#666666]">
                {{ showToUser(Number(item.type)) }}
              </div>
            </div>

            <div class="operating bg-[#EFF0F6] px-[16px] py-[10px]">
              <div class="flex-center-row gap-[20px]">
                <div class="ope-but color-[#FF2F2F]" @click="emits('delete', item.id)">
                  删除
                </div>

                <div class="ope-but color-[#3971F3]" @click="emits('copy', item.id, item.store_id, index)">
                  复制
                </div>

                <div class="ope-but color-[#3971F3]" @click="emits('edit', item.id, Number(item.type), item.store_id)">
                  编辑
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="item.is_default === true">
          <div class="bg-[#fff] border-solid border-[1px] border-[#EFF0F6] rounded-[24px] overflow-hidden">
            <div class="exhibition p-[16px]">
              <div class="font-[14px] font-semibold color-[#000] mb-[8px]">
                {{ item.name }}
              </div>
              <div class="font-[14px] color-[#666666]">
                可复制该模板至所需门店
              </div>
            </div>

            <div class="operating bg-[#EFF0F6] px-[16px] py-[10px]">
              <div class="flex-center-row gap-[20px]">
                <div class="ope-but color-[#3971F3]" @click="emits('copy', item.id, item.store_id, index)">
                  复制
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.body {
  --uno: 'bg-[rgba(255,255,255,.7)] h-100vh p-[16px] rounded-t-[24px] border-solid border-[1px] border-[#EFF0F6]';
}

.ope-but {
  --uno: 'font-[14px] font-semibold cursor-pointer';
}
</style>
