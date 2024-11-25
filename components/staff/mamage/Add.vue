<script setup lang="ts">
import type { Rules } from 'common-form'
import { pinyin } from 'pinyin-pro'

const emits = defineEmits<{
  submit: [val: addStaffReq]
}>()
const formlist = defineModel({ default: {
  phone: '',
  username: '',
  nickname: '',
  password: '',
  avatar: '',
  email: '',
} })

const toPinyin = () => {
  const pinyinName = pinyin(formlist.value.username, { toneType: 'none', type: 'array' })
  const capitalizedStrings = pinyinName.map(str =>
    str.charAt(0).toUpperCase() + str.substring(1),
  )
  formlist.value.nickname = capitalizedStrings.join('')
}

const rules = ref<Rules<addStaffReq>>({
  phone: [
    {
      message: '手机号不能为空',
      validator: 'required',
    },
  ],
  username: [
    {
      message: '姓名不能为空',
      validator: 'required',
      callback: (val) => {
        formlist.value.username = val.replace(/[^\u4E00-\u9FA5]/g, '')
        toPinyin()
      },
    },
  ],
  nickname: [
    {
      message: '用户名不能为空',
      validator: 'required',
      callback: (val) => {
        formlist.value.nickname = val.replace(/\W/g, '')
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
          <common-form v-model="formlist" :rules="rules" @submit="(val) => emits('submit', val)">
            <template #phone="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  手机号
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.phone" maxlength="11" type="text" class="h-full w-full border-none" placeholder="请输入手机号码" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #username="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  姓名
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.username" type="text" class="h-full w-full border-none" placeholder="请输入姓名" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #nickname="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  用户名
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.nickname" type="text" class="h-full w-full border-none" placeholder="请输入用户名" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #password="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  密码
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.password" type="text" class="h-full w-full border-none" placeholder="请输入密码" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #avatar="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  头像
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.avatar" type="text" class="h-full w-full border-none" placeholder="请输入头像" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #email="{ validate, error }">
              <div class="text-[14px] pb-[12px]">
                <div class="pb-[8px]">
                  email
                </div>
                <div class="h-[40px] px-[12px] rounded-[36px] border border-solid border-[#E6E6E8] overflow-hidden">
                  <input v-model="formlist.email" type="text" class="h-full w-full border-none" placeholder="请输入email" @blur="validate()">
                </div>
                <div class="pt-[8px] pl-[16px] color-red">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #actions="{ submit }">
              <div
                class="text-size-[16px] font-semibold py-[16px]" @click="submit">
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
</style>
