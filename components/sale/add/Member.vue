<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  getStaffs: () => void
  billingSet?: BillingSet
  store: Stores
  staffs: StoresStaff[]
}>()
const emit = defineEmits<{
  setMemberId: [val: string]
  setShowSubmit: [val: boolean]
}>()

const { myStore } = storeToRefs(useStores())
const { userinfo } = storeToRefs(useUser())

const { getMemberList, createMember } = useMemberManage()
const { memberList, filterList } = storeToRefs(useMemberManage())

// 获取会员列表
const getMember = async (val: string) => {
  await getMemberList({ page: 1, limit: 1, where: { phone: val } })
  return memberList.value || []
}
const orderObject = defineModel({ default: {
} as Orders })
const Key = ref()
const { $toast } = useNuxtApp()
// 提示新增
const tipAdd = ref(false)
// 能使用的积分
const canUseScore = ref()
// 仅用于展示的会员信息

// 会员id
const memberId = ref()
const setUserInfo = (list: Member[]) => {
  orderObject.value.member = list[0]
  memberId.value = list[0].id
  emit('setMemberId', memberId.value)
  if (props.billingSet) {
    // 积分设置
    if (orderObject.value.member.integral && props.billingSet.discount_rate !== '0') {
      canUseScore.value = calc('(a / b )| =0 ~5,!n', {
        a: orderObject.value.member.integral,
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
  orderObject.value.member = {} as Member
  searchList.value = await getMember(val)
  if (searchList.value.length === 0) {
    if (!myStore.value.id) {
      $toast.error('请先切换门店')
      return
    }
    await props.getStaffs()

    memberParams.value.consultant_id = userinfo.value.id
    memberParams.value.phone = val
    tipAdd.value = true
  }
  else {
    setUserInfo(searchList.value)
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

const showModel = ref(false)
// 新增会员
const handleAddMember = () => {
  showModel.value = true
}

// 提交新用户
const submitNewMember = async () => {
  const res = await createMember(memberParams.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success(res.message)
    showModel.value = false
    searchList.value = await getMember(memberParams.value?.phone)
    setUserInfo(searchList.value)
  }
  else {
    $toast.error(res?.message || '新增失败')
  }
}
</script>

<template>
  <div class="pb-[16px]">
    <common-card-info title="会员信息">
      <template #info>
        <div :key="Key" class="p-[16px] pb-0">
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi
              :span="18"
              label="搜索会员手机号"
              path="searchPhone"
            >
              <template #label>
                <span> 搜索会员手机号</span> <span class="color-[#DE5750]">*</span>
              </template>
              <n-input v-model:value="searchPhone" maxlength="11" clearable />
            </n-form-item-gi>
            <n-form-item-gi :span="6">
              <div class="w-full">
                <common-button-rounded content="搜索" @button-click="searchMember(searchPhone)" />
              </div>
            </n-form-item-gi>

            <template v-if="orderObject.member?.id">
              <n-form-item-gi :span="24" label="会员信息">
                <div class="mr-[16px]">
                  <template v-if=" orderObject.member?.avatar">
                    <n-image width="68" :src=" orderObject.member.avatar" />
                  </template>
                  <template v-else>
                    <icon name="i-svg:avatar" :size="68" />
                  </template>
                </div>
                <div class="flex-col">
                  <div>
                    昵称:{{ orderObject.member?.nickname || '' }}
                  </div>
                  <div>姓名:{{ orderObject.member?.name || '' }}</div>
                  <div>
                    积分:{{ orderObject.member?.integral || '' }}
                    <template v-if="canUseScore">
                      (可抵扣{{ canUseScore }}元)
                    </template>
                  </div>
                  <div>等级:{{ filterList.level?.preset[orderObject.member?.level] || orderObject.member?.level || '' }}</div>
                </div>
              </n-form-item-gi>
            </template>
          </n-grid>
        </div>
      </template>
    </common-card-info>

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
