<script setup lang="ts">
const props = defineProps<{
  info: Member[]
}>()

const emits = defineEmits<{
  goInfo: [id: string]
  changeIntegral: [id: string]
}>()

const { getMemberWhere } = useMemberManage()
await getMemberWhere()

const { filterListToArray } = storeToRefs(useMemberManage())

const showInfo = filterListToArray.value

const getTarget = (arrs: Member, keyword: string, type: 'level' | 'status') => {
  const targetOption = showInfo?.find(p => p.name === keyword)
  const targetPreset = targetOption?.preset
  return targetPreset[arrs[type]]
}

const getStatusType = (status: number) => {
  return status === 1 ? 'green' : 'orange'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <common-gradient :title="item.name || '--'" theme="theme">
        <template #before>
          <common-avatar :size="20" />
        </template>

        <template #right>
          <common-tags
            :text="getTarget(item, 'status', 'status')"
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
                {{ item.consultant_id }}
              </div>
            </div>
            <div class="part">
              <div class="part-left">
                会员等级
              </div>
              <div class="part-right">
                <common-level :desc="getTarget(item, 'level', 'level')" />
              </div>
            </div>
            <div class="part">
              <div class="part-left">
                入会门店
              </div>
              <div class="part-right">
                {{ item.store_id }}
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="footer gap-[32px]" uno-lg="gap-[40px]">
            <div class="flex flex-row gap-[24px] cursor-pointer">
              <div class="accidental" @click="emits('changeIntegral', item.id)">
                调整积分
              </div>
            </div>
            <div>
              <common-button-irregular text="查看详情" @click="emits('goInfo', item.id)" />
            </div>
          </div>
        </template>
      </common-gradient>
    </template>
  </div>
</template>

<style scoped lang="scss">
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
