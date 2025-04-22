<script lang="ts" setup>
import { calc } from 'a-calc'

const props = withDefaults(defineProps<{
  getMember: (val: string) => Promise<Member[]>
  getStaffs: () => void
  addNewMember: (val: Member) => any
  billingSet?: BillingSet
  store: Stores
  staffs: StoresStaff[]
}>(), {

})
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
const formData = defineModel<Orders>('formData', { default: {
  amount: 0, // 应付金额
  type: undefined, // 订单类型
  source: undefined, // 订单来源
  remark: '', // 备注
  discount_rate: undefined, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: undefined, // 会员ID
  store_id: '', // 门店ID
  cashier_id: undefined, // 收银员ID
  //   积分抵扣
  deduction_points: undefined,
  isIntegral: true,
  products: [], // 商品列表
  salesmans: [{
    salesman_id: undefined,
    performance_rate: 100,
    is_main: true,
  }],
  payment_method: [{ method: undefined, money: 0 }], // 支付方式
} })
const canUseScore = ref()
// 仅用于展示的会员信息
const userInfo = ref({} as Member)

const setUserInfo = (list: Member[]) => {
  userInfo.value = list[0]
  // 能使用的积分
  formData.value.member_id = list[0].id
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
    formData.value.member_id = undefined
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
// 提交新用户
const submitNewMember = async () => {
  const res = await props.addNewMember(memberParams.value)
  if (res.code === HttpCode.SUCCESS) {
    showModel.value = false
    searchList.value = await props.getMember(memberParams.value?.phone)
    setUserInfo(searchList.value)
  }
}
</script>

<template>
  <div>
    <common-fold title="会员信息" :is-collapse="false">
      <div :key="Key" class="p-[16px] pb-0">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi :span="12" label="选择会员" path="member_id" class="">
            <n-select
              v-model:value="formData.member_id"
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
            <n-form-item-gi :span="12" label="会员信息">
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
