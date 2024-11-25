<script setup lang="ts">
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

// 手机号输入框失去焦点  进行验证码显示
const showCode = async () => {
  try {
    await authStore.getCodeImg()
  }
  catch (error) {
    $toast({
      message: '验证码获取失败',
      theme: 'error',
      icon: 'i-icon:error',
    })
    throw error
  }
}
// 登录
const login = async () => {
  try {
    form.value.captcha_id = authStore.imageCaptcha.id
    const res = await authStore.accountLogin(form.value)
    if (res?.code !== HttpCode.SUCCESS) {
      $toast({
        message: res?.message || '登录失败',
        theme: 'error',
        icon: 'i-icon:error',
      })
      showCode()
    }
  }
  catch (error) {
    $toast({
      message: '登录失败了,请重试',
      theme: 'error',
      icon: 'i-icon:error',
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
  const res = await authStore.getOauthUri(redirect_url || '')
  if (res.code !== HttpCode.SUCCESS) {
    $toast({
      message: res.message,
      theme: 'error',
      icon: 'i-icon:error',
    })
  }
}
const otherList = ref([{
  name: 'wxwork',
  icon: 'i-svg:qwicon',
}])
const otherLogin = (way: string) => {
  switch (way) {
    case 'wxwork':
      QWLogin()
      break
    default:
      break
  }
}
</script>

<template>
  <div class="grid-12">
    <div class="px-[16px] pt-[24px] col-12" uno-sm="col-6 offset-3" uno-lg="offset-4 col-4">
      <login-tips />
      <div class="cardbox blur-bgc rounded-[16px]">
        <login-info v-model="form" :image-captcha="authStore.imageCaptcha" @get-code="showCode" @submit="login" />
        <login-other :list="otherList" @other="otherLogin" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardbox {
  --uno: 'px-[23px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px  pt-36px';
}
</style>
