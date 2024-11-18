<script setup lang="ts">
import type { Rules } from 'common-form'

useSeoMeta({
  title: '登录',
})
const { $toast } = useNuxtApp()
const authStore = useAuth()

const form = ref<AccountReq>({
  phone: '',
  password: '',
  captcha: '',
  captcha_id: '',
})

const rules = ref<Rules<AccountReq>>({
  phone: [
    {
      message: '手机号不能为空',
      validator: 'required',
    },
    {
      message: '手机号格式不正确',
      validator: 'phone',
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

// 手机号输入框失去焦点  进行验证码显示
const showCode = async () => {
  if (form.value?.phone.length === 11) {
    try {
      await authStore.getCodeImg()
    }
    catch (error) {
      $toast({
        msg: '验证码获取失败',
        type: 'error',
        ico: 'i-icon:error',
      })
      throw error
    }
  }
}
// 登录
const login = async () => {
  try {
    form.value.captcha_id = authStore.imageCaptcha.id
    const res = await authStore.accountLogin(form.value)

    if (res?.code !== HttpCode.SUCCESS) {
      $toast({
        msg: res?.message || '登录失败',
        type: 'error',
        ico: 'i-icon:error',
      })
      showCode()
    }
  }
  catch (error) {
    $toast({
      msg: '登录失败了,请重试',
      type: 'error',
      ico: 'i-icon:error',
    })
    throw error
  }
}

if (authStore.token) {
  authStore.token = ''
  authStore.expires_at = 0
}

// 企业微信登录
const QWLogin = async () => {
  const route = useRoute()

  const redirect_url = route.query?.redirect_url as string
  const res = await authStore.OAuthLogin(redirect_url || '')
  if (res.code !== HttpCode.SUCCESS) {
    $toast({
      msg: res.message,
      type: 'error',
      ico: 'i-icon:error',
    })
  }
}
</script>

<template>
  <div class="grid-12">
    <div class="px-[16px] pt-[24px] col-12" uno-sm="col-6 offset-3" uno-lg="offset-4 col-4">
      <login-tips />
      <login-info>
        <template #form>
          <common-form
            v-model="form" :rules="rules" @submit="(val) => {
              login()
            }">
            <template
              #phone="{
                error,
                validate,
              }">
              <div class="pb-[32px]">
                <div class="pb-[8px]">
                  手机号
                </div>
                <div class="">
                  <input
                    v-model="form.phone" class="input " type="text" placeholder="请输入手机号" :maxlength="11" @change="() => {
                      const error = validate()
                      if (!error) {
                        showCode()
                      }
                    }"
                  >
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
                <div class="pb-[8px]">
                  密码
                </div>
                <div class="">
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
              v-if="authStore.imageCaptcha.code"
              #captcha="{
                error,
                validate }">
              <div class="pb-[32px]">
                <div class="pb-[8px]">
                  验证码
                </div>
                <div class="relative">
                  <input
                    v-model="form.captcha"
                    :maxlength="5"
                    class="input"
                    type="text" placeholder="请输入验证码"
                    @change="validate()">
                  <div class="absolute right-0 top-0 h-full" @click="showCode()">
                    <img :src="authStore.imageCaptcha.code" class="h-[100%] rounded-r-[8px]">
                  </div>
                </div>
                <div class="error">
                  {{ error }}
                </div>
              </div>
            </template>
            <template #actions="{ submit }">
              <div
                class="text-size-[16px]  font-semibold " @click="submit">
                <div class="ok">
                  登录
                </div>
              </div>
            </template>
          </common-form>
        </template>
        <template #other_logins>
          <div class="wh-[32px] rounded-full flex-center-row" @click="QWLogin()">
            <icon name="i-svg:qwicon" size="32" />
          </div>
        </template>
      </login-info>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] ';
}
.input {
  --uno: 'px-[12px] py-[10px] bg-[#fff] rounded-[8px] border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none';
}
.cardbox {
  --uno: 'px-[23px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px  pt-36px';
  .ok {
    --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
  }
}
</style>
