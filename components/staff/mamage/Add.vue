<script setup lang="ts">
import type { Rules } from 'common-form'

const emits = defineEmits<{
  submit: [val: addStaffAccount]
}>()
const formlist = defineModel({ default: {
  account: {
    phone: '',
    nickname: '',
    password: '',
    avatar: '',
    email: '',
    gender: 0,
  },
} })

const rules = ref<Rules<addStaffAccount>>({
  phone: [
    {
      message: '手机号不能为空',
      validator: 'required',
    },
  ],
  nickname: [
    {
      message: '姓名不能为空',
      validator: 'required',
      callback: (val) => {
        formlist.value.account.nickname = val.replace(/[^\u4E00-\u9FA5]/g, '')
      },
    },
  ],

  password: [
    {
      message: '密码不能为空',
      validator: 'required',
    },
  ],
  avatar: [
    {
      message: '头像不能为空',
      validator: 'required',
    },
  ],
  email: [
    {
      message: '请输email入邮箱地址',
      validator: 'required',
    },
  ],
})
</script>

<template>
  <div>
    <div class="pb-[16px]">
      <common-fold title="新增员工" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <common-form v-model="formlist.account" :rules="rules" @submit="(val) => emits('submit', val)">
            <template #phone="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="label">
                  手机号
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.account.phone" maxlength="11" type="text" class="input-item" placeholder="请输入手机号码" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #nickname="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="label">
                  姓名
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.account.nickname" type="text" class="input-item" placeholder="请输入姓名" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>

            <template #password="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="label">
                  密码
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.account.password" type="text" class="input-item" placeholder="请输入密码" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #avatar="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="label">
                  头像
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.account.avatar" type="text" class="input-item" placeholder="请输入头像" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #email="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="label">
                  email
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.account.email" type="text" class="input-item" placeholder="请输入email" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #actions="{ submit }">
              <div
                class="text-size-[16px] font-semibold py-[16px] cursor-pointer" @click="submit">
                <div class="ok">
                  登录
                </div>
              </div>
            </template>
          </common-form>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}
</style>
