<script setup lang="ts">
const props = defineProps<{
  data: any[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.data" :key="index">
      <div>
        <common-gradient theme="theme" :title="item.createTime">
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
        </common-gradient>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#333333] dark:color-[#cdcdd1]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#666666] dark:color-[#fff]';
  }
}

.footer {
  --uno: 'flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]';

  .accidental {
    --uno: 'color-[#3971F3] font-semibold font-size-[14px] dark:color-[#fff]';
  }
}
</style>
