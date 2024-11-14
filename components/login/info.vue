<script setup lang="ts">
const { $toast } = useNuxtApp()
const authStore = useAuth()
// 账号输入
const account = ref<AccountReq>({
  phone: '',
} as AccountReq)

// 手机号输入框失去焦点  进行验证码显示
const getImg = async () => {
  if (account.value.phone.length === 11) {
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
// 点击登录按钮
const login = async () => {
  if (!account.value?.phone || account.value?.phone.trim() === '' || account.value?.phone.length !== 11) {
    $toast({ msg: '请输入正确手机号', type: 'error', ico: 'i-icon:error' })
    return false
  }
  if (!account.value?.password || account.value?.password.trim() === '') {
    $toast({ msg: '请输入密码', type: 'error', ico: 'i-icon:error' })
    return false
  }
  if (!account.value?.captcha || account.value?.captcha.trim() === '') {
    $toast({ msg: '请输入验证码', type: 'error', ico: 'i-icon:error' })
    return false
  }

  try {
    account.value.captcha_id = authStore.imageCaptcha.id
    const res = await authStore.accountLogin(account.value)

    if (res?.code !== HttpCode.SUCCESS) {
      $toast({
        msg: res?.message || '登录失败',
        type: 'error',
        ico: 'i-icon:error',
      })
      getImg()
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
watch(() => account.value.phone, async (newPhone, _) => {
  if (newPhone.length === 11 && !authStore.imageCaptcha.id) {
    await getImg()
  }
}, { deep: true })
</script>

<template>
  <div class="cardbox blur-bgc rounded-[16px]">
    <div>
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        手机号
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px]">
        <input
          v-model="account.phone" type="text" class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none "
          maxlength="11" placeholder="全部"
        >
      </div>
    </div>

    <div class="mt-[32px]">
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        密码
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px] ">
        <form>
          <input
            v-model="account.password" type="password" autocomplete=" " class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none" placeholder="密码"
          >
        </form>
      </div>
    </div>

    <div v-if="account.phone.length === 11" class="mt-[32px]">
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        验证码
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px] flex-between relative">
        <form>
          <input
            v-model="account.captcha" maxlength="5" type="text" autocomplete="" class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none" placeholder="验证码"
          >
        </form>
        <div class="absolute right-0 top-0 h-full" @click="getImg()">
          <nuxt-img :src="authStore.imageCaptcha.code" class="h-[100%] rounded-r-[8px]" />
        </div>
      </div>
    </div>

    <div class="text-size-[16px]  font-semibold offset-5 mt-[32px]" @click="login()">
      <div class="ok ">
        登录
      </div>
    </div>

    <div class="px-[20px] mt-[112px] flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        其他登录方式
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <div class="flex-center-row py-[24px]">
      <slot name="other_logins" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardbox {
  --uno: 'px-[23px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px  pt-36px';
  .ok {
    --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
  }
}
</style>
