<script setup lang="ts">
import type { FormRules } from 'naive-ui'

const { $toast } = useNuxtApp()

const route = useRoute()

const routeQuery = ref(route.query)

useSeoMeta({
  title: '编辑会员',
})

const { createMember, getMemberInfo, updateMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const { getStoreStaffList, getStoreDetail, staffGetStoreList } = useStores()
const { myStore, storeDetails } = storeToRefs(useStores())

const StoresList = ref<{ label: string, value: string }[]>([])
const searchStores = useDebounceFn(async (query) => {
  const res = await staffGetStoreList({ page: 1, limit: 20, where: { name: query } })
  if (res.length) {
    StoresList.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)

const chosenStoreId = ref(memberInfo.value.store_id)
const targerStaffList = ref<Staff[]>([])

const memberParams = ref<Member>({} as Member)

const selectOptions = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
]

const birthday = ref()
const anniversary = ref()

const handleDateBlur = (memberKey: 'birthday' | 'anniversary') => {
  if (memberKey === 'birthday' && birthday.value) {
    const date = new Date(birthday.value)
    const formattedDate = date.toLocaleDateString('en-CA')
    memberParams.value.birthday = formattedDate
  }
  else if (memberKey === 'anniversary' && anniversary.value) {
    const date = new Date(anniversary.value)
    const formattedDate = date.toLocaleDateString('en-CA')
    memberParams.value.anniversary = formattedDate
  }
}

// 编辑会员信息
async function getInfo() {
  if (!routeQuery.value.id && !routeQuery.value.external_user_id) {
    // 新增会员时设置默认门店ID
    memberParams.value.store_id = myStore.value.id
  }
  else if (routeQuery.value.id) {
    await getMemberInfo({ id: routeQuery.value.id as string })
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
  else if (routeQuery.value.external_user_id) {
    await getMemberInfo({ external_user_id: routeQuery.value.external_user_id as string })
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await getInfo()
await searchStores('')
await getStoreStaffList({ id: myStore.value.id })

// 渲染日期信息
const conductEditDate = () => {
  if (routeQuery.value.id || routeQuery.value.external_user_id) {
    const birthdayDate = memberParams.value?.birthday ? new Date(memberParams.value.birthday) : null
    const birthdayFormattedDate = birthdayDate?.getTime()

    const anniversaryDate = memberParams.value?.anniversary ? new Date(memberParams.value.anniversary) : null
    const anniversaryFormattedDate = anniversaryDate?.getTime()

    birthday.value = birthdayFormattedDate
    anniversary.value = anniversaryFormattedDate
  }
}

// 转换已有的生日和纪念日信息格式
onMounted(() => {
  conductEditDate()
})

const showGender = () => {
  if (memberParams.value.gender === 1) {
    return '男'
  }
  else if (memberParams.value.gender === 2) {
    return '女'
  }
}

const showToUser = ref(showGender())

const backtrack = () => {
  const { back } = useRouter()

  back()
}

const execute = async () => {
  try {
    // 判断情况
    const hasId = !!memberParams.value.id
    const hasExternalUserId = !!routeQuery.value.external_user_id

    let res

    if (hasId) {
      // 已有会员id，执行更新
      res = await updateMemberInfo(memberParams.value)
    }
    else if (hasExternalUserId) {
      // 没有会员id但有外部用户id，执行创建
      res = await createMember(memberParams.value)
    }
    else {
      $toast.warning('编辑失败，请联系管理员/稍后再试')
      return
    }

    if (res?.code === HttpCode.SUCCESS) {
      $toast.success('编辑成功')
      backtrack()
    }
    else {
      $toast.warning('编辑失败，请检查输入')
    }
  }
  catch (error) {
    $toast.error('操作失败，请稍后重试')
    console.error(error)
  }
}

const getTargetStaff = async (id: string) => {
  await getStoreDetail(id)

  if (storeDetails.value) {
    targerStaffList.value = storeDetails.value.staffs
  }
}

// 当前用户有store_id时，则获取该门店的员工详情
if (memberInfo.value.store_id) {
  getTargetStaff(memberInfo.value.store_id)
}

// 更换门店时，重置顾问选项
const changeClear = () => {
  memberParams.value.consultant_id = ''
  targerStaffList.value = []
}

const formRef = ref()
const rules = ref<FormRules>({
  phone: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入11位的会员联系方式',
    type: 'string',
  },
  store_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择入会门店',
  },
  consultant_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择专属顾问',
    type: 'string',
  },
},
)
</script>

<template>
  <div>
    <div class="grid-12 pb-[80px]">
      <div class="col-12 px-[16px] py-[16px]" uno-lg="col-8 offset-2">
        <div class="flex flex-col gap-[16px]">
          <div class="primary">
            <common-gradient title="会员归属" theme="gradient" :italic="true">
              <template #body>
                <div class="flex flex-col gap-[12px]">
                  <div class="base flex flex-1 flex-col gap-[12px]">
                    <n-form ref="formRef" :rules="rules" :model="memberParams" label-placement="top">
                      <n-form-item label="姓名">
                        <n-input
                          v-model:value="memberParams.name"
                          placeholder="请输入会员姓名"
                          @keydown.enter.prevent
                        />
                      </n-form-item>

                      <n-form-item path="phone" label="联系方式">
                        <n-input
                          v-model:value="memberParams.phone"
                          :disabled="!!memberInfo.phone"
                          placeholder="请输入会员联系方式"
                          @keydown.enter.prevent
                        />
                      </n-form-item>

                      <n-form-item label="昵称">
                        <n-input
                          v-model:value="memberParams.nickname"
                          placeholder="请输入会员昵称"
                          @keydown.enter.prevent
                        />
                      </n-form-item>

                      <n-form-item label="性别">
                        <n-select
                          v-model:value="showToUser"
                          placeholder="请选择会员性别"
                          :options="selectOptions"
                          menu-size="large"
                          @focus="focus"

                          @blur="() => {
                            memberParams.gender = showToUser as any
                          }"
                        />
                      </n-form-item>

                      <n-form-item label="身份证号">
                        <n-input
                          v-model:value="memberParams.id_card"
                          size="large"
                          round
                          placeholder="请输入会员身份证号"
                          @focus="focus"
                        />
                      </n-form-item>

                      <n-form-item path="store_id" label="入会门店">
                        <n-select
                          v-model:value="memberParams.store_id"
                          placeholder="请选择入会门店"
                          :options="StoresList"
                          filterable
                          menu-size="large"
                          clearable
                          :disabled="!!memberInfo.store_id "
                          remote
                          @update:value="() => {
                            changeClear()
                          }"
                          @search="searchStores"
                          @focus="() => {
                            searchStores('')
                          }"
                          @blur="() => {
                            chosenStoreId = memberParams.store_id
                          }"
                        />
                      </n-form-item>

                      <n-form-item path="consultant_id" label="专属顾问">
                        <n-select
                          v-model:value="memberParams.consultant_id"
                          :disabled="!!memberInfo.consultant_id"
                          placeholder="请选择专属顾问"
                          :options="targerStaffList.map(v => ({
                            label: v.nickname,
                            value: v.id,
                          }))"
                          menu-size="large"
                          clearable
                          remote
                          @focus="(e) => {
                            focus(e)
                            getTargetStaff(chosenStoreId)
                          }"
                        />
                      </n-form-item>
                    </n-form>
                  </div>
                </div>
              </template>
            </common-gradient>
          </div>

          <div class="secondary">
            <common-gradient title="其他信息" theme="gradient" :italic="true">
              <template #body>
                <div class="flex flex-col gap-[12px]">
                  <div class="base flex flex-1 flex-col gap-[12px]">
                    <div class="secondary">
                      <div class="secondary-top">
                        生日
                      </div>
                      <div class="secondary-bottom">
                        <n-date-picker
                          v-model:value="birthday"
                          clearable
                          format="yyyy-MM-dd"
                          type="date"
                          @blur="handleDateBlur('birthday')"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        纪念日
                      </div>
                      <div class="secondary-bottom">
                        <n-date-picker
                          v-model:value="anniversary"
                          clearable
                          format="yyyy-MM-dd"
                          type="date"
                          @blur="handleDateBlur('anniversary')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </div>
    <common-button-bottom confirm-text="确认保存" cancel-text="取消" @confirm="execute" @cancel="backtrack" />
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 20px;
}

.n-base-selection-label {
  height: 40px !important;
}

.n-input-wrapper {
  border-radius: 20px !important;
}

.n-date-picker {
  border-radius: 20px;
}
</style>

<style scoped lang="scss">
.secondary {
  --uno: 'flex flex-col gap-[8px]';

  &-top {
    --uno: 'font-size-[16px] color-[#333333] dark:color-[#fff]';
  }
}
</style>
