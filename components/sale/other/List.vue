<script setup lang="ts">
// 其他收支单_列表_组件
const props = defineProps<{
  info: any[]
}>()

const emits = defineEmits(['amend', 'delete'])
const handleAmend = () => {
  emits('amend')
}
const handleDelete = () => {
  emits('delete')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="item.num" :tag-text="item.openType" :info="item">
        <template #info>
          <template v-for="(result, ind) in props.info" :key="ind">
            <div class="grid grid-cols-1 gap-[12px] px-[16px]">
              <div class="info">
                <div class="part">
                  <span class="part-left">所属门店</span>
                  <span class="part-right">{{ result.store.name || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">会员</span>
                  <span class="part-right">{{ result.member.nickname || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">会员手机</span>
                  <span class="part-right">{{ result.member.phone || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">主销</span>
                  <span class="part-right">{{ result.mainSalesman || '--' }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)] gap-[32px]" uno-lg="gap-[40px]">
            <div class="info delete cursor-pointer" @click="handleDelete">
              删除
            </div>
            <common-button-irregular text="修改" @click="handleAmend" />
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[12px] color-[#3971F3] text-size-[14px] dark:color-[#fff]';

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

.delete {
  --uno: 'font-semibold dark:border-[#4D4D4D] dark:color-[#fff]';
}
</style>
