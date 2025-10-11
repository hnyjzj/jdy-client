<script setup lang="ts">
const props = defineProps<{
  list: Staff[]
  myidentity: number
  filterData: Where<Staff>
  deleteFn: (id: string) => Promise<void>
}>()
const { $toast } = useNuxtApp()
const router = useRouter()

const toEdit = (id: string, identity: number) => {
  if (props.myidentity > identity || props.myidentity === 6) {
    router.push(`/manage/staffs/staff/edit?id=${id}`)
  }
  else {
    $toast.error('权限不足')
  }
}
const formatISODate = (isoString?: string) => {
  if (!isoString)
    return '无'
  const date = new Date(isoString)
  // 提取日期时间组件并补零
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const confirmShow = ref<boolean>(false)
const delId = ref<string | undefined>(undefined)
const delTips = (id: string) => {
  delId.value = id
  confirmShow.value = true
}
// 确认删除
const deleteConfirm = async () => {
  if (!delId.value)
    return
  await props.deleteFn(delId.value)
  confirmShow.value = false
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.list" :key="index">
      <sale-cards>
        <template #status>
          <div :style="{ color: item.is_disabled ? '#E54133' : '#2775EE' }">
            {{ item.is_disabled ? '禁用' : '正常' }}
          </div>
        </template>
        <template #avatar>
          <div class="flex-start">
            <div class="flex-start">
              <template v-if="!item.avatar">
                <icon name="i-svg:avatar" :size="28" />
              </template>
              <template v-else>
                <img :src="ImageUrl(item.avatar)" class="wh-[28px] rounded-[48px]">
              </template>
            </div>
            <div class="pl-[12px]">
              {{ item.nickname }}
            </div>
          </div>
        </template>
        <template #info>
          <div class="info">
            <common-cell label="手机号" :value="item.phone || '未设置'" />
            <common-cell label="性别" :value="props.filterData.gender?.preset[item.gender as number] || '未设置'" />
            <common-cell label="身份" :value="props.filterData.identity?.preset[item.identity as number] || '未设置'" value-weight="600" val-color="#2B77EF" />
            <common-cell label="用户名" :value="item.username" />
            <common-cell label="最后登录时间" :value="formatISODate(item.last_login_at)" />
            <staff-manage-display :items="item.stores" label="所属门店" />
            <staff-manage-display :items="item.store_superiors" label="负责门店" />
            <staff-manage-display :items="item.regions" label="所属区域" />
            <staff-manage-display :items="item.region_superiors" label="负责区域" />
            <staff-manage-display :items="item.store_admins" label="管理门店" />
            <staff-manage-display :items="item.region_admins" label="管理区域" />
          </div>
        </template>
        <template #footer>
          <div class="flex-between pl-[8px] bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <template v-if="(props.myidentity > (item.identity as number)) || props.myidentity === 6">
              <div class="cursor-pointer" @click="delTips(item.id as string)">
                <icon name="i-svg:delete" :size="16" />
              </div>
            </template>
            <template v-else>
              <div />
            </template>

            <div class="flex-between">
              <div class="pr-[36px] color-[#1F6FEC] cursor-pointer" @click="router.push(`/manage/staffs/staff/info?id=${item.id}`)">
                详情
              </div>
              <common-button-irregular text="编辑" @click="toEdit(item.id as string, item.identity as number)" />
            </div>
          </div>
        </template>
      </sale-cards>
    </template>

    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除此员工?"
      icon="error"
      @submit="deleteConfirm"

    />
  </div>
</template>

<style lang="scss" scoped>
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
