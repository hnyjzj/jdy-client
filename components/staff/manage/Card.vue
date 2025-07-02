<script setup lang="ts">
const props = defineProps<{
  list: Staff[]
}>()

const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
const router = useRouter()
</script>

<template>
  <div class="grid-12">
    <div class="grid-12 gap-[16px] col-12" uno-xs="col-12" uno-sm="col-10 offset-1" uno-md="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <template v-for="(item, index) in props.list" :key="index">
        <div class="col-12" uno-xs="col-12" uno-sm="col-12" uno-md="col-6 " uno-lg="col-6" uno-xl="col-6">
          <sale-cards :title="`员工id:${item.id}`">
            <template #info>
              <div class="info">
                <img :src="ImageUrl(item.avatar)" alt="" class="wh-[40px] mb-[12px] rounded-[8px]">
                <common-cell label="姓名" :value="item.nickname" />
                <common-cell label="用户名" :value="item.username" />
                <common-cell label="性别" :value="sex(item.gender)" />
                <common-cell label="手机号" :value="item.phone || '未设置'" />
                <common-cell label="email" :value="item.email || '暂无' " />
              </div>
            </template>
            <template #footer>
              <div class="flex-between pl-[8px] bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
                <div />
                <div class="flex-between">
                  <div class="pr-[16px] color-[#1F6FEC] cursor-pointer" @click="router.push(`/manage/staffs/staff/info?id=${item.id}`)">
                    详情
                  </div>
                  <common-button-irregular text="编辑" @click="router.push(`/manage/staffs/staff/edit?id=${item.id}`)" />
                </div>
              </div>
            </template>
          </sale-cards>
        </div>
      </template>
    </div>
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
