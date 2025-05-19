<script lang="ts" setup>
import { calc } from 'a-calc'
import Userinfo from '~/components/my/user/Userinfo.vue'

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
}>()
const searchList = ref<Member[]>([])
const memberParams = ref<Member>({
  // 初始化store_id为当前门店id
  store_id: props.store.id,
} as Member)

// 搜索会员 防抖
const searchMember = async (val: string) => {
  if (val.length === 11) {
    searchList.value = await props.getMember(val)
  }
}

const memberId = ref()
const canUseScore = ref()
// 仅用于展示的会员信息
const userInfo = ref({} as Member)

const setUserInfo = (list: Member[]) => {
  userInfo.value = list[0]
  // 能使用的积分
  memberId.value = list[0].id
  emit('setMemberId', memberId.value)
  if (props.billingSet) {
    if (userInfo.value.integral && props.billingSet.discount_rate !== '0') {
      canUseScore.value = calc('(a / b )| =0 ~5,!n', {
        a: userInfo.value.integral,
        b: props.billingSet.discount_rate,
      })
    }
  }
}
const Key = ref()
const handleUpdateValue = async (value: string) => {
  if (value === null) {
    memberId.value = undefined
    Key.value = Date.now().toString()
    userInfo.value = {} as Member
    return
  }
  setUserInfo(searchList.value)
}
const showModel = ref(false)
// 新增会员
const handleAddMember = () => {
  showModel.value = true
}
const { $toast } = useNuxtApp()
// 提交新用户
const submitNewMember = async () => {
  const res = await props.addNewMember(memberParams.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success(res.message)
    showModel.value = false
    searchList.value = await props.getMember(memberParams.value?.phone)
    setUserInfo(searchList.value)
  }
}
const setMbid = async (id: string, phone: string) => {
  memberId.value = id
  await searchMember(phone)
  await handleUpdateValue('')
}
defineExpose({
  setMbid,
})
</script>

<template>
  <div class="pb-[16px]">
    <common-fold title="会员信息" :is-collapse="false">
      <div :key="Key" class="p-[16px] pb-0">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi
            :span="12" label="选择会员" class=""
            path="member_id"
            :rule="{
              required: true,
              message: `请选择会员`,
              trigger: ['change', 'blur'],
            }">
            <n-select
              v-model:value="memberId"
              filterable
              placeholder="输入手机号搜索"
              :options="searchList.map(v => ({
                label: v.phone,
                value: v.id,
              }))"
              :maxlength="11"
              clearable
              remote
              @search="searchMember"
              @update:value="handleUpdateValue"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="12">
            <div class="w-full">
              <common-button-rounded content="新增会员" @button-click="handleAddMember" />
            </div>
          </n-form-item-gi>
          <template v-if="userInfo?.id">
            <n-form-item-gi :span="24" label="会员信息">
              <div class="mr-[16px]">
                <template v-if="userInfo?.avatar">
                  <n-image width="68" :src="Userinfo.avatar" />
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
      <div>
        <member-lists-new v-model:rely="memberParams" :staff-list="props.staffs" @get-staff-list="props.getStaffs" />
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
