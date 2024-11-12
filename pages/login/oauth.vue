<script setup lang="ts">
const route = useRoute()
const authStore = useAuth()
const statue = ref(0)
const timer = ref()

onMounted(async () => {
  await nextTick()
  const code = route.query?.code as string
  const state = route.query?.state as string
  const redirect_url = route.query?.redirect_url as string
  if (code) {
    const res = await authStore.wxworkLogin({ code, state })
    statue.value = res
    if (res === HttpCode.SUCCESS) {
      timer.value = setTimeout(async () => {
        jump(redirect_url || '/')
      }, 2000)
    }
  }
})
</script>

<template>
  <div class="grid-12">
    <template v-if="statue === 0">
      <div class="flex-center-row text-[20px] px-[20px] py-[120px] color-[#fff] col-12">
        获取授权中...
      </div>
    </template>
    <template v-else-if="statue === HttpCode.SUCCESS">
      <div class="flex-center-row text-[20px] px-[20px] py-[120px] color-[#fff] col-12">
        授权登录成功
        <span>即将返回...</span>
      </div>
    </template>
    <template v-else>
      <div class="flex-center-row text-[20px] px-[20px] py-[120px] color-[#fff] col-12">
        授权登录失败
      </div>
      <div
        class="col-12 px-[20px]"
        uno-lg="col-4 offset-4"
        uno-sm="col-6 offset-3"
        @click="jump('/')">
        <common-button-rounded content="返回首页" />
      </div>
    </template>
  </div>
</template>
