<script setup lang="ts">
const props = defineProps<{
  info: MemberInfo[]
}>()

const emits = defineEmits(['goInfo', 'changeIntegral'])

const levelDesc = {
  1: '银卡',
  2: '金卡',
  3: '钻石卡',
}

const handleClick = () => {
  emits('goInfo')
}

const changeIntegral = () => {
  emits('changeIntegral')
}

const getStatusText = (status: number) => {
  return status === 1 ? '正常' : status === 2 ? '未审核' : '已禁用'
}

const getStatusType = (status: number) => {
  return status === 1 ? 'green' : status === 2 ? 'orange' : 'black'
}
</script>

<template>
  <template v-for="(item, index) in props.info" :key="index">
    <div class="card">
      <div class="rounded-[24px] overflow-hidden">
        <common-gradient :title="item.compellation || '--'" theme="theme">
          <template #before>
            <common-avatar :src="item.img" :size="20" />
          </template>

          <template #right>
            <common-tags
              :text="getStatusText(item.status || 1)"
              :type="getStatusType(item.status || 1)"
            />
          </template>

          <template #body>
            <div class="body">
              <div class="part">
                <div class="part-left">
                  会员手机
                </div>
                <div class="part-right">
                  {{ item.phone }}
                </div>
              </div>
              <div class="part">
                <div class="part-left">
                  专属顾问
                </div>
                <div class="part-right">
                  {{ item.adviser }}
                </div>
              </div>
              <div class="part">
                <div class="part-left">
                  会员等级
                </div>
                <div class="part-right">
                  <common-level :desc="levelDesc[item.level]" />
                </div>
              </div>
              <div class="part">
                <div class="part-left">
                  入会门店
                </div>
                <div class="part-right">
                  {{ item.store }}
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="footer gap-[32px]" uno-lg="gap-[40px]">
              <div class="flex flex-row gap-[24px] cursor-pointer">
                <div class="accidental" @click="changeIntegral">
                  调整积分
                </div>
              </div>
              <div>
                <common-button-irregular text="查看详情" @click="handleClick" />
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.card {
  --uno: 'flex flex-col gap-[12px] rounded-[24px] bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] overflow-hidden dark:border-[rgb(239,240,246,0.1)]';
}

.body {
  --uno: 'flex flex-col gap-[12px]';

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

.footer {
  --uno: 'flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]';

  .accidental {
    --uno: 'color-[#3971F3] font-semibold font-size-[14px] dark:color-[#fff]';
  }
}
</style>
