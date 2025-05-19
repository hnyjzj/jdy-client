<script setup lang="ts">
const props = defineProps<{
  rely: Member
  staffList: StoresStaff[]
}>()

const emit = defineEmits<{
  (e: 'update:rely', value: Member): void
  (e: 'getStaffList'): void
}>()

const newParams = computed({
  get: () => props.rely,
  set: value => emit('update:rely', value),
})

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

const showGender = () => {
  if (newParams.value.gender === 1) {
    return '男'
  }
  else if (newParams.value.gender === 2) {
    return '女'
  }
}

const showToUser = ref(showGender())

const birthday = ref()
const anniversary = ref()

// 移除年份字段
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString('en-CA')
  const [, month, day] = formattedDate.split('-')
  return `${month}-${day}`
}

// 赋值给方法参数
const handleDateBlur = (memberKey: 'birthday' | 'anniversary') => {
  if (memberKey === 'birthday' && birthday.value) {
    newParams.value.birthday = formatDate(birthday.value)
  }
  else if (memberKey === 'anniversary' && anniversary.value) {
    newParams.value.anniversary = formatDate(anniversary.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-[12px]">
    <div class="base flex flex-1 flex-col gap-[12px]">
      <div class="secondary">
        <div class="secondary-top">
          姓名
        </div>
        <div class="secondary-bottom">
          <n-input
            v-model:value="newParams.name"
            size="large"
            round
            placeholder="请输入会员姓名"
            @focus="focus"
          />
        </div>
      </div>
      <div class="secondary">
        <div class="secondary-top">
          联系方式
        </div>
        <div class="secondary-bottom">
          <n-input
            v-model:value="newParams.phone"
            size="large"
            maxlength="11"
            round
            placeholder="请输入会员联系方式"
            @focus="focus"
          />
        </div>
      </div>
      <div class="secondary">
        <div class="secondary-top">
          昵称
        </div>
        <div class="secondary-bottom">
          <n-input
            v-model:value="newParams.nickname"
            size="large"
            round
            placeholder="请输入会员昵称"
            @focus="focus"
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
            newParams.gender = showToUser as any
          }"
        />
      </div>
      <div class="secondary">
        <div class="secondary-top">
          专属顾问
        </div>
        <div class="secondary-bottom">
          <n-select
            v-model:value="newParams.consultant_id"
            placeholder="请选择专属顾问"
            :options="staffList.map(v => ({
              label: v.nickname,
              value: v.id,
            }))"
            menu-size="large"
            clearable
            remote
            @focus="emit('getStaffList')"
          />
        </div>
      </div>

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

<style scoped lang="scss">
.secondary {
  --uno: 'flex flex-col gap-[8px]';

  &-top {
    --uno: 'font-size-[16px] color-[#333333] dark:color-[#fff]';
  }
}
</style>
