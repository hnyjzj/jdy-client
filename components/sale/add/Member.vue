<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const props = withDefaults(defineProps<{
  memberList: Member[]
  getMember: (val: string) => void
  getMemberInfo: (val: string) => void
}>(), {

})
// 搜索会员 防抖
const searchMember = useDebounceFn((val) => {
  props.getMember(val)
}, 500)
const formData = defineModel<Orders>({ default: {

} })
// 仅用于展示的会员信息
const userInfo = ref({} as Member)
const handleUpdateValue = async (value: string, option: SelectOption) => {
  await props.getMember(option.label?.toString().slice(0, 11) as string)
  userInfo.value = props.memberList[0]
}
</script>

<template>
  <div>
    <common-fold title="会员信息" :is-collapse="false">
      <div class="p-[16px] pb-0">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi :span="12" label="会员" path="member_id" class="">
            <n-select
              v-model:value="formData.member_id"
              filterable
              placeholder="输入手机号搜索"
              :options="props.memberList.map(v => ({
                label: `${v.phone} (${v.nickname ? v.nickname : v.name})`,
                value: v.id,
              }))"
              clearable
              remote
              @search="searchMember"
              @update:value="handleUpdateValue"
            />
          </n-form-item-gi>
          <template v-if="userInfo?.id">
            <n-form-item-gi :span="12" label="会员信息">
              <div class="flex-col">
                <div>
                  昵称:{{ userInfo?.nickname || '' }}
                </div>
                <div>姓名:{{ userInfo?.name || '' }}</div>
                <div>积分:{{ userInfo?.integral || '' }}</div>
                <div>等级:{{ userInfo?.level || '' }}</div>
              </div>
            </n-form-item-gi>
          </template>
        </n-grid>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>

</style>
