<script setup lang="ts">
const props = defineProps<{
  data: CustomerMaintenance[]
}>()

const emits = defineEmits(['goInfo', 'delete'])

const handleClick = () => {
  emits('goInfo')
}

const handleDelete = () => {
  emits('delete')
}

const typeMap = {
  1: '核销',
  2: '维修单',
  3: '销售单',
  4: '订金单',
  5: '到店记录',
  6: '回访记录',
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <template v-for="(item, index) in props.data" :key="index">
      <div>
        <common-gradient theme="theme" :title="item.createTime" :foldable="true">
          <template #before>
            <common-avatar :size="16" />
          </template>

          <template #body>
            <div class="flex flex-col gap-[8px]">
              <div class="item">
                <div class="left">
                  姓名
                </div>
                <div class="right">
                  {{ item.userInfo.nickname || '-- --' }}
                </div>
              </div>

              <div class="item">
                <div class="left">
                  联系方式
                </div>
                <div class="right">
                  {{ item.userInfo.phone || '-- --' }}
                </div>
              </div>

              <div class="item">
                <div class="left">
                  记录类型
                </div>
                <div class="right">
                  {{ typeMap[item.type] }}
                </div>
              </div>

              <div class="item">
                <div class="left">
                  记录内容
                </div>
                <div class="right">
                  {{ item.content }}
                </div>
              </div>

              <div class="item">
                <div class="left">
                  创建员工
                </div>
                <div class="right">
                  {{ item.staff }}
                </div>
              </div>

              <div class="item">
                <div class="left">
                  员工手机
                </div>
                <div class="right">
                  {{ item.staffPhone }}
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="footer gap-[32px]" uno-lg="gap-[40px]">
              <div class="flex flex-row gap-[24px] cursor-pointer">
                <div class="accidental" @click="handleDelete">
                  删除
                </div>
              </div>
              <div>
                <common-button-irregular text="会员详情" @click="handleClick" />
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#666666]';
  }
}

.footer {
  --uno: 'flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]';

  .accidental {
    --uno: 'color-[#3971F3] font-semibold font-size-[14px] dark:color-[#fff]';
  }
}
</style>
