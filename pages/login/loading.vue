<script lang="ts" setup>
// 登录分流页面

const show = ref(true)
const { $toast } = useNuxtApp()
const authStore = useAuth()
const QWLogin = async () => {
  const route = useRoute()
  const redirect_url = route.query?.redirect_url as string

  const res = await authStore.getOauthUri(redirect_url || '')
  if (res) {
    if (res?.code !== HttpCode.SUCCESS) {
      $toast.error(res?.message || '登录失败')
    }
  }
}

if (import.meta.client) {
  const route = useRoute()
  const redirect_url = route.query?.redirect_url as string
  if (isWxWorkClient() || isWeChatClient()) {
    if (import.meta.env.DEV === true) {
      navigateTo(`/login?redirect_url=${redirect_url || ''}`, { external: true, replace: true, redirectCode: 200 })
    }
    else {
      QWLogin()
    }
  }
  else {
    navigateTo(`/login?redirect_url=${redirect_url || ''}`, { external: true, replace: true, redirectCode: 200 })
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <n-spin :show="show" stroke="#fff">
      <div class="w-[200px] h-[200px] flex justify-center items-center" />
      <template #description>
        <div class="color-[#fff] text-[16px] pt-[20px]">
          加载中...
        </div>
      </template>
    </n-spin>
  </div>
</template>

<style lang="scss" scoped>
 :deep(.n-base-loading__icon) {
  font-size: 34px !important;
}
</style>
