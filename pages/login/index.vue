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
    $toast.error('验证码获取失败')
    throw error
  }
}
if (authStore.token) {
  authStore.token = ''
  authStore.expires_at = 0
}

// // 企业微信登录
const QWLogin = async () => {
  const route = useRoute()
  const redirect_url = route.query?.redirect_url as string
  const res = await authStore.getOauthUri(redirect_url || '')
  if (res?.code !== HttpCode.SUCCESS) {
    $toast.error(res?.message || '登录失败')
  }
}
//  显示状态 wxwork  phone 切换
const status = ref<'wxwork' | 'phone'>('wxwork')
const otherList = ref([{
  name: 'wxwork',
  title: '企业微信',
  icon: 'i-svg:qwicon',
}, {
  name: 'phone',
  title: '手机号登录',
  icon: 'i-icon:phone-icon',
}])
const otherLogin = (way: 'wxwork' | 'phone') => {
  switch (way) {
    case 'wxwork':
      status.value = 'wxwork'
      break
    case 'phone':
      status.value = 'phone'
      break
    default:
      break
  }
}
// 登录
const login = async () => {
  if (status.value !== 'phone') {
    return
  }
  try {
    form.value.captcha_id = authStore.imageCaptcha.id
    const res = await authStore.accountLogin(form.value)
    if (res?.code !== HttpCode.SUCCESS) {
      $toast.error(res?.message || '登录失败')
      showCode()
    }
  }
  catch (error) {
    $toast.error('登录失败,请重试')
    throw error
  }
}

const statusLoading = ref<boolean>(true)

const showSwitch = ref<'product' | 'dev'>('dev')
onMounted(() => {
  if (import.meta.env.DEV === true) {
    // 如果是开发环境, 则显示密码登录
    status.value = 'phone'
    showSwitch.value = 'dev'
    statusLoading.value = false
  }
  else {
    status.value = 'wxwork'
    showSwitch.value = 'product'
    statusLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-[100vh] bg-[#3875C5] flex flex-col items-center justify-center overflow-hidden">
    <div class="grid-12 w-full">
      <div class="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" uno-lg="col-4 offset-4">
        <login-tips />
      </div>
    </div>
    <div
      class="py-[32px] px-[16px] bg-[#fff] bottom-0 w-full h-full grid-12 flex-1 rounded-t-[8px]"
      style="{height:calc(100vh - 157px)}">
      <div class="col-12 flex flex-col justify-around" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" uno-lg="col-4 offset-4">
        <template v-if="status === 'phone'">
          <login-info v-model="form" :image-captcha="authStore.imageCaptcha" @get-code="showCode" @submit="login" />
        </template>
        <template v-if="status === 'wxwork'">
          <login-production @on-wxwork-login="QWLogin" />
        </template>
        <template v-if="showSwitch === 'dev'">
          <login-other :status="status" :list="otherList" @other="otherLogin" />
        </template>
      </div>
    </div>

    <common-loading v-model="statusLoading" />
  </div>
</template>
