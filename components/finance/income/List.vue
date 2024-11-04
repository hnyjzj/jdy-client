<script setup lang="ts">
// 收支账单列表
const props = defineProps<{
  info: SalesSlip[]
}>()

const emits = defineEmits(['info'])
const handleClick = () => {
  emits('info')
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="item.num" :tag-text="item.openType" :info="item">
        <template #info>
          <template v-for="(result, ind) in props.info" :key="ind">
            <div class="grid grid-cols-1 gap-[12px]">
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
                  <span class="part-left">收银员</span>
                  <span class="part-right">{{ result.mainSalesman || '--' }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="footer">
            <div class="info font-semibold" @click="handleClick">
              详情
            </div>
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
.footer {
  --uno: 'flex-center-row gap-[12px] justify-items-center bg-[#F3F5FE] rounded-b-[24px] px-[40px] py-[8px] dark:bg-[rgba(243,245,254,0.1)]';
}
.info {
  --uno: 'flex flex-col justify-items-center gap-[12px] px-[16px] color-[#3971F3] text-size-[14px] dark:color-[#fff]';

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
