<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  getMember: (val: string) => Promise<Member[]>
  getStaffs: () => void
  addNewMember: (val: Member) => any
  billingSet?: BillingSet
  store: Stores
  staffs: StoresStaff[]
}>()
const emit = defineEmits<{
  setMemberId: [val: string]
  setShowSubmit: [val: boolean]
}>()
const { userinfo } = storeToRefs(useUser())
const Key = ref()
const { $toast } = useNuxtApp()
// 提示新增
const tipAdd = ref(false)
// 能使用的积分
const canUseScore = ref()
// 仅用于展示的会员信息
const userInfo = ref({} as Member)
// 会员id
const memberId = ref()
const setUserInfo = (list: Member[]) => {
  userInfo.value = list[0]
  memberId.value = list[0].id
  emit('setMemberId', memberId.value)
  if (props.billingSet) {
    // 积分设置
    if (userInfo.value.integral && props.billingSet.discount_rate !== '0') {
      canUseScore.value = calc('(a / b )| =0 ~5,!n', {
        a: userInfo.value.integral,
        b: props.billingSet.discount_rate,
      })
    }
  }
}
// 搜搜列表
const searchList = ref<Member[]>([])
const memberParams = ref<Member>({
  // 初始化store_id为当前门店id
  store_id: props.store.id,

} as Member)

const searchPhone = ref()
// 搜索会员 防抖
const searchMember = async (val: string) => {
  if (!val) {
    $toast.error('请先输入手机号')
    return
  }
  memberId.value = undefined
  Key.value = Date.now().toString()
  userInfo.value = {} as Member
  searchList.value = await props.getMember(val)
  if (searchList.value.length === 0) {
    await props.getStaffs()
    memberParams.value.consultant_id = userinfo.value.id
    memberParams.value.phone = val
    tipAdd.value = true
  }
  else {
    setUserInfo(searchList.value)
  }
}

const showModel = ref(false)
// 新增会员
const handleAddMember = () => {
  showModel.value = true
}

// 提交新用户
const submitNewMember = async () => {
  const res = await props.addNewMember(memberParams.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success(res.message)
    showModel.value = false
    searchList.value = await props.getMember(memberParams.value?.phone)
    setUserInfo(searchList.value)
  }
  else {
    $toast.error(res.message)
  }
}
const setMbid = async (id: string, phone: string) => {
  memberId.value = id
  searchPhone.value = phone
  await searchMember(phone)
}
defineExpose({
  setMbid,
})
</script>

<template>
  <div class="pb-[16px]">
    <common-fold title="会员信息" :is-collapse="false">
      <div :key="Key" class="p-[16px] pb-0">
        <n-grid :cols="24" :x-gap="12">
          <n-form-item-gi
            :span="18"
            label="搜索会员手机号"
            path="searchPhone"
          >
            <n-input v-model:value="searchPhone" maxlength="11" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <div class="w-full">
              <common-button-rounded content="搜索" @button-click="searchMember(searchPhone)" />
            </div>
          </n-form-item-gi>
          <template v-if="userInfo?.id">
            <n-form-item-gi :span="24" label="会员信息">
              <div class="mr-[16px]">
                <template v-if="userInfo?.avatar">
                  <n-image width="68" :src="userInfo.avatar" />
                </template>
                <template v-else>
                  <icon name="i-svg:avatar" :size="68" />
                </template>
              </div>
              <div class="flex-col">
                <div>
                  昵称:{{ userInfo?.nickname || '' }}
                </div>
                <div>姓名:{{ userInfo?.name || '' }}</div>
                <div>
                  积分:{{ userInfo?.integral || '' }}
                  <template v-if="canUseScore">
                    (可抵扣{{ canUseScore }}元)
                  </template>
                </div>
                <div>等级:{{ userInfo?.level || '' }}</div>
              </div>
            </n-form-item-gi>
          </template>
        </n-grid>
      </div>
    </common-fold>

    <common-model
      v-model="showModel" title="新增会员" :show-ok="true" :show-cancel="true" @confirm="submitNewMember"
      @cancel="showModel = false">
      <div class="h-[300px] overflow-y-auto py-[16px]">
        <member-lists-new v-model:rely="memberParams" :staff-list="props.staffs" :get-staff-list="props.getStaffs" />
      </div>
    </common-model>
    <common-confirm
      v-model:show="tipAdd" icon="warning" title="提醒" text="暂无此会员,是否新增?" confirm-tex="新增" @submit="handleAddMember" />
  </div>
</template>

<style lang="scss" scoped>

</style>
