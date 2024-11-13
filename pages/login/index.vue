<script setup lang="ts">
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '登录',
})
const authStore = useAuth()

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
        <template #other_logins>
          <div class="wh-[32px] rounded-full flex-center-row" @click="QWLogin()">
            <icon name="i-svg:qwicon" size="32" />
          </div>
        </template>
      </login-info>
    </div>
  </div>
</template>
