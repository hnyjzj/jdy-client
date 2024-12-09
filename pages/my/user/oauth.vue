<script setup lang="ts">
const route = useRoute()
const staff = useStaff()
const timer = ref()

const content = ref<{
  title: string
  content?: string
  loading?: boolean
}>({
  title: '获取授权中',
  loading: true,
})

onMounted(async () => {
  await nextTick()
  const code = route.query?.code as string

  const redirect_url = route.query?.redirect_url as string
  if (code) {
    const { code: rcode, message } = await staff.updateStaff({ platform: 'wxwork', wxwork: { code } })
    if (rcode === HttpCode.SUCCESS) {
      content.value = {
        title: '授权成功',
        loading: true,
      }
      timer.value = setTimeout(async () => {
        jump(redirect_url || '/')
      }, 2000)
    }
    else {
      content.value = {
        title: '授权失败',
        content: message,
        loading: false,
      }
    }
  }
})
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
})
const jumpLogin = () => {
  if (content.value.loading) {
    return false
  }
  const params = {} as {
    redirect_url?: string
  }
  const redirect_url = route.query?.redirect_url as string || '/'
  if (!redirect_url.startsWith('/login')) {
    params.redirect_url = redirect_url
  }
  jump('/login', params)
}
</script>

<template>
  <div>
    <div class="grid-12 px-[16px] pt-[64px] pb-[24px]">
      <div
        class="col-12 bg-[#FFFFFFCC] rounded-[16px] py-[32px] px-[16px]"
        uno-lg="col-4 offset-4"
        uno-sm="col-6 offset-3">
        <div class="flex-center-col ">
          <common-empty
            :img="content.loading ? '/images/empty/authorize.png' : '/images/empty/autherror.png'"
            deg="45deg"
            size="160px"
            :is-shadow="false"
            :show-r-t="!content.loading" />
          <div class="p-[16px] color-[#333] text-[20px]">
            {{ content.title }}
          </div>
          <template v-if="content.content">
            <div class="p-[16px] color-[#666] text-[16px]">
              {{ content.content }}
            </div>
          </template>
        </div>
      </div>
      <div
        class="col-12 pt-[24px]"
        uno-lg="col-4 offset-4 pt-[48px]"
        uno-sm="col-6 offset-3">
        <common-button-rounded
          :bgc="content.loading ? 'linear-gradient(180deg, #1A6BEB80 50%, #6EA6FF80)' : 'linear-gradient(0deg, #6ea6ffbf 11%, #1a6beb)'"
          padding="12px"
          content="返回登录页" @click="jumpLogin()" />
      </div>
    </div>
  </div>
</template>
