<script setup lang="ts">
import type { FormRules } from 'naive-ui'

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

const formRef = ref()
const rules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入会员姓名',
    type: 'string',
  },
  phone: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入11位的会员联系方式',
    type: 'string',
  },
  nickname: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入会员昵称',
    type: 'string',
  },
  gender: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择会员性别',
    type: 'number',
  },
  consultant_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择专属顾问',
    type: 'string',
  },
  birthday: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择生日',
    type: 'date',
  },
  anniversary: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择纪念日',
    type: 'date',
  },
},
)
</script>

<template>
  <div class="flex flex-col gap-[12px]">
    <div>
      <n-form ref="formRef" :rules="rules" :model="newParams" label-placement="top">
        <n-form-item path="name" label="会员姓名">
          <n-input
            v-model:value="newParams.name"
            placeholder="请输入会员姓名"
            @keydown.enter.prevent
          />
        </n-form-item>

        <n-form-item path="phone" label="会员联系方式">
          <n-input
            v-model:value="newParams.phone"
            placeholder="请输入会员联系方式"
            @keydown.enter.prevent
          />
        </n-form-item>

        <n-form-item path="nickname" label="会员昵称">
          <n-input
            v-model:value="newParams.nickname"
            placeholder="请输入会员昵称"
            @keydown.enter.prevent
          />
        </n-form-item>

        <n-form-item path="gender" label="会员性别">
          <n-select
            v-model:value="showToUser"
            placeholder="请选择会员性别"
            :options="selectOptions"
            @blur="() => {
              newParams.gender = showToUser as any
            }"
          />
        </n-form-item>

        <n-form-item path="consultant_id" label="专属顾问">
          <n-select
            v-model:value="newParams.consultant_id"
            placeholder="请选择专属顾问"
            :options="staffList.map(v => ({
              label: v.nickname,
              value: v.id,
            }))"
            clearable
            remote
            @focus="emit('getStaffList')"
          />
        </n-form-item>

        <n-form-item path="birthday" label="生日">
          <n-date-picker
            v-model:value="birthday"
            clearable
            format="yyyy-MM-dd"
            type="date"
            @blur="handleDateBlur('birthday')"
          />
        </n-form-item>

        <n-form-item path="anniversary" label="纪念日">
          <n-date-picker
            v-model:value="anniversary"
            clearable
            format="yyyy-MM-dd"
            type="date"
            @blur="handleDateBlur('anniversary')"
          />
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.secondary {
  --uno: 'flex flex-col gap-[8px] col-6';

  &-top {
    --uno: 'font-size-[16px] color-[#333333] dark:color-[#fff]';
  }
}
</style>
