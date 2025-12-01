<script setup lang="ts">
import type { Rules } from 'common-form'

const props = defineProps<{
  imageCaptcha: ImageCaptcha
}>()

const emits = defineEmits<{
  submit: [val: AccountReq]
  getCode: []
}>()

const form = defineModel<AccountReq>({ default: {
  phone: '',
  password: '',
  captcha: '',
  captcha_id: '',
} })

const rules = ref<Rules<AccountReq>>({
  phone: [
    {
      message: '手机号不能为空',
      validator: 'required',
    },
    {
      message: '手机号格式不正确',
      validator: 'phone',
      callback: () => {
        emits('getCode')
      },
    },
  ],
  password: [
    {
      message: '密码不能为空',
      validator: 'required',
    },
  ],
  captcha: [
    {
      message: '验证码不能为空',
      validator: 'required',
    },
    {
      message: '验证码长度不正确',
      // 限制验证码长度为 5 个数字
      validator: val => val?.length === 5,
      // 验证通过的回调函数，用于处理输入框的值，去除非数字字符
      callback: (val) => {
        form.value.captcha = val.replace(/\D/g, '')
      },
    },
  ],
})

// 登录
</script>

<template>
  <common-form
    v-model="form" :rules="rules" @submit="(val:AccountReq) => emits('submit', val)">
    <template
      #phone="{
        error,
        validate,
      }">
      <div class="pb-[32px]">
        <div class="flex bg-[#F5F8FD] pl-[16px] rounded-[24px]">
          <icon name="i-icon:login-user" size="24" />
          <input
            v-model="form.phone" class="input " type="text" placeholder="请输入手机号" :maxlength="11" @change="validate()">
          <div class="error">
            {{ error }}
          </div>
        </div>
      </div>
    </template>
    <template
      #password="{
        error,
        validate }">
      <div class="pb-[32px]">
        <div class="flex bg-[#F5F8FD] pl-[16px] rounded-[24px]">
          <icon name="i-icon:login-password" size="24" />
          <input
            v-model="form.password"
            class="input "
            type="password" placeholder="请输入密码" @change="validate()" @blur="validate()">
          <div class="error">
            {{ error }}
          </div>
        </div>
      </div>
    </template>
    <template
      v-if="props.imageCaptcha.code"
      #captcha="{
        error,
        validate }">
      <div class="pb-[32px]">
        <div class="flex bg-[#F5F8FD] pl-[16px] rounded-[24px]">
          <icon name="i-icon:login-code" size="24" />
          <input
            v-model="form.captcha"
            :maxlength="5"
            class="input"
            type="text" placeholder="请输入验证码"
            @change="validate()">
          <div class="h-full" @click="emits('getCode')">
            <img :src="props.imageCaptcha.code" class="h-[40px] rounded-r-[8px]">
          </div>
        </div>
        <div class="error">
          {{ error }}
        </div>
      </div>
    </template>
    <template #actions="{ submit }">
      <div
        class="text-size-[16px] font-semibold" @click="submit">
        <div class="ok">
          登录
        </div>
      </div>
    </template>
  </common-form>
</template>

<style lang="scss" scoped>
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px';
}
.input {
  background: transparent;
  --uno: 'px-[12px] py-[10px]  rounded-[8px] border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none';
}

.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
</style>
