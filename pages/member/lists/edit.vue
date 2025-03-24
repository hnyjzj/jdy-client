<script setup lang="ts">
const { $toast } = useNuxtApp()

const route = useRoute()

const routeQuery = ref(route.query)

useSeoMeta({
  title: '编辑会员',
})

const { createMember, getMemberInfo, updateMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const { myStore, myStoreList, StoreStaffList } = storeToRefs(useStores())

const { getMyStore, getStoreStaffList } = useStores()

const getList = async () => await getMyStore({ page: 1, limit: 20 })

const memberParams = ref<Member>({
  // 初始化store_id为当前门店id
  store_id: myStore.value.id,
} as Member)

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
await getMyStore({ page: 1, limit: 20 })
await getStoreStaffList({ id: myStore.value.id })

// 渲染日期信息
const conductEditDate = () => {
  if (routeQuery.value.id || routeQuery.value.external_user_id) {
    const birthdayDate = new Date(memberParams.value.birthday)
    const birthdayFormattedDate = birthdayDate.getTime()

    const anniversaryDate = new Date(memberParams.value.anniversary)
    const anniversaryFormattedDate = anniversaryDate.getTime()

    birthday.value = birthdayFormattedDate
    anniversary.value = anniversaryFormattedDate
  }
}

// 编辑用户信息的情况下，转换已有的生日和纪念日信息格式
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
  }
  catch (error) {
    $toast.error('操作失败，请稍后重试')
    console.error(error)
  }
}
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
                    <div class="secondary">
                      <div class="secondary-top">
                        姓名
                      </div>
                      <div class="secondary-bottom">
                        <n-input
                          v-model:value="memberParams.name"
                          size="large"
                          round
                          placeholder="请输入会员姓名"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        联系方式
                      </div>
                      <div class="secondary-bottom">
                        <n-input
                          v-model:value="memberParams.phone"
                          size="large"
                          maxlength="11"
                          round
                          placeholder="请输入会员联系方式"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        昵称
                      </div>
                      <div class="secondary-bottom">
                        <n-input
                          v-model:value="memberParams.nickname"
                          size="large"
                          round
                          placeholder="请输入会员昵称"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        性别
                      </div>
                      <n-select
                        v-model:value="showToUser"
                        placeholder="请选择会员性别"
                        :options="selectOptions"
                        menu-size="large"
                        @blur="() => {
                          memberParams.gender = showToUser as any
                        }"
                      />
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        身份证号
                      </div>
                      <div class="secondary-bottom">
                        <n-input
                          v-model:value="memberParams.id_card"
                          size="large"
                          round
                          placeholder="请输入会员身份证号"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        入会门店
                      </div>
                      <div class="secondary-bottom">
                        <n-select
                          v-model:value="memberParams.store_id"
                          placeholder="请选择入会门店"
                          :options="myStoreList.map(v => ({
                            label: v.name,
                            value: v.id,
                          }))"
                          menu-size="large"
                          clearable
                          remote
                          @focus="() => { getList }"
                        />
                      </div>
                    </div>
                    <div class="secondary">
                      <div class="secondary-top">
                        专属顾问
                      </div>
                      <div class="secondary-bottom">
                        <n-select
                          v-model:value="memberParams.consultant_id"
                          placeholder="请选择专属顾问"
                          :options="StoreStaffList.map(v => ({
                            label: v.nickname,
                            value: v.id,
                          }))"
                          menu-size="large"
                          clearable
                          remote
                          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
                        />
                      </div>
                    </div>
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
