<script setup lang="ts">
const { $toast } = useNuxtApp()

const route = useRoute()

const guideTxt = () => {
  if (route.query.id) {
    return '编辑'
  }
  else {
    return '新增'
  }
}
useSeoMeta({
  title: () => `${guideTxt()}会员`,
})

const { createMember, getMemberInfo, updateMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const { getStoreList } = useStores()
const searchPage = ref<number>(1)
const storeParams = { page: searchPage.value, limit: 100 } as ReqList<Stores>
await getStoreList(storeParams)

const { storesList } = storeToRefs(useStores())

const { getStaffList } = useStaff()
const staffParams = { page: searchPage.value, limit: 12 } as ReqList<Staff>
await getStaffList(staffParams)

const { staffList } = storeToRefs(useStaff())

const memberParams = ref<Member>({} as Member)

const selectOptions = [
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '2',
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
  if (route.query.id) {
    await getMemberInfo(route.query.id as string)
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await getInfo()

const conductEditDate = () => {
  if (route.query.id) {
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

const turnOptions = (list: Stores[] | Staff[]) => {
  return list.map((item) => {
    if ('name' in item) {
      return {
        label: item.name,
        value: item.id,
      }
    }
    else {
      return {
        label: item.nickname,
        value: item.id,
      }
    }
  })
}

const backtrack = () => {
  const { back } = useRouter()
  back()
}

const execute = async () => {
  if (route.query.id) {
    const res = await updateMemberInfo(memberParams.value)
    if (res.code === HttpCode.SUCCESS) {
      $toast.success('编辑成功')
      backtrack()
    }
    else {
      $toast.warning(res.message ?? '编辑失败')
    }
  }
  else {
    const res = await createMember(memberParams.value)
    if (res.code === HttpCode.SUCCESS) {
      $toast.success('新增成功')
      backtrack()
    }
    else {
      $toast.warning(res.message ?? '新增失败')
    }
  }
}
</script>

<template>
  <div>
    <div class="grid-12">
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
                          memberParams.gender = Number(showToUser) as Gender
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
                          :options="turnOptions(storesList)"
                          menu-size="large"
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
                          :options="turnOptions(staffList)"
                          menu-size="large"
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
    <div class="h-[80px]">
      <common-button-bottom :confirm-text="`确认${guideTxt()}`" cancel-text="取消" @confirm="execute" @cancel="backtrack" />
    </div>
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
